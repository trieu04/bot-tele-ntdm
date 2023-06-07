const Text = require("../utils/text")
const {praseJsonColumn, stringifyJsonColumn} = require("../bot/jsonColumnHandle")


const createDatabase = async (ctx, next) => {
    // create user
    const get_name = ({first_name, last_name}) => first_name + (last_name ? " " + last_name : "")
    if (ctx.from) {
        const users_cache = globalThis.caches.users;
        const models = globalThis.db.models
        const id = ctx.from.id;
        if(!users_cache.has(id)) {
            let user_data = await models.TUsers.findOne({ where: {tg_id: id} });
            if(user_data) {
                const cache_value = praseJsonColumn(user_data.dataValues)
                users_cache.set(id, cache_value)
            }
            else {
                const value = {
                    tg_id: id,
                    tg_name: get_name(ctx.from),
                    config_json: JSON.stringify({language_code: ctx.from.language_code}),
                    extra_data_json: JSON.stringify(ctx.from),
                }
                models.TUsers.create(value)
                const cache_value = praseJsonColumn(value)
                users_cache.set(id, cache_value)
            }
        }
        ctx.userData = users_cache.get(id)
    }
    if (ctx.chat.type == "group" || ctx.chat.type == "supergroup"){
        const groups_cache = globalThis.caches.groups;
        const models = globalThis.db.models
        const id = ctx.chat.id;
        if(!groups_cache.has(id)) {
            let group_data = await models.TGroups.findOne({ where: {tg_id: id} });
            if(group_data) {
                const cache_value = praseJsonColumn(group_data.dataValues)
                groups_cache.set(id, cache_value)
            }
            else {
                const value = {
                    tg_id: id,
                    tg_name: ctx.chat.title,
                    extra_data_json: JSON.stringify(ctx.chat),
                }
                models.TGroups.create(value)
                const cache_value = praseJsonColumn(value)
                groups_cache.set(id, cache_value)
            }
        }
        ctx.groupData = groups_cache.get(id)
    }

    // create message log
    if(ctx.update.message){
        const message = ctx.update.message
        const models = globalThis.db.models
        const value = {
            message_id: message.message_id,
            from_tg_id: message.from.id,
            from_name: get_name(ctx.from),
            chat_id: message.chat.id,
            chat_name: message.chat.type == "private" ? get_name(ctx.chat) : message.chat.title,
            text: message.text || "",
            data_json: JSON.stringify(message)
        }
        models.MessageHistory.create(value)
    }
    
    next();
};

module.exports = createDatabase;