import del  from 'del'
import gulp from 'gulp'

import { styles }  from './styles'
import { scripts } from './scripts'
import { server }  from './server'

import { copy, icons, inject }  from './misc'
import { paths, app } from './config'

function DEL(path) { return del.bind(null, path) }

export const dev = gulp.series( DEL(paths.dest.root),
                        gulp.parallel(copy, styles, icons),
                    server ) // Webpack on server

export const css = gulp.series( DEL(paths.dest.css), styles )
export const js  = gulp.series( DEL(paths.dest.js), scripts )

export const build = gulp.parallel(js, css)

export default dev
