import gulp from 'gulp'

import { paths, app } from './config'

if( app )
    var series = require('stream-series'),
        inject = require('gulp-inject')


export function inject() {

    let styles  = gulp.src(`${paths.dest.css}/main.*.css`, { read: false }),
        vendor  = gulp.src(`${paths.dest.js}/vendor.*.js`, { read: false }),
        scripts = gulp.src(`${paths.dest.js}/main.*.js`,   { read: false })

    return gulp.src([
        `${paths.dest.root}/**/*.html`,
        `${paths.dest.root}/**/head*.php`, // for non-WorPress PHP files
        `${paths.dest.root}/**/footer.php`,
    ])
        .pipe(Inject(series(styles, vendor, scripts), {
            relative: true,
            removeTags: true
        }))
        .pipe(gulp.dest(paths.dest.root))
}
