var ScrollTextScene = require('./scrolltextscene')
, util = require('util')
, request = require('request')
, debug = require('debug')('justcoin')

var News = module.exports = function() {
    var that = this

    ScrollTextScene.apply(this, arguments)

    var url = 'https://api.justcoin.com/v1/markets'

    request({
        url: url,
        json: true
    }, function(err, res, markets) {
        if (err) {
            return that.render('ERROR: ' + err.message)
        }

        debug('%s markets retrieved', markets.length)

        var text = 'JUSTCOIN: ' +
            markets.map(function(m) {
            return util.format(
                '%s/%s %s',
                m.id.substr(0, 3),
                m.id.substr(3, 3),
                m.last)
        }).join(' - ').toUpperCase()

        that.render(text)
    })
}

util.inherits(News, ScrollTextScene)
