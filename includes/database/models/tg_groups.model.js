module.exports = function({ sequelize }) {
    const { DataTypes } = require("sequelize"); 
	const TGroups = sequelize.define('tg_groups', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		tg_id: {
			type: DataTypes.BIGINT,
			unique: true
		},
		tg_name: {
			type: DataTypes.STRING
		},
		flag: {
			type: DataTypes.STRING
		},
		config_json: {
			type: DataTypes.STRING(2000)
		},
		extra_data_json: {
			type: DataTypes.STRING(2000)
		}

	}, {
        timestamps: true,
        freezeTableName: true
    });

	return TGroups;
}
