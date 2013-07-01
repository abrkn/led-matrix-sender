var ScrollTextScene = require('./scrolltextscene')
, util = require('util')
, request = require('request')
, debug = require('debug')('coindesknews')

var News = module.exports = function() {
    ScrollTextScene.apply(this, arguments)

    var that = this
    , url = 'https://news.google.com/news/feeds?safe=off&hl=en&gl=us&authuser=0&q=bitcoin&bav=on.2,or.r_cp.r_qf.&bvm=bv.48572450,d.bGE&biw=1264&bih=1268&um=1&ie=UTF-8&output=rss'

    debug('loading news from CoinDesk...')

    request(url, function(err, res, data) {
        if (err) {
            return that.render('ERROR: ' + err.message)
        }

        var m
        , headlines = []
        , re = /<item>\s*<title>([^<]+)/g

        while ((m = re.exec(data))) {
            headlines.push(m[1].toUpperCase())
        }

        debug('loaded %d titles from CoinDesk', headlines.length)

        var text = headlines.join(' • ')

        that.render(text)
    })
}

util.inherits(News, ScrollTextScene)
