import del  from 'del'
import gulp from 'gulp'
import process from 'process'

import { styles, injectCritical }  from './styles'
import { scripts } from './webpack'
import { server }  from './server'
import { images }  from './images'

import { copy, icons, inject, DEL } from './misc'
import { paths, app, hash } from './config'


// Check if CSS/JS specific command is run (npm run css)
const event = process.env.npm_lifecycle_event
const solo  = (event === 'js' || event === 'css')


export const dev = gulp.series( DEL( paths.dest.root),
                        gulp.parallel(copy, styles, icons),
                    server ) // Webpack on server

export const css = solo ? gulp.series(DEL(paths.dest.css), styles, inject) :
                          gulp.series(DEL(paths.dest.css), styles )

export const js  = solo ? gulp.series(DEL(paths.dest.js), scripts, inject) :
                          gulp.series(DEL(paths.dest.js), scripts )

export const build = app ? gulp.series(gulp.parallel(css, js, images), inject, injectCritical) :
                           gulp.series(css, js) // not parallel due to progress

export default dev
