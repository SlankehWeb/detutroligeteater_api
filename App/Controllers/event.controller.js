import { Sequelize } from 'sequelize'
import Events from '../Models/event.model.js'
import GenreModel from '../Models/genre.model.js';
import Actors from '../Models/actor.model.js';
import StageModel from '../Models/stage.model.js';
import { QueryParamsHandle } from '../../Middleware/helpers.js';

// Kalder sq Operator til search clause
const Op = Sequelize.Op;

// Sætter modellers relationelle forhold - een til mange
GenreModel.hasMany(Events)
Events.belongsTo(GenreModel)

// Sætter modellers relationelle forhold - een til mange
StageModel.hasMany(Events)
Events.belongsTo(StageModel)

// Sætter modellers relationelle forhold - mange til mange
Actors.belongsToMany(Events, {
through: 'event_actor_rel',
	as: 'events',
	foreignKey: 'actor_id'
})
Events.belongsToMany(Actors, {
	through: 'event_actor_rel',
	as: 'actors',
	foreignKey: 'event_id'
})

class EventController {

	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	list = async (req, res) => {
		const qp = QueryParamsHandle(req, 'id, title')

		// Kalder SQ model
		const result = await Events.findAll({
			order: [qp.sort_key],
			limit: qp.limit,
			attributes: qp.attributes,
			include: [{
				model: GenreModel,
				attributes: ['id', 'name']
			},
			{
				model: StageModel,
				attributes: ['id', 'name']
			}]
		})
		// Parser resultat som json
		res.json(result)
	}

	/**
	 * Search Metode - henter alle records ud fra en funden søgestrengf 
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	 search = async(req, res) => {
		// Sætter resultat med sq metode
		const result = await Events.findAll({
			// where clause
			where: {
				// Søg på titel
				title: {
					[Op.like]: `%${req.query.keyword}%`
				},
				// Søg på titel
				description: {
					[Op.like]: `%${req.query.keyword}%`
				} 
			},
			// Attributter: array med felter
			attributes: ['id', 'title', 'image', 'startdate', 'stopdate'],
			// Inkluderer relationelle data fra artist via id
			include: [{
				model: GenreModel,
				attributes: ['id', 'name']
			},
			{
				model: StageModel,
				attributes: ['id', 'name']
			}]
		})
		// Parser result som json
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
		const result = await Events.findOne({
			attributes: [
				'id', 'title', 'description', 'image', 'startdate', 'stopdate', 'duration_minutes',
				'price', 'created_at'
			],
			include: [{
				model: GenreModel,
				attributes: ['id', 'name']
			}, {
				model: StageModel,
				attributes: ['id', 'name']
			}],
			// Where clause
			where: { id: req.params.id}
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
		const { 
				title, description, image, startdate, stopdate, duration_minutes, 
				price, genre_id, stage_id } = req.body

		if(title && description && image && startdate && stopdate && genre_id && stage_id) {
			const model = await Events.create(req.body)
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
		const { title, description, image, startdate, stopdate, duration_minutes, 
			price, genre_id, stage_id } = req.body

		if(title && description && image && startdate && stopdate) {
			const model = await Events.update(req.body, {
				where: {id: req.params.id}
			})
			return res.json({status: true})
		} else {
			res.send(418)
		}
	}

	/**
	 * Delete Metode - sletter bruger ud fra id i url parameter
	 * @param {object} req Request Object
	 * @param {object} res Response Object
	 */	
	remove = async (req, res) => {
		try {
			await Events.destroy({ 
				where: { id: req.params.id }
			})
			res.sendStatus(200)
		}
		catch(err) {
			res.send(err)
		}
	}	
}

export default EventController