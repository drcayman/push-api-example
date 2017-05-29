import fs   from 'fs'
import gulp from 'gulp'
import path from 'path'
import series from 'stream-series'
import Inject from 'gulp-inject'

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


        return gulp.src([
                `${paths.src.root}/**/*.html`,
                `${paths.src.root}/**/head*.php`,  // for non-WorPress
                `${paths.src.root}/**/footer.php`, // for non-WorPress
            ])
            .pipe(Inject(series(styles, vendor, scripts), {
                relative: true,
                removeTags: true,
                ignorePath: '../build'
            }))
            .pipe(Inject(hintSources, {
                relative: true,
                removeTags: true,
                ignorePath: '../build',
                starttag: '<!-- inject:resourcehints -->',
                transform(path, file) {

                    console.log(path);

                    // vendor[.hash].js | main[.hash].css
                    if( path.match(/(vendor|main)(\..*)?\.(js|css)/) ) {
                        return `<link rel="preload" as="${path.match(/\.css$/) ? 'style':'script'}" href="${path}">\n\t`
                    }

                    else if( path.match(/\.js$/) ) {
                        return `<link rel="prefetch" as="script" href="${path}" >\n\t`
                    }

                    else if( path.match(/\.woff2$/) ) {
                        return `<link rel="preload" as="font" crossorigin="crossorigin" type="font/woff2" href="${path}" >\n\t`
                    }

                }
            }))

            .pipe(gulp.dest(paths.dest.root))

}

////////////////////////////////////////////////////////////////

export function resourceHints() {

    // let styles  = [],
    //     scripts = []

    // fs.readdirSync(paths.dest.js).forEach(file => {
    //     if( file.indexOf('main.js') !== -1 || file.indexOf('vendor.js') !== -1 )
    //         scripts.push(paths.dest.js + '/' + file)
    // })

    let sources = gulp.src([
            `${paths.dest.css}/*.css`,
            `${paths.dest.js}/*.js`,
        ], { read: false })


    return gulp.src([
            `${paths.dest.root}/**/*.html`,
            `${paths.dest.root}/**/head*.php`,  // for non-WorPress
            `${paths.dest.root}/**/footer.php`, // for non-WorPress
        ])
        .pipe(Inject(sources, {
            relative: true,
            removeTags: true,
            ignorePath: 'build',
            starttag: '<!-- inject:resourcehints -->',
            transform(path, file) {

                console.log(path);

                // vendor[.hash].js | main[.hash].css
                if( path.match(/(vendor|main)(\..*)?\.(js|css)/) ) {
                    return `<link rel="preload" as="${path.match(/\.css$/) ? 'style':'script'}" href="${path}">\n\t`
                }

                else if( path.match(/\.js$/) ) {
                    return `<link rel="prefetch" as="script" href="${path}" >\n\t`
                }

            }
        }))
        .pipe(gulp.dest(paths.dest.root))

}
