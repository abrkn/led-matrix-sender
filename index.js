var Canvas = require('canvas')
, canvas = new Canvas(32 * 2, 32)
, ctx = canvas.getContext('2d')
, async = require('async')
, director = require('./director')
, scene = null
, sender = require('./sender')(process.argv[2] || '127.0.0.1', 9000)

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
        setTimeout(next, 15)
    })
})