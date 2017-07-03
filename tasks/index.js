import del  from 'del'
import process from 'process'

import { styles, injectCritical }  from './styles'
import { scripts } from './webpack'
import { server }  from './server'
import { webp }  from './images'

import { copy, icons, DEL } from './misc'
import { inject } from './injection'
import { paths, app, wp, hash } from './config'
import { src, dest, watch, parallel, series } from 'gulp'



export const dev = series(
                        DEL(paths.dest.root),
                        parallel(copy, styles, icons),
                        server
                    )

export const css = series(DEL(paths.dest.css), styles )

export const js  = series(DEL(paths.dest.js), scripts, inject)

export const build = series(
                            DEL([paths.dest.css, paths.dest.js]),
                            styles,
                            scripts,
                            webp,
                            inject,
                            injectCritical
                        )

export default dev
