import del  from 'del'
import gulp from 'gulp'

import { styles }  from './tasks/styles'
import { scripts } from './tasks/scripts'
import { server }  from './tasks/server'

import { copy, icons, inject }  from './tasks/misc'
import { paths, app } from './tasks/config'


function DEL(path) { return del.bind(null, path) }
//const DEL = path => del(path)

export const dev = gulp.series( DEL( paths.dest.root),
                        gulp.parallel(copy, styles, icons),
                    server ) // Webpack on server

export const css = gulp.series( DEL(paths.dest.css), styles )
export const js  = gulp.series( DEL(paths.dest.js), scripts )

export const build = app ? gulp.series(css, js, inject) :
                           gulp.series(css, js) // not parallel due to progress

export default dev
