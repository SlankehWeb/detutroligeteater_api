import sequelize from '../../Config/sequelize.config.js'
import { DataTypes, Model } from 'sequelize'

// Skriver ny klasse og udvider den med SQ's Model klasse
class Favorites extends Model {}

// Initialiserer model
Favorites.init({
	// Definerer felt egenskaber
	user_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	event_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	}
}, {
	sequelize, // Sequelize objekt
	modelName: 'favorite', // Model (tabel) navn
	underscored: true, // Brug underscore istedet for camelcase
	//freezeTableName: false, // Lås tabelnavne til ental
	//createdAt: true, // Undlad createdAt felt
	//updatedAt: true //Undlad updatedAt felt
})

export default Favorites