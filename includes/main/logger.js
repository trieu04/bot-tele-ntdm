/**
 * use globalThis.client.mainPath
 * set globalThis.cron
 * set globalThis.loglevel
 */

module.exports.config = {
    name: "logger",
    rPath: "include/main/logger.js"
}

const mainPath = globalThis.client.mainPath

const log = require("loglevel");
const prefix = require('loglevel-plugin-prefix');
const chalk = require("chalk");

const fs = require('fs');
const path = require('path');
const CronJob = require('cron').CronJob;

const colors = {
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red,
};

var logFile
var getLogFile = new CronJob(
	'* * * * * *',
	function() {
        const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
        const dateTime = new Date()
        const date = dateTime.getFullYear() +
            "-" + pad(dateTime.getMonth() + 1) +
            "-" + pad(dateTime.getDate())
    
        const logPath = path.join(mainPath, "log", `${date}.log`)
        logFile = fs.createWriteStream(logPath, {flags : 'a'})
	},
	null,
	true,
	'Asia/Ho_Chi_Minh',
    null,
    true
);
globalThis.cron.push({name: "getLogFile", cron: getLogFile})

log.enableAll();

const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
    var rawMethod = originalFactory(methodName, logLevel, loggerName);
    return function () {
        var content = "" 
        var length = arguments.length;
        var args = Array(length);
        var key = 0;
        for (; key < length; key++) {
            args[key] = arguments[key];
            if(typeof args[key] == "object")
                content += JSON.stringify(args[key])
            else
                content += args[key]
            if(key < length - 1) content += " "
        }
        logFile.write(content.replace(/\x1b\[[0-9;]*m/g, '') + "\n")
        rawMethod.apply(undefined, arguments);
      };
};

prefix.reg(log);
prefix.apply(log, {
    format(level, name, timestamp) {
        return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)} ${chalk.green(`[${name}]:`)}`;
    },
    levelFormatter(level) {
        return level.toUpperCase();
    },
    nameFormatter(name) {
        return name || "global";
    },
    timestampFormatter(date) {
        return getDateTime(date);
    }
});

function getDateTime(date, timezoneOffset = 420) {
    date.setTime(date.getTime() + (date.getTimezoneOffset() + timezoneOffset) * 60 * 1000)
    const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      ' ' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds())
}

log.getLogger("LOGGER").info("TIME OFFSET: UTC+07:00")
