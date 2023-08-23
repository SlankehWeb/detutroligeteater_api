import decodeToken from '../Middleware/decodeToken.js'
import Reservations from '../Models/order.model.js'
import ReservationLines from '../Models/orderline.model.js';
import SeatModel from '../Models/seat.model.js';
import EventModel from '../Models/event.model.js';
import StageModel from '../Models/stage.model.js';
import { QueryParamsHandle } from '../Middleware/Helpers.js';

// Sætter modellers relationelle forhold - een til mange
Reservations.hasMany(ReservationLines)
ReservationLines.belongsTo(Reservations)

// Sætter modellers relationelle forhold - een til mange
SeatModel.hasMany(ReservationLines)
ReservationLines.belongsTo(SeatModel)

// Sætter modellers relationelle forhold - een til mange
EventModel.hasMany(Reservations)
Reservations.belongsTo(EventModel)

// Sætter modellers relationelle forhold - een til mange
StageModel.hasMany(EventModel)
EventModel.belongsTo(StageModel)

class OrderController {
	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	 list = async (req, res) => {
		const qp = QueryParamsHandle(req, 'id, firstname')

		const result = await Reservations.findAll({
			order: [qp.sort_key],
			limit: qp.limit,
			attributes: qp.attributes
		})
		// Parser resultat som json
		res.json(result)
	}

	/**
	 * GET Metode henter record ud fra id
	 * @param {object} req 
	 * @param {object} res 
	 * @return {object} Returnerer JSON object med detaljer
	 */
	 get = async (req, res) => {
		// Sætter resultat efter sq metode
		const result = await Reservations.findOne({
			attributes: ['firstname', 'lastname', 'address', 'zipcode', 'city', 
							'email', 'created_at'
			],
			include: [
				{
					model: EventModel,
					attributes: [['id','event_id'], 'title', 'price'],
					include: {
						model: StageModel,
						attributes: ['name']
					}
				},
				{
					model: ReservationLines,
					attributes: ['seat_id'],
					include: {
						model: SeatModel,
						attributes: ['row', 'number']
					}
				}
			],
			// Where clause
			where: { id: req.params.id}
		});
		// Parser resultat som json
		res.json(result)
	}
	/**
	 * Create Metode - opretter ny record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {number} Returnerer nyt id
	 */
	 create = async (req, res) => {
		req.body.user_id = decodeToken(req).user_id
		const { firstname, lastname, address, zipcode, city, seats } = req.body
		const lines = []

		if(firstname && lastname && address && zipcode && city) {
			const model = await Reservations.create(req.body)
			seats.map(async seat => {
				const newline = await ReservationLines.create({seat_id: seat, order_id: model.id})
				lines.push(newline.id);
				
			})
			console.log(lines);
			return res.json({newId: model.id, lines: lines})
		} else {
			res.sendStatus(418)
		}
	}	

	/**
	 * Update Metode - opdaterer record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {boolean} Returnerer true/false
	 */	
	 update = async (req, res) => {
		const { firstname, lastname, address, zipcode, city } = req.body

		if(firstname && lastname && address && zipcode && city) {
			const model = await Reservations.update(req.body, {
				where: {id: req.params.id}
			})
			return res.json({status: true})
		} else {
			res.send(418)
		}
	}

	/**
	 * Delete Metode - sletter record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {boolean} Returnerer true/false
	 */	
	remove = async (req, res) => {
		try {
			await ReservationLines.destroy({ 
				where: { order_id: req.params.id }
			})
			await Reservations.destroy({ 
				where: { id: req.params.id }
			})
			res.sendStatus(200)
		}
		catch(err) {
			res.send(err)
		}
	}		

}

export { OrderController }