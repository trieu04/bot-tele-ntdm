const loglevel = require("loglevel")

const updateLog = loglevel.getLogger("UPDATE")
const dbLog = loglevel.getLogger("DB")
const createDatabase = async (ctx, next) => {
    
    // create user
    if (ctx.from) {
        const users_cache = globalThis.caches.users;
        const models = globalThis.db.models
        const id = ctx.from.id;
        if(!users_cache.get(id)) {
            let user_data = await models.TUsers.findOne({ where: {tg_id: id} });
            if(user_data) {
                const cache_value = prase_json_column(user_data.dataValues)
                users_cache.set(id, cache_value)
            }
            else {
                const value = {
                    tg_id: id,
                    tg_name: ctx.from.first_name,
                    config_json: JSON.stringify({language_code: ctx.from.language_code}),
                    extra_data_json: JSON.stringify(ctx.from),
                }
                models.TUsers.create(value)
                const cache_value = prase_json_column(value)
                users_cache.set(id, cache_value)
            }
        }
    }
    if (ctx.chat.type == "group" || ctx.chat.type == "supergroup"){
        const groups_cache = globalThis.caches.groups;
        const models = globalThis.db.models
        const id = ctx.chat.id;
        if(!groups_cache.get(id)) {
            let group_data = await models.TGroups.findOne({ where: {tg_id: id} });
            if(group_data) {
                const cache_value = prase_json_column(group_data.dataValues)
                groups_cache.set(id, cache_value)
            }
            else {
                const value = {
                    tg_id: id,
                    tg_name: ctx.from.first_name,
                    extra_data_json: JSON.stringify(ctx.chat),
                }
                models.TGroups.create(value)
                const cache_value = prase_json_column(value)
                groups_cache.set(id, cache_value)
            }
        }
    }

    // create message log
    if(ctx.update.message){
        const message = ctx.update.message
        const models = globalThis.db.models
        const value = {
            message_id: message.message_id,
            from_tg_id: message.from.id,
            from_name: message.from.first_name,
            chat_id: message.chat.id,
            chat_name: message.chat.type == "private" ? message.chat.first_name : message.chat.title,
            text: message.text || "",
            data_json: JSON.stringify(message)
        }
        models.MessageHistory.create(value)
    }
    
    next();
};

function prase_json_column(dataValue){
    const regx = /^(.+)_json$/
    const returnData = {}
    for(columnName of Object.keys(dataValue)){
        returnData[columnName] = dataValue[columnName]
        let r = regx.exec(columnName)
        if(r){
            let prop = r[1]
            returnData[prop] = JSON.parse(dataValue[columnName])
        }
    }
    return returnData
}

module.exports = createDatabase;