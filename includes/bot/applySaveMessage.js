const saveSendedMessage = (bot, Telegram) => {
    const _sendMessage = Telegram.prototype.sendMessage
    Telegram.prototype.sendMessage = function (){
        return _sendMessage.apply(bot.telegram, arguments)
            .then(res => {
                addMessageHistory(res)
                return res
            })
    }
    const _editMessageText = Telegram.prototype.editMessageText
    Telegram.prototype.editMessageText = function (){
        return _editMessageText.apply(bot.telegram, arguments)
            .then(res => {
                editMessageHistory(res)
                return res
            })
    }
}

const get_name = ({first_name, last_name}) => first_name + (last_name ? " " + last_name : "")

function addMessageHistory(message){
    const models = globalThis.db.models
    const value = {
        message_id: message.message_id,
        from_tg_id: message.from.id,
        from_name: get_name(message.from),
        chat_id: message.chat.id,
        chat_name: message.chat.type == "private" ? get_name(message.chat) : message.chat.title,
        text: message.text || "",
        data_json: JSON.stringify(message)
    }
    models.MessageHistory.create(value)
}
async function editMessageHistory(message){
    const models = globalThis.db.models
    const value = {
        message_id: message.message_id,
        from_tg_id: message.from.id,
        from_name: get_name(message.from),
        chat_id: message.chat.id,
        chat_name: message.chat.type == "private" ? get_name(message.chat) : message.chat.title,
        text: message.text || "",
        data_json: JSON.stringify(message)
    }
    models.MessageHistory.update(value, {where: {message_id: message.message_id}});
}

module.exports = saveSendedMessage;