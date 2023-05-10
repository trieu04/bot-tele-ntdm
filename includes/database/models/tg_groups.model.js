module.exports = function({ sequelize }) {
    const { DataTypes } = require("sequelize"); 
	let TGroups = sequelize.define('tg_groups', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		tg_id: {
			type: DataTypes.BIGINT,
			unique: true
		},
		group_name: {
			type: DataTypes.STRING
		},
		flag_id: {
			type: DataTypes.INTEGER
		},
		config: {
			type: DataTypes.STRING(2000)
		},
		extra_data: {
			type: DataTypes.STRING(2000)
		}

	}, {
        timestamps: true,
        freezeTableName: true
    });

	return TGroups;
}
