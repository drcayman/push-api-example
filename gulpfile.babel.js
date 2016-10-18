// TODO
/*
* Injection (on build: delete originals || on dev: no CSS stream)
* Vue Loader w/ Webpack
* Hot Module Reloading
*/

'use strict';

// NODE
import path      from 'path';               import del      from 'del';
import exists    from 'fs-exists-sync';     import process  from 'process';
import fs        from 'fs';

// GULP
import gulp      from 'gulp';				import sass	    from 'gulp-sass';
//import imagemin from 'gulp-imagemin';
import notify    from 'gulp-notify';        import maps     from 'gulp-sourcemaps';
import prefixer  from 'gulp-autoprefixer';  import cleanCSS from 'gulp-clean-css';
import svgstore  from 'gulp-svgstore';      import svgmin   from 'gulp-svgmin';
import htmlmin   from 'gulp-htmlmin';
import hash      from 'gulp-hash';          import gulpif   from 'gulp-if';
import changed   from 'gulp-changed';       import gutil    from 'gulp-util';
import sftp      from 'gulp-sftp';



// MISC
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig        from './webpack.config'

import yargs     from 'yargs';              import prompt   from 'prompt';
import Browser   from 'browser-sync';       import colors   from 'colors';
import series    from 'stream-series';      import webpack  from 'webpack';

import {    src,    serve,  wp,        setHash,
            dest,   theme,   hashOpts, createReadme,
            sftp as SFTP,   build as buildFolder    } from './project.config'

const argv     = yargs.argv
const browser  = Browser.create()
const bundler  = webpack(webpackConfig);
const miscGlob = ['src/**', `!${src.js   }`, `!${src.js   }/**`,
                            //`!${src.img  }`, `!${src.img  }/**`,
                            `!${src.scss }`, `!${src.scss }/**`,
                            `!${src.icons}`, `!${src.icons}/**`]

export const DEL = path => del(path)

//////////////////////////////////
// SERVER
export function server() {
    browser.init({
        ghostmode: serve.ghostmode,
        open: serve.open,
        proxy: serve.proxy,
        injectChanges: true,
        server: {
            baseDir: serve.server,
            middleware: [

            webpackDevMiddleware(bundler, {
              publicPath: webpackConfig.output.publicPath,
              stats: {
                  colors: true,
                  chunks: false,
              }

          }),
            webpackHotMiddleware(bundler)
          ]
        },
        files: ['src/js/main.js']
    });

    // Watch Sass
    gulp.watch(`${src.scss}/**/*.scss`, styles)
        .on('change', () => DEL(dest.scss))


    // Watch Icons
    gulp.watch(src.icons, icons)
        .on('unlink', () => DEL(`${dest.icons}/icons.svg`))


    // Watch Images
    // gulp.watch(src.img, gulp.series(images))
    //     .on('unlink', (path, stats) => DEL(path.replace('src', buildFolder)))


    // Watch Misc
    gulp.watch(miscGlob, copy.misc)
        .on('unlink', (path, stats) => DEL(path.replace('src', buildFolder)))

};


//////////////////////////////////
// SASS
export function styles() {
    return gulp.src(`${src.scss}/main.scss`)
        .pipe(maps.init())
        .pipe(sass().on('error', notify.onError({
            title: 'Sass Error',
            message: '<%= error.message %>',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iNkFDODdBRTVCODI4QzVBNEQyREYwQjNFNjY4RTA3NUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODczODExQ0Y4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODczODExQ0U4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgSWxsdXN0cmF0b3IgQ0MgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MTU1QjEzMjJCQUUxMUUzOEQyRUI1RDJFRDdBRTlBOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4NUZDNzBEQTJCQUUxMUUzOEQyRUI1RDJFRDdBRTlBOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg6bVCEAAAAYUExURcVNiei30PXf6t2Xu9N4pv///81mmv///+3Od60AAAAIdFJOU/////////8A3oO9WQAAAYRJREFUeNqclVmShEAIRJPV+994oKwFtHtiYvjR0CdrFuKqZkyiqq4qxNZeodwzqRdT4o+gib9M7A1SRxCWV3qC0qnMUvPq0kFpVFaSxuRYJB4coJO6TReJxiU2fUkYFRK1DvjAWBS3qRnhrihA25ze2Cw4n5Bx3tsAZYWliZXC5AYlQT5fRyBH6xOP0O4cIBWuuRsOs5jRd1znWXB9Om7TofuFGRkvDsnxSoVB2yFj+lnziUe6viXIyvqOAuEUhKtw8Rd1Qzc4I7Mxsz07pQukDYZPHkpvHdg5lMQDANAb5TuJHB8/XzZQS3N/IXWD8QmXdrzBolkfFeFDgtkeqrOI8CFXjnP7JGmNsCrS+Mx4GePS4nEocsxlDXRZqEequ4hgGGenSyRlZk18mAoENZd8jsLkYkJzpjVLqYdrFBBZLhHVhWXnuKbDkdrUvtQGUVkAWfCgCU0DM/BZKbODr/4t7iypdaq/cGXt5arDV64t0g+Y0v9X89+X/fl9RLLv38ePAAMALJofTrM3rn0AAAAASUVORK5CYII='
        })))
        .pipe(prefixer({ browsers: ['last 2 versions'] }))

        .pipe(gulpif(setHash && argv.production, hash(hashOpts)))
        .pipe(gulpif(argv.production, cleanCSS()))

        .pipe(maps.write('./'))
        .pipe(gulp.dest(dest.scss))
        .pipe(browser.stream({ match: '**/*.css' }))
};


////////////////////////////////
// SVG ICONS
export function icons() {
    return gulp.src(`${src.icons}/**/*.svg`)
        //.pipe(rename({prefix: 'icon-'}))
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
        .pipe(gulp.dest(dest.icons))
};


////////////////////////////////
// IMAGES
// export function images() {
//     return gulp.src(`${src.img}/**/*`)
// 		.pipe(changed(dest.img))
//         .pipe(imagemin())
//         .pipe(gulp.dest(dest.img));
// };


//////////////////////////////////
// FONTS
// export function fonts() {
//     return gulp.src(src.fonts + '/**/*.ttf')
// 		   .pipe(changed(dest.fonts))
//         .pipe(ttf2woff({ clone: true }))
//         .pipe(ttf2woff2({ clone: true }))
//         .pipe(gulp.dest(dest.fonts))
// };


//////////////////////////////////
// README
export function readme() {

    return new Promise(resolve => {

        if( exists('README.md') ) { resolve() }
        else {
            prompt.message = ('');
            prompt.delimiter = colors.gray(' ==>');
            prompt.start();

            prompt.get([{ name: 'project', description: 'Name des Projekts'.green + '*'.red, required: true },
                        { name: 'author',  description: 'Ersteller des Projekts'.green + '*'.red, required: true },
                        { name: 'url',     description: 'URL (http://)'.green, pattern: /^https?:\/\// },
                        { name: 'server',  description: 'Server'.green },
                        { name: 'cms',     description: 'CMS'.green, default: 'Typo3' },
                        { name: 'notes',   description: 'Notizen'.green }
                ], (err, res) => {

                fs.writeFile('./README.md', createReadme(res), () => resolve());

                gutil.log('README.md created.'.green)
            })
        }
    });
}


////////////////////////////////
// THEME CONFIG
export function createTheme() {
    return new Promise(res => {
        if( wp ) fs.writeFile(`${buildFolder}/style.css`, theme, () => res());
    });
};


////////////////////////////////
// COPY
export const copy = {
    fonts() {
        return gulp.src(src.fonts + '/**/*')
            .pipe(changed(dest.fonts))
            .pipe(gulp.dest(dest.fonts))
    },
    misc() {
        return gulp.src(miscGlob)
            .pipe(changed(buildFolder))
            .pipe(gulp.dest(buildFolder))
            .pipe(browser.reload({ stream: true }))
    }
}
export const copyAll = gulp.parallel(copy.fonts, copy.misc);


////////////////////////////////
// MIN HTML + INJECT
export function html() {

    // let styles  = gulp.src(`${dest.scss}/main.*.css`, { read: false });
    // let vendor  = gulp.src(`${dest.js}/vendor.*.js`, { read: false });
    // let scripts = gulp.src(`${dest.js}/main.*.js`,    { read: false });

    return gulp.src(`${buildFolder}/**/*.html`)
        //.pipe(gulpif(setHash, inject(series(styles, vendor, scripts), { relative: true })))
        .pipe(gulpif(!wp, htmlmin({
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            removeComments: true
        })))
        .pipe(gulp.dest(buildFolder))
        .pipe(gulpif(setHash, browser.reload({ stream: true })))
};


//////////////////////////////////
// FTP (https://www.npmjs.com/package/gulp-sftp)
export function upload() {

    function uploadProcess(host, user, pass) {

        process.chdir(__dirname)

        return gulp.src(`./${buildFolder}/js/*`)
            .pipe(sftp({ host, user, pass, remotePath: SFTP.path }))
    }

    return new Promise(res => {

        process.chdir(process.env.HOME)

        fs.readFile(`${process.cwd()}/.sftp_login`, (err, data) => {

            if( err ) gutil.log(gutil.colors.red(err))

            let logins = JSON.parse(data);

            res([logins[SFTP.server].host,
                logins[SFTP.server].user,
                logins[SFTP.server].pass])

        })
    })
    .then(login => uploadProcess(...login))
};


////////////////////////////////////////////////////////
//// GULP TASKS
export const dev = gulp.series(
                   gulp.parallel(copyAll, styles/*, scripts*/, icons/*, images*/),
                   server)

export const build = gulp.series(gulp.parallel(styles/*, scripts*/), html)

export default dev
