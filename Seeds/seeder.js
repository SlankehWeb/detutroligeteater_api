import sequelize from '../Config/sequelize.config.js'

// App Models
import StageModel from '../App/Models/stage.model.js'

const stages = [
	{
	  id: 1,
	  name: 'Storescenen',
	  createdAt: new Date(),
	  updatedAt: new Date(),
	},
	{
	  id: 2,
	  name: 'Kælderscenen',
	  createdAt: new Date(),
	  updatedAt: new Date(),
	}
];

const seedData = async () => {
	try {
		await StageModel.bulkCreate(stages);
		console.log('Seed data inserted successfully');
	  } catch (error) {
		console.error('Error inserting seed data:', error);
	  }  
}

export default seedData

