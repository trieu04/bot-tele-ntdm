const { Telegraf } = require('telegraf')

const bot = new Telegraf('1921157192:AAGID1EpbU-EBGSe8jxrQSQgfKGi69SMvB8')
bot.listen(process.env.PORT || 5000)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()