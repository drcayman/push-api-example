// TODO
/*
* Only copy added/changed/deleted images
* Make use of imagemin
* Test hashing again
*/

'use strict';

import path          from 'path';                 import del         from 'del';
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
import changed		 from 'gulp-changed';

import * as cfg    from './project.config'

const browser = browserSync.create();
const argv    = yargs.argv
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// DEVELOPMENT
// Server, Sass, Webpack, SVG, WP Theme
//////////////////////////////////////////////////////
export const delCSS = () => del([cfg.paths.css.dest])
export const delJS = () => del([cfg.paths.js.dest])
export const delIMG = path => del([cfg.paths.img.dest])
////////////////////////////////
// SERVER
export function server() {
    browser.init({
        ghostmode: false, // mirror events on devices
        open: cfg.server.open,
        host: cfg.server.host,
        proxy: cfg.server.proxy,
        server: cfg.server.server
    });

    gulp.watch(`${cfg.paths.scss.src}/**/*.scss`, gulp.series( delCSS, styles ));
    gulp.watch(`${cfg.paths.js.src}/**/*.js`,     gulp.series( delJS, scripts ));
    gulp.watch(cfg.paths.img.src,     			  gulp.series( delIMG, copy.img ));

    //gulp.watch('src/includes/**/*.php', copy.copyWP);
    gulp.watch(cfg.paths.html.src,  copy.html);
    gulp.watch(cfg.paths.php.src,   copy.php);
	gulp.watch(cfg.paths.icons.src, icons);

    ///gulp.watch('theme.config.js',       WPtheme);

    gulp.watch(cfg.paths.img.dest)  .on('change', browser.reload);
    gulp.watch(cfg.paths.icons.dest).on('change', browser.reload);
    gulp.watch(cfg.paths.html.dest) .on('change', browser.reload);
    gulp.watch(cfg.paths.php.dest)  .on('change', browser.reload);
};


//////////////////////////////////
// WEBPACK
export function scripts() {
    return gulp.src(cfg.paths.js.main)
		.pipe(plumber({ errorHandler: notify.onError({
				title: 'Webpack Error',
	        	message: '<%= error.message %>',
			})
		}))
		.pipe(webpack( require('./webpack.config') ))
		.pipe(gulpif(cfg.wp, hash(cfg.hashOpts)))
        .pipe(gulp.dest(cfg.paths.js.dest))
        .pipe(browser.stream({ match: '**/*.js' }))     // Inject Bundle
};


//////////////////////////////////
// SASS
export function styles() {
    return gulp.src(cfg.paths.scss.main)
        .pipe(maps.init())
        .pipe(sass().on('error', notify.onError({
			title: 'Sass Error',
	        message: 'Error: <%= error.message %>',
		})))
        .pipe(autoprefixer({ browsers: ['> 0.1%', 'IE 10'], cascade: false }))
        .pipe(gulpif(cfg.wp, hash(cfg.hashOpts)))
        .pipe(gulpif(argv.production, cleanCSS()))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(cfg.paths.css.dest))
        .pipe(browser.stream({match: '**/*.css'}))     // Inject Sass/CSS
};


////////////////////////////////
// SVG ICONS
export function icons() {
    return gulp.src(cfg.paths.icons.src)
        //.pipe(rename({prefix: 'icon-'}))
		.pipe(changed(cfg.paths.assets))
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
        .pipe(gulp.dest(cfg.paths.icons.dest))
};


////////////////////////////////
// IMAGES
// export function img() {
//     return gulp.src(cfg.paths.img.src)
// 		//.pipe(changed(cfg.paths.img.dest))
//         .pipe(imagemin())
//         .pipe(gulp.dest(cfg.paths.img.dest));
// };


//////////////////////////////////
// FONTS ( npm i -g gulp-ttf2woff gulp-ttf2woff2 )
export function fonts() {
    return gulp.src([cfg.paths.fonts.src])
		.pipe(changed(cfg.paths.fonts.dest))
        .pipe(ttf2woff({ clone: true }))
        .pipe(ttf2woff2({ clone: true }))
        .pipe(gulp.dest(cfg.paths.fonts.dest))
};


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

                fs.writeFile('./README.md', cfg.readme(res), () => resolve());
            })
        }
    });
}


////////////////////////////////
// THEME CONFIG
export function theme() {
    return new Promise(res => {
        fs.writeFile(`${cfg.paths.build}/style.css`, cfg.theme, () => res());
    });
};


////////////////////////////////
// COPY
export const copy = {
    html() {
		return gulp.src([cfg.paths.html.src])
			.pipe(changed(cfg.paths.build))
			.pipe(gulp.dest(cfg.paths.build))
	},
    php() { return gulp.src([cfg.paths.php.src])  .pipe(gulp.dest(cfg.paths.build)) },
    img() { return gulp.src([cfg.paths.img.src])  .pipe(gulp.dest(cfg.paths.img.dest)) },
    //copyWP() { return gulp.src(['src/includes/**/*.php']) .pipe(gulp.dest('build/includes')) }
}

export const copyAll = gulp.parallel(copy.html, copy.php, copy.img/*, copy.copyWP*/);


// MIN HTML + INJECT in HTML/wordpress FUNCTIONS
export function html() {
    return gulp.src(cfg.paths.html.dest)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            removeComments: true
        }))
        .pipe(gulp.dest(cfg.paths.build))
};


export function injection() {

    let mainCSS  = gulp.src([cfg.paths.inj.css], 	  { read: false });
    let vendorJS = gulp.src([cfg.paths.inj.jsVendor], { read: false });
    let mainJS 	 = gulp.src([cfg.paths.inj.jsMain],   { read: false });

    return gulp.src(cfg.paths.html.src)
        .pipe(inject(series(mainCSS, vendorJS, mainJS), { relative: true }))
        .pipe(gulp.dest(cfg.paths.build))
};

////////////////////////////////////////////////////////
//// GULP TASKS
export const dev = cfg.wp ? gulp.series(readme, gulp.parallel(copyAll, styles, scripts, icons, theme), server)
                          : gulp.series(readme, gulp.parallel(copyAll, styles, scripts, icons), server);

export const build = cfg.wp ? gulp.parallel(styles, scripts)
                            : gulp.series(gulp.parallel(styles, scripts), injection, html); // minHTML after inject to not delete tags

export default dev;
