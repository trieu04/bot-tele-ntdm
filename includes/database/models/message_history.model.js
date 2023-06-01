module.exports = function({ sequelize }) {
    const { DataTypes } = require("sequelize"); 
	const MessageHistory = sequelize.define('message_history', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		message_id:{
			type: DataTypes.BIGINT
		},
		from_tg_id: {
			type: DataTypes.BIGINT,
		},
		from_name:{
			type: DataTypes.STRING(255)
		},
		chat_id: {
			type: DataTypes.BIGINT,
		},
		chat_name: {
			type: DataTypes.STRING(255)
		},
		text: {
			type: DataTypes.STRING(4095)
		},
        data_json: {
            type: DataTypes.STRING(4095)
        }
	}, {
        timestamps: true,
        freezeTableName: true
    });

	return MessageHistory;
}
