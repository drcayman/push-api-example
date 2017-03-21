<?php

show_admin_bar(false); // DISABLE ADMIN BAR

// DISABLE EMAIL AFTER SUCCESSFUL UPDATE
function disable_update_emails( $send, $type, $core_update, $result ) {
    if( !empty( $type ) && $type == 'success' ) {
        return false;
    }
    return true;
}
add_filter( 'auto_core_update_send_email', 'disable_update_emails', 10, 4 );


function disable_meta_and_emoji() {

    // VARIOUS HEAD TAGS
    remove_action ('wp_head', 'rsd_link'); // RSS Feed
    remove_action( 'wp_head', 'wlwmanifest_link'); // Windows Live Writer
    remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0 ); // Shortlink
    remove_action('wp_head', 'rel_canonical');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_oembed_add_discovery_links', 10); // oEmbed
    remove_action('wp_head', 'rest_output_link_wp_head', 10); // REST API link tag
    remove_action('template_redirect', 'rest_output_link_header', 11, 0); // REST API link

    // EMOJIS
    remove_action( 'admin_print_styles', 'print_emoji_styles' );
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
    remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
    remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

    add_filter( 'tiny_mce_plugins', 'disable_emojicons_tinymce' );
    add_filter( 'emoji_svg_url', '__return_false' );

    if( !is_admin() ) { wp_deregister_script('wp-embed'); }
}

function disable_emojicons_tinymce( $plugins ) {
    if( is_array( $plugins ) ) {
        return array_diff( $plugins, array( 'wpemoji' ) );
    } else {
        return array();
    }
}
add_action( 'init', 'disable_meta_and_emoji' );


// RECENT COMMENT CSS
function remove_recent_comments_style() {
    global $wp_widget_factory;
    remove_action('wp_head', array($wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'));
}
add_action('widgets_init', 'remove_recent_comments_style');


// REMOVE type="text/javascript"
// function clean_script_tag($input) {
//     $input = str_replace('type="text/javascript" ', '', $input);
//     return str_replace("'", '"', $input);
// }
// add_filter('script_loader_tag', 'clean_script_tag');


// REMOVE WP UPDATE NOTIFICATION FOR NON ADMINS
function remove_core_updates() {
    if( !current_user_can('update_core') ) {
        return;
    }
    add_action('init', create_function('$a',"remove_action( 'init', 'wp_version_check' );"), 2);
    add_filter('pre_option_update_core','__return_null');
    add_filter('pre_site_transient_update_core','__return_null');
}
add_action('after_setup_theme','remove_core_updates');
