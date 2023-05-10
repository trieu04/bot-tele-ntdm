module.exports = function({ sequelize }) {
    const { DataTypes } = require("sequelize"); 
	let Users = sequelize.define('tg_users', {
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
		group_id:{
			type: DataTypes.INTEGER
		},
		flag_id: {
			type: DataTypes.INTEGER
		},
		config: {
			type: DataTypes.STRING(2000)
		},
		extra_data: {
			type: DataTypes.STRING(2000)
		},
	}, {
        timestamps: true,
        freezeTableName: true
    });

	return Users;
}
