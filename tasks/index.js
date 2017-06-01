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


// Check if CSS/JS specific command is run (npm run css)
const event = process.env.npm_lifecycle_event
const solo  = (event === 'js' || event === 'css')


export const dev = gulp.series(DEL( paths.dest.root),
                        gulp.parallel(copy, styles, icons),
                    server)

export const css = (solo && app && !wp)
                        ? gulp.series(DEL(paths.dest.css), styles, inject, injectCritical)
                        : gulp.series(DEL(paths.dest.css), styles )

export const js  = (solo && app && !wp)
                        ? gulp.series(DEL(paths.dest.js), scripts, inject)
                        : gulp.series(DEL(paths.dest.js), scripts )

export const build = gulp.series(css, js, webp, inject, injectCritical)

export default dev
