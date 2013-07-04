var EventEmitter = require('events').EventEmitter
, Canvas = require('canvas')
, util = require('util')
, _ = require('lodash')
, debug = require('debug')('scrolltextscene')

var ScrollTextScene = module.exports = function(opts) {
    this.tick = 0
    this.opts = _.extend({
        speed: 1,
        font: '18px Consolas',
        color: 'white',
        repeat: 0,
        offsetY: 0
    }, opts)
}

util.inherits(ScrollTextScene, EventEmitter)

ScrollTextScene.prototype.render = function(text) {
    for (var i = 0; i < this.opts.repeat; i++) {
        text += ' ' + text
    }

    debug('rendering...')

    var measureCanvas = new Canvas(1, 1)
    , measureContext = measureCanvas.getContext('2d')
    measureContext.font = this.opts.font

    var textWidth = measureContext.measureText(text).width

    this.canvas = new Canvas(textWidth, this.opts.height)

    var innerCtx = this.canvas.getContext('2d')

    innerCtx.textBaseline = 'middle'
    innerCtx.fillStyle = this.opts.color
    innerCtx.font = measureContext.font
    innerCtx.fillText(text, 0, this.opts.offsetY + this.opts.height / 2)

    debug('render complete (%d px wide)', textWidth)
}

ScrollTextScene.prototype.draw = function(ctx) {
    if (!this.canvas) return

    ctx.drawImage(this.canvas, this.opts.width - this.tick * this.opts.speed, 0)

    this.tick++

    if (this.tick * this.opts.speed > this.canvas.width + this.opts.width) {
        debug('scene has ended (scroll complete')
        this.emit('end')
    }
}
