import express from 'express'
import sequelize from '../Config/sequelize.config.js'

// Core Models
import UserModel from '../Core/Models/user.model.js'
import GroupModel from '../Core/Models/group.model.js'
import OrgModel from '../Core/Models/org.model.js'

// App Models
import Stages from '../App/Models/stage.model.js'
import Genres from '../App/Models/genre.model.js'
import Actors from '../App/Models/actor.model.js'
import Events from '../App/Models/event.model.js'
import Seats from '../App/Models/seat.model.js'
import Favorites from '../App/Models/favorite.model.js'
import Reservations from '../App/Models/reservation.model.js'
import ReservationLines from '../App/Models/reservationline.model.js'
import EventActorRel from '../App/Models/event-actor-rel.model.js'
import Reviews from '../App/Models/review.model.js'
import SeedController from '../Core/Controllers/seed.controller.js'

const InstallRouter = express.Router()

InstallRouter.get('/install', async (req, res) => {
	const seeder = new SeedController() 
	try {
		await sequelize.sync({ force: true })
		await seeder.seed_from_csv()
		res.sendStatus(200)
	}
	catch(err) {
		res.send(err)
	}
})

export default InstallRouter