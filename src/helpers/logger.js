const bunyan = require('bunyan');
const Log = require('../Models/logsModel');

function LogStream(options) {
    this.model = options.model;
}

LogStream.prototype.write = function (rec) {
    this.model.create({
        level: rec.level,
        message: rec.msg,
        usuario: rec.usuario,
        rol: rec.rol
    });
};

const logger = bunyan.createLogger({
    name: 'myapp',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },
        {
            level: 'error',
            stream: process.stderr
        },
        {
            level: 'debug',
            type: 'raw',
            stream: new LogStream({ model: Log })
        }
    ],
    serializers: {
        userId: bunyan.stdSerializers.req,
        transactionId: bunyan.stdSerializers.req
    }
});


module.exports = logger;
