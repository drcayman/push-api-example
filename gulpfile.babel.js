'use strict';

import { src, dest, hash, SRC_ROOT, DEST_ROOT, proxy, app } from './project.config'

import fs        from 'fs';
import path      from 'path';               import del      from 'del'
import process  from 'process'
import Browser   from 'browser-sync';
import webpack   from 'webpack';            import wpConfig from './webpack.config'
import wpDevMW   from 'webpack-dev-middleware'

import gulp      from 'gulp';				import sass	    from 'gulp-sass'
import notify    from 'gulp-notify';        import maps     from 'gulp-sourcemaps'
import prefixer  from 'gulp-autoprefixer';
import svgstore  from 'gulp-svgstore';      import svgmin   from 'gulp-svgmin'
import changed   from 'gulp-changed'

//////////////////////////////////

const browser    = Browser.create()
const bundler    = webpack(wpConfig)
const production = process.env.npm_lifecycle_script.includes('production')
const miscGlob   = [
    `${SRC_ROOT}/**`,
    `!${src.js   }/**`,   // JS folder 4 WP enq
    `!${src.scss }`, `!${src.scss }/**`, // sass gets compiled
    `!${src.icons}`, `!${src.icons}/**`, // icons get processed
    `!${SRC_ROOT}/views`, `!${SRC_ROOT}/views/**`, // Laravel
    `!${SRC_ROOT}/lang`,  `!${SRC_ROOT}/lang/**`,  // Laravel
]

//////////////////////////////////

if( app )
    var wpHotMW = require('webpack-hot-middleware'),
        series  = require('stream-series'),
        inject  = require('gulp-inject')

if( hash ) var hashing = require('gulp-hash')

//////////////////////////////////
// DELETE OLD FILES
export const DEL = path => del(path)

//////////////////////////////////
// SERVER
export function server() {

    let middleware = [ wpDevMW(bundler, { stats: wpConfig.stats }) ]

    if( app ) middleware.push(wpHotMW(bundler))

    // Start Server
    browser.init({ open: false, proxy, middleware });

    // Watch JS
    gulp.watch(`${src.js}/**/*.js`).on('change', () => browser.reload())

    // Watch Sass
    gulp.watch(`${src.scss}/**/*.scss`, styles)

    // Watch Icons
    gulp.watch(src.icons, icons)
        .on('unlink', () => DEL(`${dest.assets}/icons.svg`))

    // Watch Misc
    gulp.watch(miscGlob, copy)
        .on('unlink', (path, stats) => DEL(path.replace(SRC_ROOT, DEST_ROOT)))

    // Watch Laravel Views
    gulp.watch(`${SRC_ROOT}/views/**/*.blade.php`).on('change', () => browser.reload())

}


//////////////////////////////////
// SASS
export function styles() {
    let outputStyle = production ? 'compressed' : 'nested'

    let stylesTask = gulp.src(`${src.scss}/*.scss`)
        .pipe(maps.init())
        .pipe(sass({ outputStyle }).on('error', notify.onError({
            title: 'Sass Error',
            message: '<%= error.message %>',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iNkFDODdBRTVCODI4QzVBNEQyREYwQjNFNjY4RTA3NUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODczODExQ0Y4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODczODExQ0U4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgSWxsdXN0cmF0b3IgQ0MgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MTU1QjEzMjJCQUUxMUUzOEQyRUI1RDJFRDdBRTlBOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NUZDNzBEQTJCQUUxMUUzOEQyRUI1RDJFRDdBRTlBOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg6bVCEAAAAYUExURcVNiei30PXf6t2Xu9N4pv///81mmv///+3Od60AAAAIdFJOU/////////8A3oO9WQAAAYRJREFUeNqclVmShEAIRJPV+994oKwFtHtiYvjR0CdrFuKqZkyiqq4qxNZeodwzqRdT4o+gib9M7A1SRxCWV3qC0qnMUvPq0kFpVFaSxuRYJB4coJO6TReJxiU2fUkYFRK1DvjAWBS3qRnhrihA25ze2Cw4n5Bx3tsAZYWliZXC5AYlQT5fRyBH6xOP0O4cIBWuuRsOs5jRd1znWXB9Om7TofuFGRkvDsnxSoVB2yFj+lnziUe6viXIyvqOAuEUhKtw8Rd1Qzc4I7Mxsz07pQukDYZPHkpvHdg5lMQDANAb5TuJHB8/XzZQS3N/IXWD8QmXdrzBolkfFeFDgtkeqrOI8CFXjnP7JGmNsCrS+Mx4GePS4nEocsxlDXRZqEequ4hgGGenSyRlZk18mAoENZd8jsLkYkJzpjVLqYdrFBBZLhHVhWXnuKbDkdrUvtQGUVkAWfCgCU0DM/BZKbODr/4t7iypdaq/cGXt5arDV64t0g+Y0v9X89+X/fl9RLLv38ePAAMALJofTrM3rn0AAAAASUVORK5CYII='
        })))

    if( production )
        stylesTask = stylesTask.pipe(prefixer({ browsers: ['android >= 4.2', '> 0.2%', 'not ie <= 8'] }))

    if( production && hash )
        stylesTask = stylesTask.pipe(hashing({ hashLength: 3, template: '<%= name %>.<%= hash %><%= ext %>' }))

    return stylesTask
        .pipe(maps.write('./'))
        .pipe(gulp.dest(dest.scss))
        .pipe(browser.stream({ match: '**/*.css' }))
}


////////////////////////////////
// SVG ICONS
export function icons() {
    return gulp.src(`${src.icons}/**/*.svg`)
        .pipe(svgmin(file => {
            let prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: { prefix: prefix + '-', minify: false },
                    removeDoctype: true,
                    removeXMLProcInst: true,
                    removeMetadata: true
                }]
            };
        }))
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(gulp.dest(dest.assets))
}


////////////////////////////////
// COPY
export function copy() {
    return gulp.src(miscGlob, { dot: true })
        .pipe(changed(DEST_ROOT))
        .pipe(gulp.dest(DEST_ROOT))
        .pipe(browser.reload({ stream: true }))
}


////////////////////////////////
// INJECT
export function inject() {

    let styles  = gulp.src(`${dest.scss}/main.*.css`, { read: false }),
        vendor  = gulp.src(`${dest.js}/vendor.*.js`,  { read: false }),
        scripts = gulp.src(`${dest.js}/main.*.js`,    { read: false })

    return gulp.src([
        `${DEST_ROOT}/**/*.html`,
        `${DEST_ROOT}/**/head*.php`, // for non-WorPress PHP files
        `${DEST_ROOT}/**/footer.php`,
    ])
        .pipe(inject(series(styles, vendor, scripts), {
            relative: true,
            removeTags: true
        }))
        .pipe(gulp.dest(DEST_ROOT))
}


////////////////////////////////
// CLEAN
export function cleanDest() { return DEL(DEST_ROOT) }
export function cleanDestCSS() { return DEL([dest.scss]) }


////////////////////////////////////////////////////////
//// GULP TASKS
export const dev = gulp.series( cleanDest, gulp.parallel(copy, styles, icons), server )

export const css = gulp.series( cleanDestCSS, styles ) // CSS only

export const build = gulp.series( cleanDestCSS, styles ) // Webpack, then CSS

export default dev
