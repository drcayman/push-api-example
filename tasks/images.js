import gulp from 'gulp'
import Webp from 'gulp-webp'
import { paths, webp } from './config'

/*
* Convert .png/.jpg to .webp
* If disabled return promise
*/

export function images() {

    if( webp ) {

        let glob = [
            `${paths.src.img}/**/*`,
            `!${paths.src.img}/favicon*`
        ]

        return gulp.src(glob)
            .pipe(Webp())
            .pipe(gulp.dest(paths.dest.img))

    }

    return new Promise(resolve => resolve())

}
