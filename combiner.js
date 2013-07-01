var EventEmitter = require('events').EventEmitter
, util = require('util')

var Combiner = module.exports = function(pieces) {
    this.pieces = pieces

    var that = this

    function pieceEnded() {
        pieces.forEach(function(piece) {
            piece.scene.removeListener('end', pieceEnded)
        })

        that.emit('end')
    }

    pieces.forEach(function(piece) {
        piece.scene.on('end', pieceEnded)
    })
}

util.inherits(Combiner, EventEmitter)

Combiner.prototype.draw = function(ctx) {
    this.pieces.forEach(function(piece) {
        ctx.save()
        ctx.translate(piece.x, piece.y)
        piece.scene.draw(ctx)
        ctx.restore()
    })
}
