const winston = require('winston');
const { format } = require('winston');

const moment = require('moment');

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

var partdata = moment().format('YYYY-MM-DD');

var fname = './log/'+partdata+'.log';

const logger = winston.createLogger({
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: fname })
    ]
});

  

var logging = () => (req, res, next) =>{
    var data = moment().format('YYYY-MM-DD HH:mm:ss');
    var infostr = `${data} ${req.method} ${req.url} ${req.headers['x-forwarded-for'] ||  req.connection.remoteAddress}`
    logger.log('info', infostr);
    next();
};


module.exports = logging;