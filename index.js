var Canvas = require('canvas')
, canvas = new Canvas(32 * 6, 32)
, ctx = canvas.getContext('2d')
, async = require('async')
, director = require('./director')
, scene = null
, config = require('konfu')
, sender = require('./sender')(process.argv[2] || config.ip || '127.0.0.1', config.port || 9000)

async.forever(function(next) {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (!scene) {
        scene = director()
        scene.once('end', function() {
            scene = null
        })
    }

    ctx.save()
    scene.draw(ctx)
    ctx.restore()

    sender(canvas.toBuffer(), function() {
        setTimeout(next, config.interval || 25)
    })
})
