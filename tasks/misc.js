import del      from 'del'
import path     from 'path'
import svgmin   from 'gulp-svgmin'
import Browser  from 'browser-sync'
import changed  from 'gulp-changed'
import svgstore from 'gulp-svgstore'

import { paths, app, wp, copyGlob } from './config'
import { src, dest, watch, parallel, series } from 'gulp'

////////////////////////////////////////////////////////////////

export const DEL = path => del.bind(null, path)

////////////////////////////////////////////////////////////////

export const copy = () => src(copyGlob, { dot: true })
    .pipe(changed(paths.dest.root))
    .pipe(dest(paths.dest.root))


////////////////////////////////////////////////////////////////

export const icons = () => src(`${paths.src.icons}/**/*.svg`)
    .pipe(svgmin(file => {
        let prefix = path.basename(file.relative, path.extname(file.relative));
        return {
            plugins: [{
                cleanupIDs: { prefix: prefix + '-', minify: false },
                removeDoctype: true,
                removeXMLProcInst: true,
                removeMetadata: true
            }]
        };
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(dest(paths.dest.assets))
