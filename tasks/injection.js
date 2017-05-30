import fs   from 'fs'
import gulp from 'gulp'
import path from 'path'
import Inject from 'gulp-inject'
import series from 'stream-series'

import { paths } from './config'

export function inject() {

        let styles  = gulp.src(`${paths.dest.css}/main.*.css`, { read: false }),
            vendor  = gulp.src(`${paths.dest.js}/vendor.*.js`, { read: false }),
            scripts = gulp.src(`${paths.dest.js}/main.*.js`,   { read: false })

        let hintSources = gulp.src([
            `${paths.dest.fonts}/*.woff2`,
            `${paths.dest.css}/*.css`,
            `${paths.dest.js}/*.js`,
        ], { read: false })

        // for logging
        let injectedFiles = [],
            loopRound = 0,
            injectedMain  = [],
            injectedHints = []

        let injectionTask = gulp.src([
            `${paths.src.root}/**/*.html`,
            `${paths.src.root}/**/head*.php`,  // for non-WorPress
            `${paths.src.root}/**/footer.php`, // for non-WorPress
        ])


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

                if( path.match(/(vendor|main)(\..*)?\.(js|css)/) ) {
                    injectedMain.push(path)
                }
                else {
                    injectedHints.push(path)
                }

                if( loopRound === length ) {
                    console.log(`Injected Files:\n${injectedMain.join('\n')}`.green)
                    console.log(`\nAdditional Resource Hints:\n${injectedHints.join('\n')}`.cyan)
                }


                // vendor[.hash].js | main[.hash].css
                if( path.match(/(vendor|main)(\..*)?\.(js|css)/) ) {
                    return `<link rel="preload" as="${path.match(/\.css$/) ? 'style':'script'}" href="${path}">\n\t`
                }

                // Webpack dynamic imports
                else if( path.match(/\.js$/) ) {
                    return `<link rel="prefetch" as="script" href="${path}" >\n\t`
                }

                // Fonts
                else if( path.match(/\.woff2$/) ) {
                    return `<link rel="preload" as="font" crossorigin="crossorigin" type="font/woff2" href="${path}" >\n\t`
                }

                return
            }
        }))

        return injectionTask.pipe(gulp.dest(paths.dest.root))
}
