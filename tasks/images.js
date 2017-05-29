import gulp from 'gulp'
import Webp from 'gulp-webp'
import { paths, webp as convertWebp } from './config'


export function webp() {

    if( convertWebp ) {

        let filesToConvert = [
            `${paths.src.img}/**/*`,
            `!${paths.src.img}/favicon*`
        ]

        return gulp.src(filesToConvert)
            .pipe(Webp())
            .pipe(gulp.dest(paths.dest.img))
    }

    return new Promise(resolve => {
        console.log('WebP disabled.'.yellow)
        resolve()
    })

}
