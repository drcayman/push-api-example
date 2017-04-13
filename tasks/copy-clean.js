import del from 'del'
import gulp from 'gulp'
import changed from 'gulp-changed'
import svgmin   from 'gulp-svgmin'
import svgstore from 'gulp-svgstore'

import Browser from 'browser-sync'

import { app, paths, copyGlob } from './config'
import { browser } from './server'

if( app )
    var wpHotMW = require('webpack-hot-middleware'),
        series  = require('stream-series'),
        inject  = require('gulp-inject')

////////////////////////////////////////////////////////////////

export function DEL(path) { return del.bind(null, path) }

////////////////////////////////////////////////////////////////

export function copy() {
    return gulp.src(copyGlob, { dot: true })
        .pipe(changed(paths.dest.root))
        .pipe(gulp.dest(paths.dest.root))
        .pipe(browser.reload({ stream: true }))
}


// export function copyImages() {
//     return gulp.src(paths.src.img, { dot: true })
//         .pipe(changed(paths.dest.img))
//         .pipe(gulp.dest(paths.dest.img))
// }
