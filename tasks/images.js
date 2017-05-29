import gulp from 'gulp'
import Webp from 'gulp-webp'
import { paths, webp } from './config'


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

    return new Promise(resolve => console.log('WebP disabled.'.green), resolve())

}
