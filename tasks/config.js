////////////////////////////////////////////////////////////////

const app   = true // add specfic dependencies + HMR
const hash  = true // add specfic dependencies for hash in file name: main.e4d.js
const webp  = false // convert images to webp (set Apache config for delivery)
const proxy = false // false || MAMP/Valet DNS
const critical = false // inject critical CSS

////////////////////////////////////////////////////////////////

const prefixerConfig = { browsers: ['android >= 4.2', '> 0.2%', 'not ie <= 8'] }

const hashConfig = { hashLength: 3, template: '<%= name %>.<%= hash %><%= ext %>' }

const chunkhash = hash ? '.[chunkhash:3]' : ''

const uglifyConfig = {
	compress: {
		drop_console: true,
		warnings: false
	},
	sourceMap: true // just in case Webpack dev tools enabled
}

////////////////////////////////////////////////////////////////

const paths = {		// Laravel => src: resources | dest: public
	src: {
		root: 'src',
		  js: 'src/js',
         css: 'src/scss',
	  assets: 'src/assets',
         img: 'src/assets/img',
       icons: 'src/assets/icons',
       fonts: 'src/assets/fonts',
    favicons: 'src/assets/favicons'
	},
	dest: {
		root: 'build',
		  js: 'build/js',
	     css: 'build/css',
	  assets: 'build/assets',
	     img: 'build/assets/img',
	   fonts: 'build/assets/fonts',
    favicons: 'build/assets/favicons'
	}
}

////////////////////////////////////////////////////////////////

const copyGlob = [
    `${paths.src.root}/**`,
	// Folder 						 // Folder Content
    								 `!${paths.src.js}/**`, 	         // JS folder needed for WP enqueue
    `!${paths.src.css}`,             `!${paths.src.css}/**`,             // Sass gets compiled
	//`!${paths.src.img}`,             `!${paths.src.img}/**`, 	   		 // Images copied own their own (webp)
    `!${paths.src.icons}`,           `!${paths.src.icons}/**`,   		 // Icons get processed
    `!${paths.src.root}/views`,      `!${paths.src.root}/views/**`,      // Laravel
    `!${paths.src.root}/lang`,       `!${paths.src.root}/lang/**`,       // Laravel
	`!${paths.src.root}/components`, `!${paths.src.root}/components/**`, // Vue
]

////////////////////////////////////////////////////////////////

module.exports = {
	app, webp,
	hash, critical,
	prefixerConfig, uglifyConfig, hashConfig,
	paths, chunkhash,
	copyGlob, proxy
}
