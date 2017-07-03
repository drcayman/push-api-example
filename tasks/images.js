import { paths, webp as convertWebp } from './config'
import { src, dest, watch, parallel, series } from 'gulp'


export const webp = () => {

    if( convertWebp ) {

        const Webp = require('gulp-webp')

        let filesToConvert = [
            `${paths.src.img}/**/*`,
            `!${paths.src.img}/favicon*`
        ]

        return src(filesToConvert)
            .pipe(Webp())
            .pipe(dest(paths.dest.img))
    }

    return new Promise(resolve => {
        console.log('WebP disabled.'.yellow)
        resolve()
    })

}
