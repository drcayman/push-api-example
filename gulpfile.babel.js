// TODO
/*
* Only copy added/changed/deleted images
* Make use of imagemin
* Test hashing again
*/

'use strict';

import path          from 'path';                 import deleteData  from 'del';
import exists        from 'fs-exists-sync';       import prompt      from 'prompt';
import gulp          from 'gulp';				  import sass		 from 'gulp-sass';
import browserSync   from 'browser-sync';         import webpack     from 'webpack-stream';
import plumber	     from 'gulp-plumber';         import yargs       from 'yargs'
import notify        from 'gulp-notify';          import imagemin	 from 'gulp-imagemin';
import maps          from 'gulp-sourcemaps';      import colors      from 'colors'
import autoprefixer  from 'gulp-autoprefixer';    import cleanCSS    from 'gulp-clean-css';
import svgstore      from 'gulp-svgstore';        import svgmin      from 'gulp-svgmin';
import htmlmin       from 'gulp-htmlmin';         import ttf2woff    from 'gulp-ttf2woff';
import ttf2woff2     from 'gulp-ttf2woff2';       import inject      from 'gulp-inject';
import hash          from 'gulp-hash';            import fs          from 'fs';
import gulpif        from 'gulp-if';              import series      from 'stream-series';
import changed		 from 'gulp-changed';         import gutil from 'gulp-util';

import { wp, theme, paths, readme, sever, hashOpts } from './project.config'

const browser = browserSync.create();
const argv    = yargs.argv
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// DEVELOPMENT
// Server, Sass, Webpack, SVG, WP Theme
//////////////////////////////////////////////////////
export const delCSS = () => deleteData([paths.css.dest])
export const delJS  = () => deleteData([paths.js.dest])
export const delFonts = () => deleteData([paths.fonts.dest])
export const delHTML = () => deleteData([paths.html.dest, paths.php.dest])


export const del = path => deleteData(path)
////////////////////////////////
// SERVER
export function server() {
    browser.init({
        ghostmode: false, // mirror events on devices
        open: server.open,
        host: server.host,
        proxy: server.proxy,
        server: server.server
    });


    // Watch Sass
    gulp.watch(`${paths.scss.src}/**/*.scss`, styles)
        .on('change', () => del(paths.css.dest));


    // Watch JS
    gulp.watch(`${paths.js.src}/**/*.js`, scripts)
        .on('change', () => del(paths.js.dest));


    // Watch Fonts
    gulp.watch(paths.fonts.src + '/**/*', gulp.parallel(fonts, copy.fonts))
        .on('unlink', () => del(paths.fonts.dest))


    // Watch Icons
    gulp.watch(paths.icons.src, icons)
        .on('change', () => del(paths.icons.dest))


    // Watch Images
    gulp.watch(paths.img.src, gulp.series(img))
        .on('unlink', (path, stats) => del(path.replace('src', 'build')))


    // Watch HTML/PHP
    gulp.watch(paths.html.src, copy.html)
        .on('unlink', (path, stats) => del(path.replace('src', 'build')))


    // Watch non processed Files
    gulp.watch(paths.misc, copy.misc)
        .on('unlink', (path, stats) => del(path.replace('src', 'build')))


};



//////////////////////////////////
// WEBPACK
export function bundle() {
    return gulp.src(paths.js.main)
		.pipe(plumber({ errorHandler: notify.onError({
				title: 'Webpack Error',
	        	message: '<%= error.message %>',
			})
		}))
		.pipe(webpack(require('./webpack.config')))
		.pipe(gulpif(wp, hash(hashOpts)))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browser.stream({ match: '**/*.js' }))     // Inject Bundle
};
export const scripts = gulp.series(delJS, bundle);


//////////////////////////////////
// SASS
export function styles() {
    return gulp.src(paths.scss.main)
        .pipe(maps.init())
        .pipe(sass().on('error', notify.onError({
			title: 'Sass Error',
	        message: 'Error: <%= error.message %>',
		})))
        .pipe(autoprefixer({ browsers: ['> 0.1%', 'IE 10'], cascade: false }))
        .pipe(gulpif(wp, hash(hashOpts)))
        .pipe(gulpif(argv.production, cleanCSS()))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browser.stream({match: '**/*.css'}))     // Inject Sass/CSS
};


////////////////////////////////
// SVG ICONS
export function icons() {
    return gulp.src(paths.icons.src)
        //.pipe(rename({prefix: 'icon-'}))
        .changed(paths.icons.dest)
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
        .pipe(gulp.dest(paths.icons.dest))
};


////////////////////////////////
// IMAGES
export function img() {
    return gulp.src(paths.img.src)
		.pipe(changed(paths.img.dest))
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest));
};


//////////////////////////////////
// FONTS ( npm i -g gulp-ttf2woff gulp-ttf2woff2 )
export function fonts() {
    return gulp.src(paths.fonts.src + '/**/*.ttf')
		.pipe(changed(paths.fonts.dest))
        .pipe(ttf2woff({ clone: true }))
        .pipe(ttf2woff2({ clone: true }))
        .pipe(gulp.dest(paths.fonts.dest))
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
            })
        }
    });
}


////////////////////////////////
// THEME CONFIG
export function createTheme() {
    return new Promise(res => {
        fs.writeFile(`${paths.build}/style.css`, theme, () => res());
    });
};


////////////////////////////////
// COPY
export const copy = {
    html() {
		return gulp.src(paths.html.src)
			.pipe(changed(paths.build))
			.pipe(gulp.dest(paths.build))
	},
    fonts() {
        return gulp.src(paths.fonts.src + '/**/*')
            .pipe(gulp.dest(paths.fonts.dest))
    },
    misc() {
        return gulp.src([paths.srcAssets + '/**/*', '!src/assets/img/**/*', '!src/assts/fonts', '!src/assets/fonts/**, favicons/**}'])
            .pipe(gulp.dest(paths.buildAssets))
    }

}
export const copyAll = gulp.parallel(/*copy.html, copy.fonts,*/ copy.misc);


// MIN HTML + INJECT in HTML/wordpress FUNCTIONS
export function html() {
    return gulp.src(paths.html.dest)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            removeComments: true
        }))
        .pipe(gulp.dest(paths.build))
};


export function injection() {

    let mainCSS  = gulp.src([paths.inj.css], 	  { read: false });
    let vendorJS = gulp.src([paths.inj.jsVendor], { read: false });
    let mainJS 	 = gulp.src([paths.inj.jsMain],   { read: false });

    return gulp.src(paths.html.src)
        .pipe(inject(series(mainCSS, vendorJS, mainJS), { relative: true }))
        .pipe(gulp.dest(paths.build))
};

////////////////////////////////////////////////////////
//// GULP TASKS
export const dev = gulp.series(createReadme,
                   gulp.parallel(copyAll, styles, scripts, icons, fonts),
                   server);

export const build = wp ? gulp.parallel(styles, scripts)
                            : gulp.series(gulp.parallel(styles, scripts), injection, html); // minHTML after inject to not delete tags

export default dev;
