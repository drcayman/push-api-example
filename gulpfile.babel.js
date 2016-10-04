'use strict';

const wordpress = false;
const host      = 'wp-webpack.local';  // set if WordPress
const theme     = {
	name: 'Boilerplate',
	version: '1.0',
	author: 'ArtOfMySelf <email@artofmyself.com>',
	authorURI: 'http://www.artofmyself.com',
    description: 'Boilerplate WP Theme'
};
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
import path          from 'path';                 import del         from 'del';
import gulp          from 'gulp';
import browserSync   from 'browser-sync';         import webpack     from 'webpack-stream';
import webpackConfig from './webpack.config';	  import plumber	 from 'gulp-plumber';
import babel 		 from 'gulp-babel';			  import notify      from 'gulp-notify';
import maps        from 'gulp-sourcemaps';		  import uglify      from 'gulp-uglify';
import autoprefixer  from 'gulp-autoprefixer';    import cleanCSS    from 'gulp-clean-css';
import svgstore      from 'gulp-svgstore';        import svgmin      from 'gulp-svgmin';
import htmlmin       from 'gulp-htmlmin';         import ttf2woff    from 'gulp-ttf2woff';
import ttf2woff2     from 'gulp-ttf2woff2';       import inject      from 'gulp-inject';
import hash          from 'gulp-hash';            import fs          from 'fs';
import gulpif        from 'gulp-if';              import series      from 'stream-series';
import eslint		 from 'gulp-eslint';		  import sass		 from 'gulp-sass';

const browser   = browserSync.create();
const hashOpts  = { hashLength: 3, template: '<%= name %>.<%= hash %><%= ext %>'  };
const serveOpts = wordpress ? { open: false, host, proxy: host, server: false }
                            : { open: 'localhost', server: { baseDir: './build' } };
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// DEVELOPMENT
// Server, Sass, Webpack, SVG, WP Theme
//////////////////////////////////////////////////////
const delCSS = () => { del(['build/css']) }
const delJS = () => { del(['build/js']) }
////////////////////////////////
// SERVER
export function server() {
    browser.init({
        ghostmode: false, // mirror events on devices
        open: serveOpts.open,
        host: serveOpts.host,
        proxy: serveOpts.proxy,
        server: serveOpts.server
    });

    gulp.watch('src/scss/**/*.scss', gulp.series( delCSS, styles ));
    gulp.watch('src/js/**/*.js',     gulp.series( delJS, scripts ));

    gulp.watch('src/includes/**/*.php', copy.copyWP);
    gulp.watch('src/assets/img/**/*',   copy.copyIMG);
    gulp.watch('src/**/*.html',         copy.copyHTML);
    gulp.watch('src/*.php',             copy.copyPHP);

    gulp.watch('src/assets/icons/*',    svg);
    gulp.watch('theme.config.js',       WPtheme);

    gulp.watch('build/assets/**/*').on('change', browser.reload);
    gulp.watch('build/**/*.html')  .on('change', browser.reload);
    gulp.watch('build/**/*.php')   .on('change', browser.reload);
};


//////////////////////////////////
// WEBPACK
export function scripts() {
    return gulp.src('src/js/main.js')
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
		.pipe(gulpif(wordpress, hash(hashOpts)))
        .pipe(gulp.dest('build/js'))
        .pipe(browser.stream({match: '**/*.js'}))     // Inject Bundle
};


//////////////////////////////////
// SASS
export function styles() {
    return gulp.src('src/scss/main.scss')
        .pipe(maps.init())
        .pipe(sass().on('error', notify.onError({
			title: 'Sass Error',
	        message: 'Error: <%= error.message %>',
		})))
        .pipe(autoprefixer({ browsers: ['> 0.1%', 'IE 10'], cascade: false }))
        .pipe(maps.write('./'))
        .pipe(gulpif(wordpress, hash(hashOpts)))
        .pipe(gulp.dest('build/css'))
        .pipe(browser.stream({match: '**/*.css'}))     // Inject Sass/CSS
};


////////////////////////////////
// SVG
export function svg() {
    return gulp.src('src/assets/icons/*.svg')
        //.pipe(rename({prefix: 'icon-'}))
        .pipe(svgmin( (file) => {
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
        .pipe(gulp.dest('build/assets/icons'))
};

//////////////////////////////////
// FONTS
export function woff() {
    return gulp.src(['src/assets/fonts/*.ttf'])
        .pipe(ttf2woff())
        .pipe(gulp.dest('build/assets/fonts'));
};

export function woff2() {
    return gulp.src(['src/assets/fonts/*.ttf'])
        .pipe(ttf2woff2())
        .pipe(gulp.dest('build/assets/fonts'));
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

    return new Promise( (resolve) => {
        fs.writeFile('build/style.css', content);
        resolve();
    });
};

////////////////////////////////
// COPY

export const copy = {
    copyHTML() { return gulp.src(['src/**/*.html']) .pipe(gulp.dest('build')) },
    copyPHP() { return gulp.src(['src/**/*.php'])  .pipe(gulp.dest('build')) },
    copyIMG() { return gulp.src(['src/assets/img/**/*'])  .pipe(gulp.dest('build/assets/img')) },
    copyWP() { return gulp.src(['src/includes/**/*.php']) .pipe(gulp.dest('build/includes')) }
}

export const copyAll = gulp.parallel(copy.copyHTML, copy.copyPHP, copy.copyIMG, copy.copyWP);

//////////////////////////////////////////////////////
// PRODUCTION
// Minification, Hashing, Injection
//////////////////////////////////////////////////////

// MIN CSS
export function minCSS() {
    return gulp.src('build/css/*.css')
		.pipe(maps.init({ loadMaps: true }))
		.pipe(cleanCSS())
		.pipe(maps.write('./'))
        .pipe(gulp.dest('build/css'))
};

// MIN JS
export function minJS() {
    return gulp.src('build/js/*.js')
		.pipe(maps.init({ loadMaps: true }))
		.pipe(babel())
		.pipe(uglify())
		.pipe(maps.write('./'))
        .pipe(gulp.dest('build/js'))
};

// MIN HTML + INJECT in HTML/wordpress FUNCTIONS
export function minHTML() {
    return gulp.src('build/**/*.html')
        .pipe( htmlmin({
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            removeComments: true
        }))
        .pipe(gulp.dest('build'))
};

export function injectFiles() {

    let mainCSS  = gulp.src(['build/css/main.*.css'], { read: false });
    let vendorJS = gulp.src(['build/js/vendor.*.js'], { read: false });
    let mainJS 	 = gulp.src(['build/js/main.*.js'],   { read: false });

    return gulp.src('src/**/*.html')
        .pipe(inject(series(mainCSS, vendorJS, mainJS), { relative: true }))
        .pipe(gulp.dest('build'))
};

////////////////////////////////////////////////////////
//// GULP TASKS
const dev = wordpress ? gulp.series(gulp.parallel(copyAll, styles, scripts, svg, WPtheme), server)
                      : gulp.series(gulp.parallel(copyAll, styles, scripts, svg), server);
export { dev };

const build = wordpress ? gulp.parallel(minCSS, minJS)
                        : gulp.series(gulp.parallel(minCSS, minJS), injectFiles, minHTML); // minHTML after inject to not delete tags
export { build };

export default dev;
