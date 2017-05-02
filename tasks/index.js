import del  from 'del'
import gulp from 'gulp'
import process from 'process'

import { styles }  from './styles'
import { scripts } from './webpack'
import { server }  from './server'
import { images }  from './images'

import { copy, copyInjectionRecipients as recipients, icons, inject }  from './misc'
import { paths, app, hash } from './config'


function DEL(path) { return del.bind(null, path) }


export const dev = gulp.series( DEL( paths.dest.root),
                        gulp.parallel(copy, styles, images, icons),
                    server ) // Webpack on server

export const css = app ? gulp.series(DEL(paths.dest.css), styles, recipients, inject) :
                         gulp.series(DEL(paths.dest.css), styles )

export const js  = app ? gulp.series(DEL(paths.dest.js), scripts, recipients, inject) :
                         gulp.series(DEL(paths.dest.js), scripts )

export const build = app ? gulp.series(css, js, recipients, inject) :
                           gulp.series(css, js) // not parallel due to progress

export default dev
