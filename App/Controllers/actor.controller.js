import { Sequelize } from 'sequelize'
import Actors from '../Models/actor.model.js'
import { QueryParamsHandle } from '../../Middleware/helpers.js'

// Kalder sq Operator til search clause
const Op = Sequelize.Op;

class ActorController {
	// Metode list - henter alle records
	list = async (req, res) => {
		const qp = QueryParamsHandle(req, 'id, name')

		const result = await Actors.findAll({
			// Definerer array med felter
			order: [qp.sort_key],			
			limit: qp.limit,
			attributes: qp.attributes
		})
		// Parser resultat som json
		res.json(result)
	}

	// Metode get - henter record ud fra id
	get = async (req, res) => {
		// Sætter resultat efter sq metode
		const result = await Actors.findOne({
			// Where clause
			where: { id: req.params.id},
			attributes: ['id', 'name', 'description', 'image'],
		});
		// Parser resultat som json
		res.json(result)
	}

	/**
	 * Create Metode - opretter nyt event
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 * @return {number} Returnerer nyt id
	 */
	 create = async (req, res) => {
		const { name, description, image } = req.body

		if(name && description && image) {
			const model = await Actors.create(req.body)
			return res.json({newId: model.id})
		} else {
			res.send(418)
		}
	}

	/**
	 * Update Metode - opdaterer event
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 */	
	 update = async (req, res) => {
		const { name, description, image } = req.body

		if(name && description && image) {
			const model = await Actors.update(req.body, {
				where: {id: req.params.id}
			})
			return res.json({status: true})
		} else {
			res.send(418)
		}
	}

	/**
	 * Delete Metode - sletter skuespiller ud fra id i url parameter
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 */	
	remove = async (req, res) => {
		try {
			await Actors.destroy({ 
				where: { id: req.params.id }
			})
			res.sendStatus(200)
		}
		catch(err) {
			res.send(err)
		}
	}	
}

export default ActorController