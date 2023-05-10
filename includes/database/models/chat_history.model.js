module.exports = function({ sequelize }) {
    const { DataTypes } = require("sequelize"); 
	let ChatHistory = sequelize.define('chat_history', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		from_tg_id: {
			type: DataTypes.BIGINT,
		},
		to_tg_id: {
			type: DataTypes.BIGINT,
		},
		text: {
			type: DataTypes.STRING(4095)
		},
        data: {
            type: DataTypes.STRING(4095)
        }
	}, {
        timestamps: true,
        freezeTableName: true
    });

	return ChatHistory;
}
