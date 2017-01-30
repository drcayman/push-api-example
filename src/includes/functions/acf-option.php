<?php

// if( function_exists('acf_add_options_page') ) {
//
// 	acf_add_options_page(array(
// 		'page_title' 	=> 'Allgemeine Optionen',
// 		'menu_title'	=> 'Allgemeine Optionen',
// 		'menu_slug' 	=> 'allgemeine-optionen',
// 		'capability'	=> 'edit_posts',
// 		'redirect'		=> false
// 	));
//
// }


// ACF GMAP API
function acf_map_init() {

	acf_update_setting('google_api_key', 'AIzaSyBADXQUHYJEAwy7PCpoOxEQPxLoH6gWPEU');
}

add_action('acf/init', 'acf_map_init');
