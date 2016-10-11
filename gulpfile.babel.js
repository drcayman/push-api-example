// TODO
/*
* JS Stream >> Reload
* Icons Tests
* Hashing Tests
* Vue Loader w/ Webpack
*/

'use strict';

// NODE
import path      from 'path';               import del      from 'del';
import exists    from 'fs-exists-sync';     import process  from 'process';
import fs        from 'fs';

// GULP
import gulp      from 'gulp';				import sass	    from 'gulp-sass';
import plumber	 from 'gulp-plumber';       import imagemin from 'gulp-imagemin';
import notify    from 'gulp-notify';        import maps     from 'gulp-sourcemaps';
import prefixer  from 'gulp-autoprefixer';  import cleanCSS from 'gulp-clean-css';
import svgstore  from 'gulp-svgstore';      import svgmin   from 'gulp-svgmin';
import htmlmin   from 'gulp-htmlmin';       import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';     import inject   from 'gulp-inject';
import hash      from 'gulp-hash';          import gulpif   from 'gulp-if';
import changed   from 'gulp-changed';       import gutil    from 'gulp-util';
import sftp      from 'gulp-sftp';

// MISC
import yargs     from 'yargs';              import prompt   from 'prompt';
import Browser   from 'browser-sync';       import colors   from 'colors';
import series    from 'stream-series';      import webpack  from 'webpack-stream';

import {    src,    serve,  wp,      setHash,
            dest,   readme, theme,   hashOpts,
            sftp as SFTP,   build as buildFolder    } from './project.config'

const argv     = yargs.argv
const browser  = Browser.create()
const error    = { title: 'Error', message: '<%= error.message %>' }
const miscGlob = ['src/**', `!${src.js   }`, `!${src.js   }/**`,
                            `!${src.img  }`, `!${src.img  }/**`,
                            `!${src.scss }`, `!${src.scss }/**`,
                            `!${src.fonts}`, `!${src.fonts}/**`,
                            `!${src.icons}`, `!${src.icons}/**`]

export const DEL = path => del(path)

//////////////////////////////////
// SERVER
export function server() {
    browser.init({
        ghostmode: serve.ghostmode,
        open: serve.open,
        proxy: serve.proxy,
        server: serve.server
    });

    // Watch Sass
    gulp.watch(`${src.scss}/**/*.scss`, styles)
        .on('change', () => DEL(dest.scss))


    // Watch JS
    gulp.watch(`${src.js}/**/*.js`, scripts)
        .on('change', () => DEL(dest.js))


    // Watch Fonts
    gulp.watch(`${src.fonts}/**/*`, gulp.parallel(fonts, copy.fonts))
        .on('unlink', () => DEL(dest.fonts))


    // Watch Icons
    gulp.watch(src.icons, icons)
        .on('unlink', () => DEL(dest.icons))


    // Watch Images
    gulp.watch(src.img, gulp.series(images))
        .on('unlink', (path, stats) => DEL(path.replace('src', buildFolder)))


    // Watch Misc
    gulp.watch(miscGlob, copy.misc)
        .on('unlink', (path, stats) => DEL(path.replace('src', buildFolder)))
};


//////////////////////////////////
// WEBPACK
export function scripts() {
    return gulp.src(`${src.js}/main.js`)
		.pipe(plumber({ errorHandler: notify.onError(error) }))
		.pipe(webpack(require('./webpack.config')))
		.pipe(gulpif(setHash, hash(hashOpts)))
        .pipe(gulp.dest(dest.js))
        .pipe(browser.reload({ stream: true }))
};


//////////////////////////////////
// SASS
export function styles() {
    return gulp.src(`${src.scss}/main.scss`)
        .pipe(maps.init())
        .pipe(sass().on('error', notify.onError(error)))
        .pipe(prefixer({ browsers: ['last 2 versions'] }))
        .pipe(gulpif(setHash, hash(hashOpts)))
        .pipe(gulpif(argv.production, cleanCSS()))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(dest.scss))
        .pipe(browser.stream({ match: '**/*.css' }))
};


////////////////////////////////
// SVG ICONS
export function icons() {
    return gulp.src(`${src.icons}/**/icon-*.svg`)
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
export function images() {
    return gulp.src(`${src.img}/**/*`)
		.pipe(changed(dest.img))
        .pipe(imagemin())
        .pipe(gulp.dest(dest.img));
};


//////////////////////////////////
// FONTS
export function fonts() {
    return gulp.src(src.fonts + '/**/*.ttf')
		.pipe(changed(dest.fonts))
        .pipe(ttf2woff({ clone: true }))
        .pipe(ttf2woff2({ clone: true }))
        .pipe(gulp.dest(dest.fonts))
};


//////////////////////////////////
// README
export function createReadme() {

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

                fs.writeFile('./README.md', readme(res), () => resolve());

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
    fonts() { return gulp.src(src.fonts + '/**/*').pipe(gulp.dest(dest.fonts)) },
    misc() {
        return gulp.src(miscGlob)
            .pipe(changed(buildFolder))
            .pipe(gulp.dest(buildFolder))
    }
}
export const copyAll = gulp.parallel(copy.fonts, copy.misc);


////////////////////////////////
// MIN HTML + INJECT
export function html() {

    let styles  = gulp.src(`${dest.scss}/main.*.css`, { read: false });
    let vendor  = gulp.src(`${dest.js}/vendor.*.css`, { read: false });
    let scripts = gulp.src(`${dest.js}/main.*.js`,    { read: false });

    return gulp.src(`${buildFolder}/**/*.html`)
        .pipe(gulpif(!wp, inject(series(styles, vendor, scripts), { relative: true })))
        .pipe(gulpif(!wp, htmlmin({
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            removeComments: true
        })))
        .pipe(gulp.dest(buildFolder))
};


//////////////////////////////////
// FTP (https://www.npmjs.com/package/gulp-sftp)
export function ftp() {

    function upload(host, user, pass) {

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
    .then(login => upload(...login))
};


////////////////////////////////////////////////////////
//// GULP TASKS
export const dev = gulp.series(
                   gulp.parallel(copyAll, styles, scripts, icons, fonts, images),
                   server)

export const build = gulp.series(gulp.parallel(styles, scripts), html)

export default dev
