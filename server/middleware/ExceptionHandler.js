const winston = require('winston')
module.exports = function (handler)  {
    return async (req,res,next) => {
        try {
           await handler(req,res)     
        } catch (error) {
            next(error)
            winston.log('error',error.message)
            res.status(500).send("SOMETHING WENT WRONG")
        }
    }
}