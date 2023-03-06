
import log4js from 'log4js'

log4js.configure({
    appenders: {
        consola: { type: "console" },
        debugFile: { type: "file", filename: './debug.log'}
    },
    categories: {
        default: {
            appenders: ["consola"], level: "all"
        },
        DEV: {
            appenders: ["debugFile"], level: "DEBUG"
        },
        ErrLogger: {
            appenders: ["consola"], level: "ERROR"
        },
        LogInfo:{
            appenders: ["consola"], level: "DEBUG"
        }
    }
})

const logger = log4js.getLogger('DEV')
const errorLogger = log4js.getLogger('ErrLogger')
const logInfo = log4js.getLogger('LogInfo')

export {
        logger,
        errorLogger,
        logInfo
        }

