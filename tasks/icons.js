import gulp     from 'gulp'
import svgmin   from 'gulp-svgmin'
import svgstore from 'gulp-svgstore'

import { paths } from './config'

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
