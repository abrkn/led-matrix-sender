var JustcoinMarketStats = require('./justcoinmarketstats')
, CoindeskNews = require('./coindesknews')
, Combiner = require('./combiner')
, Startup = require('./startup')
, Transactions = require('./transactions')
, Image = require('./image')
, debug = require('debug')('director')
, fs = require('fs')
, Canvas = require('canvas')
, joinPath = require('path').join

var startupShown = false
, current

module.exports = function() {
    if (!startupShown) {
        debug('showing startup')
        startupShown = true
        return new Startup(32 * 6, 32)
    }

    if (!current || current == 'scroller') {
        debug('cvpartner')
        current = 'cvpartner'
        var img = new Canvas.Image()
        img.src = fs.readFileSync(joinPath(__dirname, 'cvpartner.png'))
        return new Image(img, {
            ticks: 3500
        })
    } else {
        current = 'scroller'
        debug('showing %s', current)
        return new Combiner([
            {
                x: 0,
                y: 0,
                scene: new JustcoinMarketStats({
                    font: '20px Consolas',
                    width: 32  * 6,
                    height: 16,
                    color: 'green',
                    offsetY: -1,
                    repeat: 5
                })
            },
            {
                x: 0,
                y: 16,
                scene: new CoindeskNews({
                    width: 32 * 6,
                    height: 16,
                    speed: 0.6,
                    font: '13px Consolas',
                    offsetY: 3
                })
            }
        ])
    }
}
