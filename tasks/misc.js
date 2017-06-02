import del      from 'del'
import gulp     from 'gulp'
import path     from 'path'
import svgmin   from 'gulp-svgmin'
import changed  from 'gulp-changed'
import svgstore from 'gulp-svgstore'

import { paths, app, wp, copyGlob } from './config'

////////////////////////////////////////////////////////////////

export const DEL = path => del.bind(null, path)

////////////////////////////////////////////////////////////////

export function copy() {
    return gulp.src(copyGlob, { dot: true })
        .pipe(changed(paths.dest.root))
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
