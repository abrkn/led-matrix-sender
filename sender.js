var dgram = require('dgram')
, socket = dgram.createSocket('udp4')
, debug = require('debug')('sender')

module.exports = function(hostname, port) {
    var n = 0

    return function(buf, cb) {
        if (++n % 1000 === 0) {
            debug('sending %d bytes (packet #%d)', buf.length, n)
        }

        socket.send(buf, 0, buf.length, port, hostname, function(err) {
            if (err) throw err

            cb && cb()
        })
    }
}
