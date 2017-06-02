import fs       from 'fs'
import gulp     from 'gulp'
import sass	    from 'gulp-sass'
import maps     from 'gulp-sourcemaps'
import notify   from 'gulp-notify'
import hashing  from 'gulp-hash'
import prefixer from 'gulp-autoprefixer'

import { paths, app, hash, critical, hashLength } from './config'

const isProduction = (process.env.NODE_ENV === 'production')

//////////////////////////////////

export function styles() {

    let outputStyle = isProduction ? 'compressed' : 'nested'

    let stylesTask = gulp.src(`${paths.src.css}/main.scss`)
        .pipe(maps.init())
        .pipe(sass({ outputStyle }).on('error', notify.onError({
            title: 'Sass Error',
            message: '<%= error.message %>',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iNkFDODdBRTVCODI4QzVBNEQyREYwQjNFNjY4RTA3NUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODczODExQ0Y4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODczODExQ0U4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgSWxsdXN0cmF0b3IgQ0MgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MTU1QjEzMjJCQUUxMUUzOEQyRUI1RDJFRDdBRTlBOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NUZDNzBEQTJCQUUxMUUzOEQyRUI1RDJFRDdBRTlBOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg6bVCEAAAAYUExURcVNiei30PXf6t2Xu9N4pv///81mmv///+3Od60AAAAIdFJOU/////////8A3oO9WQAAAYRJREFUeNqclVmShEAIRJPV+994oKwFtHtiYvjR0CdrFuKqZkyiqq4qxNZeodwzqRdT4o+gib9M7A1SRxCWV3qC0qnMUvPq0kFpVFaSxuRYJB4coJO6TReJxiU2fUkYFRK1DvjAWBS3qRnhrihA25ze2Cw4n5Bx3tsAZYWliZXC5AYlQT5fRyBH6xOP0O4cIBWuuRsOs5jRd1znWXB9Om7TofuFGRkvDsnxSoVB2yFj+lnziUe6viXIyvqOAuEUhKtw8Rd1Qzc4I7Mxsz07pQukDYZPHkpvHdg5lMQDANAb5TuJHB8/XzZQS3N/IXWD8QmXdrzBolkfFeFDgtkeqrOI8CFXjnP7JGmNsCrS+Mx4GePS4nEocsxlDXRZqEequ4hgGGenSyRlZk18mAoENZd8jsLkYkJzpjVLqYdrFBBZLhHVhWXnuKbDkdrUvtQGUVkAWfCgCU0DM/BZKbODr/4t7iypdaq/cGXt5arDV64t0g+Y0v9X89+X/fl9RLLv38ePAAMALJofTrM3rn0AAAAASUVORK5CYII='
        })))

    if( isProduction )
        stylesTask = stylesTask.pipe(prefixer())

     if( isProduction && app || isProduction && hash )
        stylesTask = stylesTask.pipe(hashing({ hashLength: 5, template: '<%= name %>.<%= hash %><%= ext %>' }))

    return stylesTask
        .pipe(maps.write('./'))
        .pipe(gulp.dest(paths.dest.css))
}



export function injectCritical() {

    return new Promise(resolve => {

        let cssFiles = []

        if( critical ) {

            const criticalCSS = require('critical')

            fs.readdirSync(paths.dest.css).forEach(file => {
                if( file.indexOf('.map') === -1 )
                    cssFiles.push(paths.dest.css + '/' + file)
            })

            criticalCSS.generate({
                    base: paths.dest.root,
                    src: 'index.html',
                    dest: 'index.html',
                    css: cssFiles,
                    inline: true,
                    minify: true,
                    include: [],
                    ignore: [/nav[\-\_]/] // nav- nav_
                })
        }

        console.log(
            critical ? `Critical CSS injected from ${cssFiles}`.green
                     : 'Critical CSS disabled.'.yellow
        )

        resolve()

    })


}
