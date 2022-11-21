const process = require('process');
var events = require('events');
const CronJob = require('cron').CronJob;

require('dotenv').config();
const os = require("os");

const axios = require('axios').default;
const fs = require('fs');
var progress = require('progress-stream');
const search = require('youtube-search');
const ytdl = require('ytdl-core');

const mysql = require('mysql')

var mysqlc = mysql.createConnection({
  host     : 'free01.123host.vn',
  user     : 'quoctrie',
  password : 'free01.123host.vn',
  database : 'quoctrie_faye'
})
mysqlc.connect();

mysqlc.query('SELECT * FROM yt-media', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});


// // MySQL Database
// const mysqlc = mysql.createConnection({
//     host: 'free01.123host.vn',
//     user: 'quoctrie',
//     password: '0fCoDEABM1wz3uE',
//     database: 'quoctrie_faye'
// })
// mysqlc.connect();