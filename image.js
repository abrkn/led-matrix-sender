var EventEmitter = require('events').EventEmitter
, util = require('util')
, _ = require('lodash')

var ImageScene = module.exports = function(img, opts) {
    this.tick = 0
    this.img = img
    this.opts = _.extend({
        ticks: 500,
        x: 0,
        y: 0
    }, opts)
}

util.inherits(ImageScene, EventEmitter)

ImageScene.prototype.draw = function(ctx) {
    ctx.drawImage(this.img, this.opts.x, this.opts.y)

    this.tick++

    if (this.tick >= this.opts.ticks) {
        this.emit('end')
    }
}
