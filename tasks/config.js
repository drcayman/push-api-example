////////////////////////////////////////////////////////////////

const wp  = false // hashing, disable injection, remove WP files
const app = true // hsahing, HMR, injection

const proxy = false // false || MAMP/Valet DNS

const webp = false // images to webp (set htaccess)
const hash = app || wp || false // CSS/JS hashing, injection

const critical = !wp && false // inject critical CSS | npm i critical -D

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
    `!${paths.src.icons}`,           `!${paths.src.icons}/**`,   		 // Icons get processed
    `!${paths.src.root}/views`,      `!${paths.src.root}/views/**`,      // Laravel
    `!${paths.src.root}/lang`,       `!${paths.src.root}/lang/**`,       // Laravel
	`!${paths.src.root}/components`, `!${paths.src.root}/components/**`, // Vue
]

////////////////////////////////////////////////////////////////

module.exports = {
	app, webp, wp, hash, critical,
	paths, copyGlob, proxy
}
