const express = require('express')
// ===Your bot logic here 

// Start app for Heroku
const app = express()
app.use(express.static('public'))
app.get('/', function (req, res) {
  res.send( "QuocTrieuIT" )
})

// Start server
app.listen(process.env.PORT || 3000, () => console.log('Server is running...'))