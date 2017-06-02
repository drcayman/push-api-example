import del      from 'del'
import gulp     from 'gulp'
import webpack  from 'webpack'
import Browser  from 'browser-sync'
import wpDevMW from 'webpack-dev-middleware'

import { styles } from './styles'
import { copy, icons } from './misc'

import { config as webpackConfig } from './webpack'
import { paths, app, proxy, copyGlob } from './config'

const browser = Browser.create()
const bundler = webpack(webpackConfig) // devMW + hotMW need same instance

////////////////////////////////////////////////////////////////

export function server() {

    let middleware = [
        wpDevMW(bundler, { stats: webpackConfig.stats })
    ]

    if( app )
        middleware.push( require('webpack-hot-middleware')(bundler) )

    let config = {
        open: false,
        proxy: proxy ? proxy : false,
        cors: true,
        notify: false,
        logFileChanges: false,
        files: [
            paths.dest.css + '/*.css',
            paths.dest.img + '/**/*'
        ],
        server: proxy ? false : paths.dest.root,
        middleware,
        snippetOptions: {    // add script above stylesheet
            rule: {          // to be able to remove body tag
                match: /<link.*rel="stylesheet".*/i,
                fn(snippet, match) {
                    return snippet + match;
                }
            }
        }
    }

    // Start Server
    browser.init(config);


    // Watch Sass
    gulp.watch(`${paths.src.css}/**/*.scss`, styles)


    // Reload JS|Laravel Views
    gulp.watch([
            `${paths.src.js}/**/*.js`,
            `${paths.src.root}/views/**/*.blade.php`
        ])
        .on('change', () => browser.reload())


    // Watch Icons
    gulp.watch(paths.src.icons, icons)
        .on('change', () => browser.reload())
        .on('unlink', () => del(`${paths.dest.assets}/icons.svg`))


    // Watch Misc + Inject Images
    gulp.watch(copyGlob, copy)
        .on('change', path => browser.reload(path))
        .on('unlink', path => {
            del(path.replace(paths.src.root, paths.dest.root))
            browser.reload()
        })

}
