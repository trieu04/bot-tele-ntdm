/**
 * @set globalThis.loadStatus
 */

const loglevel = require('loglevel');
const log = loglevel.getLogger("MAIN MODULE")

const handleStatus = function (status){

    if(status.error !== null && typeof status == "object"){
        if(status.error.message){
            log.error(status.module_name + ": " + status.message)
        }
        if(status.error.exception){
            log.error(status.exception)
        }
        if(status.require == true){
            log.error(status.module_name + "là bắt buộc để khởi động hệ thống")
            throw new Error(status.module_name + " là bắt buộc để khởi động hệ thống")
        }
        globalThis.loadStatus.push(status)
    }
    
}
module.exports = handleStatus