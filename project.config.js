////////////////////////////////////////////////////////////////
const app   = false     // add specfic dependencies + HMR
const hash  = false 	// add hash to file name: main.e4d.js
const proxy = 'http://boilerplate.dev' // false || MAMP/Valet DNS

////////////////////////////////////////////////////////////////
// PATHS
// Laravel => src: resources | dest: public
const SRC_ROOT = 'src',
	src = {
	      js: SRC_ROOT + '/js',
	    scss: SRC_ROOT + '/scss',
	     img: SRC_ROOT + '/assets/img',
	   icons: SRC_ROOT + '/assets/icons',
	   fonts: SRC_ROOT + '/assets/fonts',
	favicons: SRC_ROOT + '/assets/favicons'
}

const DEST_ROOT = 'build',
	dest = {
          js: DEST_ROOT + '/js',
        scss: DEST_ROOT + '/css',
      assets: DEST_ROOT + '/assets',
         img: DEST_ROOT + '/assets/img',
       fonts: DEST_ROOT + '/assets/fonts',
	favicons: DEST_ROOT + '/assets/favicons'
}


module.exports = {
	app, hash, proxy,
	src, dest, SRC_ROOT, DEST_ROOT
}
