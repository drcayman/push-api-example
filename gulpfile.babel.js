// TODO
/*
* Only copy added/changed/deleted images
*/

'use strict';

import path          from 'path';                 import del         from 'del';
import gulp          from 'gulp';				  import sass		 from 'gulp-sass';
import browserSync   from 'browser-sync';         import webpack     from 'webpack-stream';
import webpackConfig from './webpack.config';	  import plumber	 from 'gulp-plumber';
import babel 		 from 'gulp-babel';			  import notify      from 'gulp-notify';
import maps          from 'gulp-sourcemaps';	  import uglify      from 'gulp-uglify';
import autoprefixer  from 'gulp-autoprefixer';    import cleanCSS    from 'gulp-clean-css';
import svgstore      from 'gulp-svgstore';        import svgmin      from 'gulp-svgmin';
import htmlmin       from 'gulp-htmlmin';         import ttf2woff    from 'gulp-ttf2woff';
import ttf2woff2     from 'gulp-ttf2woff2';       import inject      from 'gulp-inject';
import hash          from 'gulp-hash';            import fs          from 'fs';
import gulpif        from 'gulp-if';              import series      from 'stream-series';
import changed		 from 'gulp-changed';		  import imagemin	 from 'gulp-imagemin';


import * as cfg from './project.config'

const browser   = browserSync.create();
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
		.pipe(webpack(webpackConfig)
			.on('error', function handleError() {
				this.emit('end');
			})
		)
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
        .pipe(maps.write('./'))
        .pipe(gulpif(cfg.wp, hash(cfg.hashOpts)))
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
export function woff() {
    return gulp.src([cfg.paths.fonts.src])
		.pipe(changed(cfg.paths.fonts.dest))
        .pipe(ttf2woff())
        .pipe(gulp.dest(cfg.paths.fonts.dest));
};

export function woff2() {
    return gulp.src([cfg.paths.fonts.dest])
		.pipe(changed(cfg.paths.fonts.dest))
        .pipe(ttf2woff2())
        .pipe(gulp.dest(cfg.paths.fonts.dest));
};

////////////////////////////////
// THEME CONFIG
export function WPtheme() {
    const content =
`/*
    Theme Name: ${theme.name}
    Version: ${theme.version}
    Author: ${theme.author}
    Author URI: ${theme.authorURI}
    Description: ${theme.description}
*/`;

    return new Promise(res => {
        fs.writeFile(`${cfg.paths.build}/style.css`, content);
        res();
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

//////////////////////////////////////////////////////
// PRODUCTION
// Minification, Hashing, Injection
//////////////////////////////////////////////////////

// MIN CSS
export function minCSS() {
    return gulp.src(cfg.paths.css.src)
		.pipe(maps.init({ loadMaps: true }))
		.pipe(cleanCSS())
		.pipe(maps.write('./'))
        .pipe(gulp.dest(cfg.paths.css.dest))
};

// MIN JS
export function minJS() {
    return gulp.src(cfg.paths.js.srcMin)
		.pipe(maps.init({ loadMaps: true }))
		.pipe(babel())
		.pipe(uglify())
		.pipe(maps.write('./'))
        .pipe(gulp.dest(cfg.paths.js.dest))
};

// MIN HTML + INJECT in HTML/wordpress FUNCTIONS
export function minHTML() {
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
const dev = cfg.wp ? gulp.series(gulp.parallel(copyAll, styles, scripts, icons, WPtheme), server)
                   : gulp.series(gulp.parallel(copyAll, styles, scripts, icons), server);
export { dev };

const build = cfg.wp ? gulp.parallel(minCSS, minJS)
                     : gulp.series(gulp.parallel(minCSS, minJS), injection, minHTML); // minHTML after inject to not delete tags
export { build };

export default dev;
