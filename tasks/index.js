import del  from 'del'
import gulp from 'gulp'
import process from 'process'

import { styles, injectCritical }  from './styles'
import { scripts } from './webpack'
import { server }  from './server'
import { webp }  from './images'

import { copy, icons, DEL } from './misc'
import { inject } from './injection'
import { paths, app, wp, hash } from './config'



export const dev = gulp.series(
                        DEL(paths.dest.root),
                        gulp.parallel(copy, styles, icons),
                        server
                    )

export const css = gulp.series(DEL(paths.dest.css), styles )

export const js  = gulp.series(DEL(paths.dest.js), scripts, inject)

export const build = gulp.series(
                            DEL([paths.dest.css, paths.dest.js]),
                            styles,
                            scripts,
                            webp,
                            inject,
                            injectCritical
                        )

export default dev
