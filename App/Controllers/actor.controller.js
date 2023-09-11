import { Sequelize } from 'sequelize'
import Actors from '../Models/actor.model.js'
import { QueryParamsHandle } from '../../Middleware/helpers.js'

// Kalder sq Operator til search clause
const Op = Sequelize.Op;

class ActorController {
	// Metode list - henter alle records
	list = async (req, res) => {
		const qp = QueryParamsHandle(req, 'id, name, description, image')

		try {
			const result = await Actors.findAll({
				// Definerer array med felter
				order: [qp.sort_key],			
				limit: qp.limit,
				attributes: qp.attributes
			})
			// Parser resultat som json
			res.json(result)	
		} catch(err) {
			res.status(418).send({
				message: `Something went wrong: ${err}`
			})
		}
	}

	// Metode get - henter record ud fra id
	details = async (req, res) => {
		const { id } = req.params

		if(id) {
			try {
				// Sætter resultat efter sq metode
				const result = await Actors.findOne({
					// Where clause
					where: { id: id},
					attributes: ['id', 'name', 'description', 'image'],
				});
				// Parser resultat som json
				res.json(result)
			} catch(err) {
				res.status(418).send({
					message: `Something went wrong: ${err}`
				})
			}
		}
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
			try{
				const model = await Actors.create(req.body)
				return res.json({
					message: `Record created`,
					newId: model.id
				})	
			} catch (err) {
				res.status(418).send({
					message: `Could not create record: ${err}`
				})
			}
		} else {
			res.status(403).send({
				message: "Wrong parameter values"
			})
		}
	}

	/**
	 * Update Metode - opdaterer event
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 */	
	 update = async (req, res) => {
		const { id } = req.params.id
		const { name, description, image } = req.body

		if(id && name && description && image) {
			try {
				const model = await Actors.update(req.body, {
					where: {id: id}
				})	
				return res.json({
					message: `Record updated`
				})
			} catch (err) {
				console.error(err);
				res.status(418).send({
					message: "Could not create record"
				})

			}
		} else {
			res.status(403).send({
				message: "Wrong parameter values"
			})
		}
	}

	/**
	 * Delete Metode - sletter skuespiller ud fra id i url parameter
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 */	
	remove = async (req, res) => {
		const { id } = req.params.id

		if(id) {
			try {
				await Actors.destroy({ 
					where: { id: req.params.id }
				})
				res.status(200).send({
					message: "Actor deleted"
				})
			}
			catch(err) {
				res.status(418).send({
					message: `Could not create record: ${err}`
				})
			}	
		} else {
			res.status(403).send({
				message: "Wrong parameter values"
			})
		}
	}	
}

export default ActorController