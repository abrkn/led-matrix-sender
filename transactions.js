var util = require('util')
, WebSocket = require('ws')
, debug = require('debug')('transactions')
, EventEmitter = require('events').EventEmitter
, _ = require('lodash')

var Transactions = module.exports = function(width, height, ticks) {
    var that = this
    this.width = width
    this.height = height
    this.tick = 0
    this.ticks = ticks

    debug('connecting to blockchain...')

    this.ws = new WebSocket('ws://ws.blockchain.info:8335/inv')

    this.bubbles = []

    this.ws.on('open', function() {
        debug('connected!')

        that.ws.send(JSON.stringify({ op: 'unconfirmed_sub' }))
    })

    this.ws.on('error', function(err) {
        console.error(err)
        that.stop()
    })

    this.ws.on('message', function(data, flags) {
        data = JSON.parse(data)

        if (data.op !== 'utx') {
            return debug('ignoring op %s', data.op)
        }

        data = data.x

        var sum = _.reduce(data.inputs, function(p, c) {
            return p + c.prev_out.value
        }, 0) / 1e8

        debug(sum)

        var size = sum * 10
        size = Math.max(6, size)
        size = Math.min(15, size)

        var colors = ['blue', 'yellow', 'white', 'red', 'orange', 'green']

        that.bubbles.push({
            top: Math.round(Math.random() * that.height),
            left: -25,
            text: sum.toFixed(2).replace(/\.?0+$/, ''),
            size: size,
            color: colors[Math.floor(Math.random() * colors.length)]
        })

        debug(size)
    })
}

util.inherits(Transactions, EventEmitter)

Transactions.prototype.stop = function() {
    this.ws.close()
    this.ws = null
    this.emit('end')
}

Transactions.prototype.draw = function(ctx) {
    var that = this

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    this.bubbles.forEach(function(bubble) {
        ctx.font = bubble.size + 'px Arial'
        ctx.fillStyle = bubble.color
        ctx.fillText(bubble.text, bubble.left, bubble.top)
        bubble.left = bubble.left + 0.25
    })

    ctx.fillStyle = 'white'
    ctx.textAlign = 'right'
    ctx.font = '8px Consola'
    ctx.fillText('BITCOIN', this.width, 5)

    this.bubbles = this.bubbles.filter(function(bubble) {
        return bubble.left < that.width + 50
    })

    debug(this.tick)

    if (this.tick++ > this.ticks) {
        this.stop()
    }
}
