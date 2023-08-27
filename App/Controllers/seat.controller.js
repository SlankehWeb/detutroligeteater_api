import Seats from '../Models/seat.model.js'
import Stages from '../Models/stage.model.js';

// Relation - one to many
Stages.hasMany(Seats)
Seats.belongsTo(Stages)

class SeatController {

	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	list = async (req, res) => {

		try {
			const result = await Seats.findAll({
				attributes: ['id', 'number'],
				include: {
					model: Stages
				}
			})
			// Parser resultat som json
			res.json(result)				
		} catch (error) {
			res.status(418).send({
				message: `Something went wrong: ${error}`
			})						
		}
	}	
}

export default SeatController