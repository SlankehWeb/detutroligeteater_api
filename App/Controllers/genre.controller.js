import Genres from '../Models/genre.model.js'

class GenreController {

	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	list = async (req, res) => {
		const result = await Genres.findAll({
			attributes: ['id', 'name'],
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
		const result = await Genres.findOne({
			attributes: ['id', 'name'],
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
		const { name } = req.body

		if(name) {
			const model = await Genres.create(req.body)
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
			const model = await Genres.update(req.body, {
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
			await Genres.destroy({ 
				where: { id: req.params.id }
			})
			res.sendStatus(200)
		}
		catch(err) {
			res.send(err)
		}
	}	
}

export default GenreController