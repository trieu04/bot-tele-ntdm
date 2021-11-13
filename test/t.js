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
const http = require('http')

const { resolve } = require('path');
const { rejects } = require('assert');

ytdl("1pquvJRgIMY",{quality: "highest"}).pipe(fs.createWriteStream("./tmp/test_vid.mp4"))
