<?php
require_once('includes/functions/cleanup.php');
require_once('includes/functions/remove-menus.php');
require_once('includes/functions/custom-login.php');

require_once('includes/functions/acf-option.php');

//require_once('includes/functions/custom-post-type.php');

require_once('includes/functions/enqueue-files.php');
require_once('includes/functions/filter-hooks.php');
require_once('includes/functions/navigation.php');

require_once('includes/functions/rename-default-posts.php');
require_once('includes/functions/rest-prepare.php');
require_once('includes/functions/widgets.php');


//////////////////////////////
// IMAGES
// add_image_size( 'size-large', 9999, 900 );
// add_image_size( 'size-medium', 786, 700 );
// add_image_size( 'size-small', 543, 500, true );
// add_image_size( 'portfolio-size', 426, 240, array( 'center', 'center' ) );
//add_filter( 'jpeg_quality', create_function( '', 'return 90;' ) );



//////////////////////////////
// THEME SUPPORT
add_theme_support( 'post-thumbnails', array( 'page', 'post', 'portfolio' ) ); // Featured Image
add_theme_support( 'post-formats', array( 'aside', 'gallery' ) ); // aside, gallery, link, image, quote, status, video, audio, chat
