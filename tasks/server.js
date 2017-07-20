import del      from 'del'
import webpack  from 'webpack'
import Browser  from 'browser-sync'
import wpDevMW from 'webpack-dev-middleware'

import { styles } from './styles'
import { copy, icons } from './misc'

import { config as webpackConfig } from './webpack'
import { paths, app, proxy, copyGlob } from './config'
import { src, dest, watch, parallel, series } from 'gulp'

const browser = Browser.create()
const bundler = webpack(webpackConfig) // devMW + hotMW need same instance

////////////////////////////////////////////////////////////////

export const server = () => {

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
        https: {
            key: process.env.HOME + '/.valet/Certificates/boilerplate.dev.key',
            cert: process.env.HOME + '/.valet/Certificates/boilerplate.dev.crt',
        },
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

    browser.init(config);


    // Watch Sass
    watch(`${paths.src.css}/**/*.scss`, styles)


    // Reload JS|Laravel Views
    watch([
            `${paths.src.js}/**/*.js`,
            `${paths.src.root}/views/**/*.blade.php`
        ])
        .on('change', () => browser.reload())


    // Watch Icons
    watch(paths.src.icons, icons)
        .on('change', () => browser.reload())
        .on('unlink', () => del(`${paths.dest.assets}/icons.svg`))


    // Watch Misc + Inject Images
    watch(copyGlob)
        .on('change', path => {
            copy()
            setTimeout(() => browser.reload(), 100);
        })
        .on('unlink', path => {
            del(path.replace(paths.src.root, paths.dest.root))
            browser.reload()
        })

}
