////////////////////////////////////////////////////////////////
const wp  = false
const app = false
const proxyURL = false // false || MAMP/Valet DNS

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

////////////////////////////////////////////////////////////////
// README
const templateReadme = res => {

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
* Have a nice day!`

}


////////////////////////////////////////////////////////////////
// THEME
const templateTheme = `
/*
Theme Name: Boilerplate
Version: 1.0
Author: Pascal Klau <email@artofmyself.com>
Author URI: http://www.artofmyself.com
Description: Boilerplate WP Theme
*/`;


module.exports = {
	wp, app, proxyURL, templateReadme, src, dest, SRC_ROOT, DEST_ROOT, templateTheme
}
