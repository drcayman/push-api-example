<?php

/*
* Loop through CSS and JS folder.
* Get only .css/.js files.
* Set dependencies depending on file name.
* Enqueue file.
*/


function enqueue_files() {

////////////////////////////////////////////////////////
/// CSS
	$dirCSS = new DirectoryIterator(get_stylesheet_directory() . '/css');

	foreach ($dirCSS as $file) {

		if( pathinfo($file, PATHINFO_EXTENSION) === 'css' ) {

			wp_enqueue_style( basename($file, '.css'), (get_template_directory_uri() . '/css/' . basename($file)), false, null );
		}

	}


////////////////////////////////////////////////////////
/// JAVASCRIPT
	$dirJS = new DirectoryIterator(get_stylesheet_directory() . '/js');

	foreach ($dirJS as $file) {

		if( pathinfo($file, PATHINFO_EXTENSION) === 'js' ) {

			$fullName = basename($file);
			$name = substr(basename($fullName), 0, strpos(basename($fullName), '.'));


		////////////////////////////////////////////////////////
		/// DEPENDENCIES >PHP 5.3

			switch($name) {

				case 'vendor':
					$deps = array('manifest');	break;

				case 'main':
					$deps = array('vendor');	break;

				default:
					$deps = null;				break;

			}


		////////////////////////////////////////////////////////
		/// ENQUEUE SCRIPT
			wp_enqueue_script( $name, get_template_directory_uri() . '/js/' . $fullName, $deps, null, true );


		////////////////////////////////////////////////////////
		/// LOCALIZE
			if( $name === 'vendor' ) {
				$site_parameters = array(
					'siteUrl' => get_site_url(),
					'themeUrl' => get_template_directory_uri()
				);
				wp_localize_script( 'vendor', 'localize', $site_parameters );

			}


		}

	}




////////////////////////////////////////////////////////
/// DEREGISTER JQUERY
	if( !is_admin() ) {	wp_deregister_script('jquery'); }

}
add_action( 'wp_enqueue_scripts', 'enqueue_files' );
