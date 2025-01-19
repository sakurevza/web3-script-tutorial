const colors = require('colors');



function logErrorTX(name,tx) {
    let needTXlog = false 
    if (!needTXlog) return;
    if (tx.status !== 1) {
        console.log(colors.red(name),tx)
    }
}

module.exports = {
    logErrorTX: logErrorTX,
}