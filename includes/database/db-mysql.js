const Sequelize = require("sequelize");
const dialect = "mysql"
const env = require("process").env

const sequelize = new Sequelize(env.MYSQLDB_DATABASE, env.MYSQLDB_USERNAME, env.MYSQLDB_PASSWORD,{
	dialect,
	host: env.MYSQLDB_HOSTNAME,
	pool: {
		max: 20,
		min: 0,
		acquire: 60000,
		idle: 20000
	},
	retry: {
		match: [
			/MYSQL_BUSY/,
		],
		name: 'query',
		max: 5
	},
	logging: false,
	define: {
		underscored: false,
		freezeTableName: true,
		charset: 'utf8',
		dialectOptions: {
			collate: 'utf8_general_ci'
		},
		timestamps: false
	}
});


const TUsers = require("./models/tg_users.model")({sequelize});
const TGroups = require("./models/tg_groups.model")({sequelize});
const MessageHistory = require("./models/message_history.model")({sequelize});

module.exports = {
	sequelize,
	models: {TUsers, TGroups, MessageHistory}
}

