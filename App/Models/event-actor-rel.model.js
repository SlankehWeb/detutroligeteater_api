import sequelize from "../../Config/sequelize.config.js";
import { DataTypes, Model } from "sequelize";
import Events from "./event.model.js";
import Actors from "./actor.model.js";

class EventActorRel extends Model{}

EventActorRel.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	event_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Events,
			key: 'id'
		}
	},
	actor_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: Actors,
			key: 'id'
		}

	}
}, {
	sequelize,
	modelName: 'event_actor_rel',
	freezeTableName: true,
	underscored: true,
	timestamps: false
})

export default EventActorRel