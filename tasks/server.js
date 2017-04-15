import gulp     from 'gulp'
import del      from 'del'
import Browser  from 'browser-sync'
import webpack  from 'webpack'
import webpackDevMiddleware  from 'webpack-dev-middleware'

import { styles } from './styles'
import { copy, icons } from './misc'

import { config as webpackConfig } from './webpack'
import { paths, app, proxy, copyGlob } from './config'

const browser = Browser.create()
const bundler = webpack(webpackConfig) // devMW + hotMW need same instance

export function reload(done) {
    return browser.reload()
    done()
}

export function server() {

    let middleware = [
        webpackDevMiddleware(bundler, {
            stats: webpackConfig.stats
        })
    ]

    if( app )
        middleware.push( require('webpack-hot-middleware')( bundler ) )

    let config = {
        open: false,
        proxy: proxy ? proxy : false,
        cors: true,
        notify: false,
        logFileChanges: false,
        files: [
            paths.dest.css + '/*.css'
        ],
        server: proxy ? false : paths.dest.root,
        middleware
    }

    // Start Server
    browser.init(config);

    // Watch JS
    gulp.watch(`${paths.src.js}/**/*.js`)
        .on('change', () => browser.reload())

    // Watch Sass
    gulp.watch(`${paths.src.css}/**/*.scss`, styles)

    // Watch Icons
    gulp.watch(paths.src.icons, icons)
        .on('unlink', () => del(`${paths.dest.assets}/icons.svg`))

    // Watch Misc
    gulp.watch(copyGlob, copy)
        .on('unlink', (path, stats) => del(path.replace(paths.src.root, paths.dest.root)))


    // Watch Laravel Views
    gulp.watch(`${paths.src.root}/views/**/*.blade.php`)
        .on('change', () => browser.reload())

}