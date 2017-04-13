import gulp from 'gulp'

import { styles }  from './tasks/styles'
import { scripts } from './tasks/scripts'
import { server }  from './tasks/server'
import { icons }   from './tasks/icons'

import { copy, DEL }  from './tasks/copy-clean'
import { paths, app } from './tasks/config'


export const dev = gulp.series( DEL(paths.dest.root),
                        gulp.parallel(copy, styles, icons),
                    server ) // Webpack on server

export const css = gulp.series( DEL(paths.dest.css), styles )
export const js  = gulp.series( DEL(paths.dest.js), scripts )

export const build = gulp.parallel(js, css)

export default dev
