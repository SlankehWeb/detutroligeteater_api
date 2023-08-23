import fs from 'fs'
import csv from 'csv-parser'
import path from 'path';
import sequelize from '../../Config/sequelize.config.js';

import Orgs from '../../Core/Models/org.model.js';
import Groups from '../../Core/Models/group.model.js';
import Users from '../../Core/Models/user.model.js';
import Stages from '../../App/Models/stage.model.js';
import Genres from '../../App/Models/genre.model.js';
import Actors from '../../App/Models/actor.model.js';
import Events from '../../App/Models/event.model.js';
import EventActorRel from '../../App/Models/event-actor-rel.model.js';
import Seats from '../../App/Models/seat.model.js';
import { log } from 'console';

/**
 * Controller for Seed Actions
 */
class SeedController {
	constructor() {
		console.log('Class Seed Controller: Running seeds');
	} 

	seed_from_csv = async () => {

		const transaction = await sequelize.transaction();
	
		try {

			// Orgs
			const orgData = await this.get_csv_data('org.csv')
			const insertedOrgs = await Orgs.bulkCreate(orgData, { transaction });

			// Groups
			const groupData = await this.get_csv_data('group.csv')
			const insertedGroups = await Groups.bulkCreate(groupData, { transaction });

			// User
			const userData = await this.get_csv_data('user.csv')
			const insertedUser = await Users.bulkCreate(userData, { transaction });

			// Genre
			const genreData = await this.get_csv_data('genre.csv')
			const insertedGenre = await Genres.bulkCreate(genreData, { transaction });

			// Stages
			const stageData = await this.get_csv_data('stage.csv')
			const insertedStage = await Stages.bulkCreate(stageData, { transaction });

			// Seats
			const seatsData = await this.get_csv_data('seat.csv')
			const insertedSeats = await Seats.bulkCreate(seatsData, { transaction });

			// Events
			const eventsData = await this.get_csv_data('event.csv')
			const insertedEvents = await Events.bulkCreate(eventsData, { transaction });

			// Actors
			const actorData = await this.get_csv_data('actor.csv')
			const insertedActors = await Actors.bulkCreate(actorData, { transaction });
		
			// Actors Events Relations
			const eventActorData = await this.get_csv_data('event_actor_rel.csv')
			const insertedEventActors = await EventActorRel.bulkCreate(eventActorData, { transaction });

			// Confirm transaction
			await transaction.commit();
		
			console.log('Seeding completed');
		} catch (error) {
			// Hvis der opstår en fejl, rul tilbage transaktionen
			await transaction.rollback();
			console.error('Seeding error:', error);
		}		
	}

	get_csv_data = async file => {
		const csvpath = path.resolve(`./Data/${file}`);
		const data = []

		return new Promise((resolve, reject) => {
			fs.createReadStream(csvpath)
			.pipe(csv())
			.on('data', row => {
				data.push(row)
			})
			.on('end', async () => {
				resolve(data);
			})
			.on('error', error => {
				reject(error)
			})
		}) 

	}
}

export default SeedController