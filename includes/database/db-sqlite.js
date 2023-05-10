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
	},
	sync: {
		force: false
	}
});


const Users = require("./models/tg_users.model")({sequelize});
const TGroups = require("./models/tg_groups.model")({sequelize});
const ChatHistory = require("./models/chat_history.model")({sequelize});


module.exports = {
	sequelize,
	models: {Users, TGroups, ChatHistory},
	sync: async function(){
		await Users.sync({ alter: true })
		await TGroups.sync({ alter: true })
		await ChatHistory.sync({ alter: true })
	},
	authenticate: sequelize.authenticate
}

