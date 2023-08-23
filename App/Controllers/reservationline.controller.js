import ReservationLines from '../Models/reservationline.model.js'

class ReservationLineController {

	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	list = async (req, res) => {
		const result = await ReservationLines.findAll({
			attributes: ['seat_id', 'order_id']
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
		const result = await ReservationLines.findOne({
			attributes: ['id', 'seat_id', 'order_id'],
			where: { id: req.params.id}
		});
		res.json(result)
	}

	/**
	 * Create Metode - opretter ny record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {number} Returnerer nyt id
	 */
	 create = async (obj) => {
		const { seat_id, order_id } = obj

		if(seat_id && order_id) {
			const model = await ReservationLines.create(obj)
			return res.json({newId: model.id})
		} else {
			res.send(418)
		}
	}	

	/**
	 * Update Metode - opdaterer record
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {boolean} Returnerer true/false
	 */	
	 update = async (req, res) => {
		const { name } = req.body

		if(name) {
			const model = await ReservationLines.update(req.body, {
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
				where: { id: req.params.id }
			})
			res.sendStatus(200)
		}
		catch(err) {
			res.send(err)
		}
	}	
}

export default ReservationLineController