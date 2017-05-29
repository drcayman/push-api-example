import del  from 'del'
import gulp from 'gulp'
import process from 'process'

import { styles, criticalStyles }  from './styles'
import { scripts } from './webpack'
import { server }  from './server'
import { images }  from './images'

import { copy, icons, inject }  from './misc'
import { paths, app, hash } from './config'


function DEL(path) { return del.bind(null, path) }

// Check if CSS/JS specific command is run
const event  = process.env.npm_lifecycle_event
const solo = (event === 'js' || event === 'css')

export const dev = gulp.series( DEL( paths.dest.root),
                        gulp.parallel(copy, styles, images, icons),
                    server ) // Webpack on server

export const css = solo ? gulp.series(DEL(paths.dest.css), styles, recipients, inject) :
                          gulp.series(DEL(paths.dest.css), styles )

export const js  = solo ? gulp.series(DEL(paths.dest.js), scripts, recipients, inject) :
                          gulp.series(DEL(paths.dest.js), scripts )

export const build = app ? gulp.series(css, js, inject, criticalStyles) :
                           gulp.series(css, js) // not parallel due to progress

export default dev
