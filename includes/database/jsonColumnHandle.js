const praseJsonColumn = (dataValues) => {
    if(typeof dataValues != "object" || dataValues === null) return null
    const regx = /^(.+)_json$/
    const returnData = {}
    for(columnName of Object.keys(dataValues)){
        let r = regx.exec(columnName)
        if(r){
            let prop = r[1]
            returnData[prop] = JSON.parse(dataValues[columnName]) || {}
        }
        else {
            returnData[columnName] = dataValues[columnName]
        }
    }
    return returnData
}
const stringifyJsonColumn = (dataValues) => {
    const returnData = {}
    for(columnName of Object.keys(dataValues)){
        if(typeof dataValues[columnName] == "object" &&  dataValues[columnName] !== null){
            returnData[columnName + "_json"] = JSON.stringify(dataValues[columnName])
        }
        else{
            returnData[columnName] = dataValues[columnName]
        }
    }
    return returnData

}

module.exports = {praseJsonColumn, stringifyJsonColumn}