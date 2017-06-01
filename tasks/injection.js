import fs   from 'fs'
import gulp from 'gulp'
import path from 'path'

import { paths, wp, hash, critical } from './config'

export function inject() {

    if( hash ) { // no main file injection + resource hints

        const Inject = require('gulp-inject')
        const series = require('stream-series')


        // Main CSS + JS files
        let styles  = gulp.src(`${paths.dest.css}/main.*.css`, { read: false }),
            vendor  = gulp.src(`${paths.dest.js}/vendor.*.js`, { read: false }),
            scripts = gulp.src(`${paths.dest.js}/main.*.js`,   { read: false })

        // Resource hinted files
        let hintSources = gulp.src([
            `${paths.dest.fonts}/*.woff2`,
            `${paths.dest.css}/*.css`,
            `${paths.dest.js}/*.js`,
        ], { read: false })

        // Logging output to terminal
        let injectedFiles = [],
            loopRound = 0,
            injectedMain  = [],
            injectedHints = []

        let injectionTask = gulp.src([
            `${paths.src.root}/**/*.html`,
            `${paths.src.root}/**/head*.php`,  // for non-WorPress
            `${paths.src.root}/**/footer.php`, // for non-WorPress
        ])


        if( !wp ) {

            // Inject hashed scripts/styles
            injectionTask.pipe(Inject(series(styles, vendor, scripts), {
                relative: true,
                removeTags: true,
                ignorePath: '../build',
                quiet: true
            }))

            // Inject resource hints
            injectionTask.pipe(Inject(hintSources, {
                relative: true,
                removeTags: true,
                ignorePath: '../build',
                quiet: true,
                starttag: '<!-- inject:resourcehints -->',
                transform(path, file, i, length) {

                    loopRound += 1

                    if( path.match(/([a-z]+)(\..*)?\.(js|css)/) ) {
                        injectedMain.push(path)
                    }
                    else {
                        injectedHints.push(path)
                    }

                    if( loopRound === length ) {
                        console.log(`Main Tags + Preloading:\n${injectedMain.join('\n')}`.green)
                        console.log(`\nPrefetching:\n${injectedHints.join('\n')}`.cyan)
                    }


                    // vendor.[hash].js | main.[hash].css (disable if critical)
                    if( path.match(/(vendor|main)(\..*)?\.js/) || path.match(/main(\..*)?\.css/) && !critical ) {
                            return `<link rel="preload" as="${path.match(/\.css$/) ? 'style':'script'}" href="${path}">\n\t`
                    }

                    // Dynamic imports | 0.[hash].js => prefetch | my-chunk.[hash].js => preload
                    else if( path.match(/\.js$/) ) {
                        return `<link rel="${path.match(/^\js\/[a-z]+/) ? 'preload' : 'prefetch'}" as="script" href="${path}" >\n\t`
                    }

                    // Fonts
                    else if( path.match(/\.woff2$/) ) {
                        return `<link rel="preload" as="font" crossorigin="crossorigin" type="font/woff2" href="${path}" >\n\t`
                    }

                    return
                } // end transform

            }))

        } // end !wp


        // Inject Webpack manifest
        injectionTask.pipe(Inject(
            gulp.src(paths.src.root + '/webpack-manifest.js'), {
                removeTags: true,
                quiet: true,
                starttag: '<!-- inject:manifest -->',
                transform(path, file) {
                    return `<script>${file.contents.toString('utf8')}</script>`
                }
            }
        ))

        return injectionTask.pipe(gulp.dest(paths.dest.root))

    } // end hash


    return new Promise(resolve => {
        console.log('Injection disabled.'.yellow)
        resolve()
    })
}
