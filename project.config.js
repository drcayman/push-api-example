////////////////////////////////
// VARIABLES
export const wp      = false
export const setHash = true

////////////////////////////////////////////////////////////////
// SFTP
export let sftp = {
    server: 'artofmyself',
    path: '/customers/d/e/d/artofmyself.com/httpd.www/test/gulp'
}


////////////////////////////////////////////////////////////////
// SERVER
export const serve = {
	ghostmode: false,
    open: false,
    //proxy: 'bp.local',
	server: './build' // set false when MAMP
}


////////////////////////////////////////////////////////////////
// README
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

////////////////////////////////////////////////////////////////
// PATHS
export const src = {
 favicons: 'src/assets/favicons',
	fonts: 'src/assets/fonts',
	icons: 'src/assets/icons',
	  img: 'src/assets/img',
	   js: 'src/js',
	 scss: 'src/scss'
}
export const build = 'build'
export const dest  = {
 favicons: `${build}/assets/favicons`,
	fonts: `${build}/assets/fonts`,
	icons: `${build}/assets/icons`,
	  img: `${build}/assets/img`,
	   js: `${build}/js`,
	 scss: `${build}/css`
}


////////////////////////////////////////////////////////////////
// HASH
export const hashOpts = {
    hashLength: 3,
    template: '<%= name %>.<%= hash %><%= ext %>'
}


////////////////////////////////////////////////////////////////
// THEME
export const theme = `
/*
Theme Name: Boilerplate
Version: 1.0
Author: Pascal Klau <email@artofmyself.com>
Author URI: http://www.artofmyself.com
Description: Boilerplate WP Theme
*/`;
