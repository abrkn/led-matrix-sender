var EventEmitter = require('events').EventEmitter
, util = require('util')

var Startup = module.exports = function(width, height) {
    this.tick = 0
    this.width = width
    this.height = height
}

util.inherits(Startup, EventEmitter)

Startup.prototype.draw = function(ctx) {
    if (this.tick < 200) {
        for (var i = 0; i < 100; i++) {
            var x = Math.round(Math.random() * this.width)
            , y = Math.round(Math.random() * this.height)
            ctx.fillStyle = 'white'
            ctx.fillRect(x, y, 1, 1)
        }
    } else {
        ctx.fillStyle = 'white'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'center'
        ctx.font = '15px Consolas'

        var text

        if (this.tick < 300) text = 'JUSTCOIN'
        else if (this.tick < 400) text = 'DIGITAL'
        else if (this.tick < 500) text = 'CURRENCY'
        else text = 'EXCHANGE'

        ctx.fillText(text, this.width / 2, 10)
    }

    this.tick++

    if (this.tick >= 600) {
        this.emit('end')
    }
}
