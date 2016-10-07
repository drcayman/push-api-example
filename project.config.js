
export const wp = false;

export const host = 'wp-webpack.local';  // set if WordPress

export const theme = `
/*
Theme Name: Boilerplate
Version: 1.0
Author: Pascal Klau <email@artofmyself.com>
Author URI: http://www.artofmyself.com
Description: Boilerplate WP Theme
*/`;



export const readme = res => {

	let today = new Date(),
			d = today.getDate(),
			m = today.getMonth() + 1,
			y = today.getFullYear();

	if( d < 10 ) d = '0' + d
	if( m < 10 ) m = '0' + m

	today = `${d}.${m}.${y}`

	return `
### ${res.project}
_${res.url}_
- - - -

> **Gestartet von:** ${res.author}\x20\x20
> **Angelegt am:** ${today}\x20\x20
> **URL:** ${res.url}\x20\x20
> **Server:** ${res.server}\x20\x20
> **CMS:** ${res.cms}\x20\x20

**Notizen:**
* ${res.notes}`

}



export const paths = {
	build: 'build',
	assets: 'assets',
	buildAssets: 'build/assets',
	scss: {
		main: 'src/scss/main.scss',
		src: 'src/scss',
	},
	css: {
		src: 'build/css/*.css',
		dest: 'build/css'
	},
	js: {
		main: 'src/js/main.js',
		srcMin: 'build/js/*.js',
		src: 'src/js',
		dest: 'build/js'
	},
	img: {
		src: 'src/assets/img/**/*',
		dest: 'build/assets/img'
	},
	icons: {
		src: 'src/assets/icons/icon-*.svg',
		dest: 'build/assets/icons'
	},
	fonts: {
		src: 'src/assets/fonts/*.ttf',
		dest: 'build/assets/fonts'
	},
	html: {
		src: 'src/**/*.html',
		dest: 'build/**/*.html'
	},
	php: {
		src: 'src/**/*.php',
		dest: 'build/**/*.php'
	},
	inj: {
		css: 'build/css/main.*.css',
		jsVendor: 'build/js/vendor.*.js',
		jsMain: 'build/js/main.*.js'
	}
}



export const server =
    wp ? {
        open: false,
        host,
        proxy: host,
        server: false
    }
    : {
        open: 'localhost',
        server: {
            baseDir: './' + paths.build
        }
    };



export const hashOpts = {
    hashLength: 3,
    template: '<%= name %>.<%= hash %><%= ext %>'
};
