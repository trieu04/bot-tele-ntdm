const axios = require('axios').default;
const process = require('process');
const os = require("os");
const fs = require('fs');
const ytdl = require('ytdl-core');
const readline = require('readline');
require('dotenv').config();
var yt_id = "EV-91JV4Fws"
output = "./cache/" + yt_id + ".mp4";
(async ()=> {
    let info = await ytdl.getInfo(yt_id);
console.log(info.formats)
})()
