const winston = require('winston');

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
}

const data = function(){
    var d = new Date();
    var s =
      leadingZeros(d.getFullYear(), 4) + '-' +
      leadingZeros(d.getMonth() + 1, 2) + '-' +
      leadingZeros(d.getDate(), 2) + ' ' +
  
      leadingZeros(d.getHours(), 2) + ':' +
      leadingZeros(d.getMinutes(), 2) + ':' +
      leadingZeros(d.getSeconds(), 2);
  
    return s;
}

const specificdata = function(){
    var d = new Date();
    var s =
      leadingZeros(d.getFullYear(), 4) +
      leadingZeros(d.getMonth() + 1, 2) +
      leadingZeros(d.getDate(), 2)
    return s;
}

var fi = './log/'+specificdata()+'.log';

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: fi })
    ]
});

  

var logging = () => (req, res, next) =>{
    logger.log({
        level: 'info',
        message: `${data()} ${req.method} ${req.url} ${req.headers['x-forwarded-for'] ||  req.connection.remoteAddress}`
    });
    next();
};


module.exports = logging;