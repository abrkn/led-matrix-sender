var JustcoinMarketStats = require('./justcoinmarketstats')
, CoindeskNews = require('./coindesknews')
, Combiner = require('./combiner')
, Startup = require('./startup')
, Transactions = require('./transactions')
, debug = require('debug')('director')

var startupShown = false
, current

module.exports = function() {
    if (false && !startupShown) {
        debug('showing startup')
        startupShown = true
        return new Startup(64, 32)
    }

    if (current == 'scroller') {
        current = 'transactions'
        debug('showing %s', current)
        return new Transactions(64, 32, 1000)
    } else {
        current = 'scroller'
        debug('showing %s', current)
        return new Combiner([
            {
                x: 0,
                y: 0,
                scene: new JustcoinMarketStats({
                    font: '20px Consolas',
                    width: 32  * 2,
                    height: 16,
                    color: 'green',
                    offsetY: -4,
                    repeat: 5
                })
            },
            {
                x: 0,
                y: 16,
                scene: new CoindeskNews({
                    width: 32 * 2,
                    height: 16,
                    speed: 0.6,
                    font: '22px Consolas'
                })
            }
        ])
    }
}
