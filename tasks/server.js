import gulp     from 'gulp'
import Browser  from 'browser-sync'
import webpack  from 'webpack'
import wpDevMW  from 'webpack-dev-middleware'

import { styles } from './styles'
import { icons } from './icons'
import { copy, DEL } from './copy-clean'

import webpackConfig from './webpack.config'
import { paths, app, proxy, copyGlob } from './config'


export const browser = Browser.create()

export function server() {

    let middleware = [
        wpDevMW(webpack(webpackConfig), {
            stats: webpackConfig.stats
        })
    ]

    if( app ) {
        var wpHotMW = require('webpack-hot-middleware')
        middleware.push( wpHotMW( webpack(webpackConfig) ) )
    }

    // Start Server
    browser.init({ open: false, proxy, middleware });

    // Watch JS
    gulp.watch(`${paths.src.js}/**/*.js`)
        .on('change', () => browser.reload())

    // Watch Sass
    gulp.watch(`${paths.src.css}/**/*.scss`, styles)

    // Watch Icons
    gulp.watch(paths.src.icons, icons)
       .on('unlink', () => DEL(`${paths.dest.assets}/icons.svg`))

    // Watch Misc
    gulp.watch(copyGlob, copy)
       .on('unlink', (path, stats) => DEL(path.replace(paths.src.root, paths.dest.root)))

    // Watch Laravel Views
    gulp.watch(`${paths.src.root}/views/**/*.blade.php`)
        .on('change', () => browser.reload())



}
