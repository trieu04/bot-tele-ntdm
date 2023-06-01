const Sequelize = require("sequelize");
const { resolve } = require("path");
const { DATABASE } = globalThis.config;

var dialect = "sqlite";
var storage = resolve(`${DATABASE[dialect].storage}`);
const sequelize = new Sequelize({
	dialect,
	storage,
	pool: {
		max: 20,
		min: 0,
		acquire: 60000,
		idle: 20000
	},
	retry: {
		match: [
			/SQLITE_BUSY/,
		],
		name: 'query',
		max: 20
	},
	logging: false,
	transactionType: 'IMMEDIATE',
	define: {
		underscored: false,
		freezeTableName: true,
		charset: 'utf8',
		dialectOptions: {
			collate: 'utf8_general_ci'
		},
		timestamps: true
	}
});


const TUsers = require("./models/tg_users.model")({sequelize});
const TGroups = require("./models/tg_groups.model")({sequelize});
const MessageHistory = require("./models/message_history.model")({sequelize});


module.exports = {
	sequelize,
	models: {TUsers, TGroups, MessageHistory},
	sync: async function(){
		await TUsers.sync()
		await TGroups.sync()
		await MessageHistory.sync()
	},
	authenticate: sequelize.authenticate
}

