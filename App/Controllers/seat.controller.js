import Seats from '../Models/seat.model.js'

class SeatController {

	/**
	 * List Metode - henter alle records
	 * @param {object} req 
	 * @param {object} res 
	 * @return {array} Returnerer JSON array
	 */
	list = async (req, res) => {
		const result = await Seats.findAll({
			attributes: ['id', 'stage_id', 'row', 'number'],
		})
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
		const { stage_id, rows, cols } = req.body

		if(stage_id && rows && cols) {
			for(let i = 1; i <= rows; i++) {
				for(let j = 1; j <= cols; j++) {
					let obj = {
						stage_id: stage_id,
						row: i,
						number: j
					}
					const model = await Seats.create(obj)
				}
			}
			return res.json(true)
		} else {
			res.send(418)
		}
	}	
}

export default SeatController