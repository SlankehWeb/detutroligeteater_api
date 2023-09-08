import Reservations from '../Models/reservation.model.js'
import ReservationLines from '../Models/reservationline.model.js';
import Seats from '../Models/seat.model.js';
import Events from '../Models/event.model.js';
import Stages from '../Models/stage.model.js';
import { QueryParamsHandle } from '../../Middleware/helpers.js';

// Sætter modellers relationelle forhold - een til mange
Reservations.hasMany(ReservationLines)
ReservationLines.belongsTo(Reservations)

// Sætter modellers relationelle forhold - een til mange
Seats.hasMany(ReservationLines)
ReservationLines.belongsTo(Seats)

// Sætter modellers relationelle forhold - een til mange
Events.hasMany(Reservations)
Reservations.belongsTo(Events)

// Sætter modellers relationelle forhold - een til mange
Stages.hasMany(Events)
Events.belongsTo(Stages)

class ReservationController {
	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	 list = async (req, res) => {
		const { event_id } = req.query
		const qp = QueryParamsHandle(req, 'id, firstname')

		const dataObj = {
			order: [qp.sort_key],
			limit: qp.limit,
			attributes: qp.attributes
		}

		if(event_id) {
			dataObj.where = { event_id: event_id }
		}

		try {
			const result = await Reservations.findAll(dataObj)
			// Parser resultat som json
			res.json(result)				
		} catch (error) {
			res.status(418).send({
				message: `Something went wrong: ${error}`
			})						
		}
	}

	/**
	 * GET Metode henter record ud fra id
	 * @param {object} req 
	 * @param {object} res 
	 * @return {object} Returnerer JSON object med detaljer
	 */
	 details = async (req, res) => {
		const { id } = req.params

		if(id) {
			try {
				// Sætter resultat efter sq metode
				const result = await Reservations.findOne({
					attributes: ['id','firstname', 'lastname', 'address', 'zipcode', 'city', 
									'email', 'created_at'
					],
					include: [
						{
							model: Events,
							attributes: [['id','event_id'], 'title', 'price'],
							include: {
								model: Stages,
								attributes: ['name']
							}
						},
						{
							model: ReservationLines,
							attributes: ['seat_id'],
							include: {
								model: Seats,
								attributes: ['number']
							}
						}
					],
					// Where clause
					where: { id: id}
				});
				// Parser resultat som json
				res.json(result)
			} catch (error) {
				res.status(418).send({
					message: `Something went wrong: ${error}`
				})										
			}
		} else {
			res.status(403).send({
				message: 'Wrong parameter values'
			})
		}
	}
	/**
	 * Create Metode - opretter ny record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {number} Returnerer nyt id
	 */
	 create = async (req, res) => {
		const { firstname, lastname, address, zipcode, city, seats } = req.body
		const lines = []

		if(firstname && lastname && address && zipcode && city) {

			try {
				const model = await Reservations.create(req.body)

				await Promise.all(seats.map(async seat => {
					try {
						const newline = await ReservationLines.create({
							seat_id: seat, 
							reservation_id: model.id
						})
						lines.push(newline.dataValues.id);	
					} catch (err) {
						console.error('Kunne ikke oprette reservationslinje')
					}
				}))

				return res.json({
					message: `Record created`,
					newId: model.id,
					// reservation_line_ids: lines
				})
			} catch (error) {
				res.status(418).send({
					message: `Could not create record: ${error}`
				})														
			}
		} else {
			res.status(403).send({
				message: 'Wrong parameter values'
			})
		}
	}	

	/**
	 * Update Metode - opdaterer record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {boolean} Returnerer true/false
	 */	
	 update = async (req, res) => {
		const { id } = req.params
		const { firstname, lastname, address, zipcode, city } = req.body

		if(firstname && lastname && address && zipcode && city) {
			try {
				const model = await Reservations.update(req.body, {
					where: {id: id}
				})
				return res.json({
					message: `Record updated`
				})
			} catch (error) {
				res.status(418).send({
					message: `Could not update record: ${error}`
				})																		
			}
		} else {
			res.status(403).send({
				message: 'Wrong parameter values'
			})
		}
	}

	/**
	 * Delete Metode - sletter record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {boolean} Returnerer true/false
	 */	
	remove = async (req, res) => {
		const { id } = req.params

		if(id) {
			try {
				await ReservationLines.destroy({ 
					where: { reservation_id: id }
				})
				await Reservations.destroy({ 
					where: { id: id }
				})
				res.status(200).send({
					message: `Record deleted`
				})
			}
			catch(error) {
				res.status(418).send({
					message: `Could not delete record: ${error}`
				})																		
			}	
		} else {
			res.status(403).send({
				message: 'Wrong parameter values'
			})
		}
	}		

}

export default ReservationController