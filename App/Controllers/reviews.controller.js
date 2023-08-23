import decodeToken from '../Middleware/decodeToken.js'
import Reviews from '../Models/reviews.model.js'

class ReviewsController {

	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	list = async (req, res) => {
		const result = await Reviews.findAll({
			attributes: ['id', 'subject', 'num_stars', 'created_at'],
			where: { event_id: req.params.event_id }

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
		const result = await Reviews.findOne({
			attributes: ['id', 'subject', 'comment', 'num_stars', 'created_at'],
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
	 create = async (req, res) => {
		req.body.user_id = decodeToken(req).user_id
		const { subject, comment, num_stars, event_id } = req.body


		if(subject && comment && num_stars && event_id) {
			const model = await Reviews.create(req.body)
			return res.json({newId: model.id})
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
		const { subject, comment, num_stars, event_id, active } = req.body

		if(subject && comment && num_stars && event_id) {
				const model = await Reviews.update(req.body, {
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
			await Reviews.destroy({ 
				where: { id: req.params.id }
			})
			res.sendStatus(200)
		}
		catch(err) {
			res.send(err)
		}
	}	
}

export default ReviewsController