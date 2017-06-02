import fs   from 'fs'
import gulp from 'gulp'
import path from 'path'

import { paths, wp, hash, critical } from './config'
import del from 'del'

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
            injectedMain  = [],
            injectedHints = [],
            loopRound = 0

        // Injection recipients
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

                    if( path.match(/(js|css)(\/[a-z]+)(\..*)?\.(js|css)/) ) {
                        injectedMain.push(path)
                    }
                    else {
                        injectedHints.push(path)
                    }

                    if( loopRound === length ) {
                        console.log(`Injected Files + Preloading:\n${injectedMain.join('\n')}`.green)
                        console.log(`\nAdditional Preloading:\n${injectedHints.join('\n')}`.cyan)
                    }


                    // Preload JS + CSS if Critical disabled
                    if( path.match(/\.js$/) || path.match(/\.css$/) && !critical ) {
                        return `<link rel="preload" as="${path.match(/\.css$/) ? 'style':'script'}" href="${path}">\n\t`
                    }

                    // Fonts
                    else if( path.match(/\.woff2$/) ) {
                        return `<link rel="preload" as="font" crossorigin type="font/woff2" href="${path}" >\n\t`
                    }

                    return
                } // end transform

            }))

        } // end !wp


        // Inject Webpack manifest
        injectionTask.pipe(Inject(
            gulp.src(paths.dest.root + '/webpack-manifest.js'), {
                removeTags: true,
                quiet: true,
                starttag: '<!-- inject:manifest -->',
                transform(path, file) {
                    return `<script>${file.contents.toString('utf8')}</script>`
                }
            }
        ))

        del(path.resolve(__dirname, '../build/webpack-manifest.js'))
        console.log('Injected Webpack Manifest.\n'.cyan)

        return injectionTask.pipe(gulp.dest(paths.dest.root))

    } // end hash


    return new Promise(resolve => {
        console.log('Injection disabled.'.yellow)
        resolve()
    })
}
