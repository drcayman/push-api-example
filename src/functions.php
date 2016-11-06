<?php
require_once('includes/functions/enqueue-files.php');
require_once('includes/functions/filter-hooks.php');
require_once('includes/functions/rest-prepare.php');
require_once('includes/functions/custom-post-type.php');
require_once('includes/functions/navigation.php');
require_once('includes/functions/rename-default-posts.php');
require_once('includes/functions/widgets.php');


show_admin_bar(false); // DISABLE ADMIN BAR

define('DISALLOW_FILE_EDIT', true); // REMOVE EDITABLE PHP FILES IN ADMIN AREA

add_filter( 'auto_core_update_send_email', '__return_false' ); // DISABLE EMAIL AFTER UPDATE

//////////////////////////////
// IMAGES
add_image_size( 'size-large', 9999, 900 );
add_image_size( 'size-medium', 786, 700 );
add_image_size( 'size-small', 543, 500, true );
add_image_size( 'portfolio-size', 426, 240, array( 'center', 'center' ) );
add_filter( 'jpeg_quality', create_function( '', 'return 70;' ) );

// Delete original image
add_filter( 'wp_generate_attachment_metadata', 'delete_fullsize_image' );
function delete_fullsize_image( $metadata )
{
    $upload_dir = wp_upload_dir();
    $full_image_path = trailingslashit( $upload_dir['basedir'] ) . $metadata['file'];
    $deleted = unlink( $full_image_path );

    return $metadata;
}

//////////////////////////////
// POST
add_theme_support( 'post-thumbnails', array( 'page', 'post', 'portfolio' ) ); // Featured Image
add_theme_support( 'post-formats', array( 'aside', 'gallery' ) ); // aside, gallery, link, image, quote, status, video, audio, chat

//////////////////////////////
// OPTION TREE
//add_filter( 'ot_theme_mode', '__return_true' );
//require( trailingslashit( get_template_directory() ) . 'option-tree/ot-loader.php' );

//////////////////////////////
// REMOVE ADMIN ICONS
// function remove_menus(){
//
//   remove_menu_page( 'index.php' );                  //Dashboard
//   remove_menu_page( 'edit.php' );                   //Posts
//   remove_menu_page( 'upload.php' );                 //Media
//   remove_menu_page( 'edit.php?post_type=page' );    //Pages
//   remove_menu_page( 'edit-comments.php' );          //Comments
//   remove_menu_page( 'themes.php' );                 //Appearance
//   remove_menu_page( 'plugins.php' );                //Plugins
//   remove_menu_page( 'users.php' );                  //Users
//   remove_menu_page( 'tools.php' );                  //Tools
//   remove_menu_page( 'options-general.php' );        //Settings
//
// }
// add_action( 'admin_menu', 'remove_menus' );
