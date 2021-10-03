const { Telegraf } = require('telegraf')
const bot = new Telegraf('1965412655:AAGKqyIE20dI6H0KrNcZ8pNUhWUch2y9yCI')



bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

require('http')
  .createServer(bot.webhookCallback('/secret-path'))
  .listen(process.env.PORT || 3000)