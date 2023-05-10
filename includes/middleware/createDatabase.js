const loglevel = require("loglevel")

const updateLog = loglevel.getLogger("UPDATE")
const dbLog = loglevel.getLogger("DB")
const createDatabase = async (ctx, next) => {
    
    // create user
    if (ctx.from) {
        const users_cache = globalThis.caches.users;
        let id = ctx.from.id;
        let data = users_cache.get(id)
        const models = globalThis.db.models
        if(!data) {
            data = await models.Users.findOne({ where: {tg_id: id} });
            if(!data) {
                let value = {
                    tg_id: id,
                    tg_name: "1" ,
                    extra_data: JSON.stringify(ctx.from),
                }
                await models.Users.create(value)
                users_cache.set(id, value)
            }
            else {
                users_cache.set(id, data.dataValues)
            }
        }
    }

    // create message log
    if(ctx.update.message){
        const models = globalThis.db.models
        const value = {
            from_tg_id: ctx.update.message.from.id,
            to_tg_id: ctx.botInfo.id,
            text: ctx.update.message.text || "",
            data: JSON.stringify(ctx.update.message)
        }
        models.ChatHistory.create(value)
    }
    
    next();
};

module.exports = createDatabase;