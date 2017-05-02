import del      from 'del'
import gulp     from 'gulp'
import path     from 'path'
import webp     from 'gulp-webp'
import svgmin   from 'gulp-svgmin'
import Browser  from 'browser-sync'
import changed  from 'gulp-changed'
import svgstore from 'gulp-svgstore'

import { paths, app, hash, copyGlob } from './config'

const browser = Browser.create()

////////////////////////////////////////////////////////////////

export function copy() {
    return gulp.src(copyGlob, { dot: true })
        .pipe(changed(paths.dest.root))
        .pipe(gulp.dest(paths.dest.root))
}

export function copyInjectionRecipients() {
    return gulp.src([
            `${paths.src.root}/**/*.html`,
            `${paths.src.root}/**/head*.php`,
            `${paths.src.root}/**/footer.php`,
        ])
        .pipe(gulp.dest(paths.dest.root))
}

////////////////////////////////////////////////////////////////

export function icons() {
    return gulp.src(`${paths.src.icons}/**/*.svg`)
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
        .pipe(gulp.dest(paths.dest.assets))
}

////////////////////////////////////////////////////////////////

if( hash && app )
    var series = require('stream-series'),
        Inject = require('gulp-inject')

export function inject() {

    let styles  = gulp.src(`${paths.dest.css}/main.*.css`, { read: false }),
        vendor  = gulp.src(`${paths.dest.js}/vendor.*.js`, { read: false }),
        scripts = gulp.src(`${paths.dest.js}/main.*.js`,   { read: false })

    return gulp.src([
        `${paths.dest.root}/**/*.html`,
        `${paths.dest.root}/**/head*.php`,  // for non-WorPress
        `${paths.dest.root}/**/footer.php`, // for non-WorPress
    ])
        .pipe(Inject(series(styles, vendor, scripts), {
            relative: true,
            removeTags: true
        }))
        .pipe(gulp.dest(paths.dest.root))
}

////////////////////////////////////////////////////////////////
