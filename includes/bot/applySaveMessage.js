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

function addMessageHistory(message){
    const models = globalThis.db.models
    const value = {
        message_id: message.message_id,
        from_tg_id: message.from.id,
        from_name: message.from.first_name,
        chat_id: message.chat.id,
        chat_name: message.chat.type == "private" ? message.chat.first_name : message.chat.title,
        text: message.text || "",
        data: JSON.stringify(message)
    }
    models.MessageHistory.create(value)
}
async function editMessageHistory(message){
    const models = globalThis.db.models
    const value = {
        message_id: message.message_id,
        from_tg_id: message.from.id,
        from_name: message.from.first_name,
        chat_id: message.chat.id,
        chat_name: message.chat.type == "private" ? message.chat.first_name : message.chat.title,
        text: message.text || "",
        data: JSON.stringify(message)
    }
    models.MessageHistory.update(value, {where: {message_id: message.message_id}});
}

module.exports = saveSendedMessage;