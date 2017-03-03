<?php

function custom_login_logo() { ?>
    <style>

        /* $prim-color: #3fa47f; lighter:
           $sec-color:  #e7ffe9;
           $txt-color:  #3d3d3d;
        */

        .login {
            background: linear-gradient(#e7ffe9, #fff);
        }

        .wp-core-ui .submit .button-primary {
            background: #3fa47f;
            border-color: transparent;
            color: #fff;
            text-shadow: none;
            box-shadow: none;
        }

        input:focus {
            border-color: #3fa47f !important;
            box-shadow: 0 0 2px #3fa47f !important;
        }

        .wp-core-ui .submit .button-primary:hover,
        .wp-core-ui .submit .button-primary:focus {
            background: #328265;
            border-color: transparent;
            box-shadow: none;
        }

        #login a:hover {
            color: #3fa47f !important;
        }

        #login h1 a, .login h1 a {
            background-image: url('<?= get_stylesheet_directory_uri(); ?>/assets/img/login-logo.png');
            background-size: auto;
            width: 100%;
        }
    </style>
<?php }
add_action( 'login_enqueue_scripts', 'custom_login_logo' );



// CHANGE LOGO LINK
add_filter( 'login_headerurl', function() {
    return home_url();
});

// CHANGE LOGO TITLTE
add_filter( 'login_headertitle', function() {
    return get_bloginfo('name');
});

// DISABLE LOGIN STYLE
// add_action( 'login_enqueue_scripts', function() {
//     wp_dequeue_style( 'login' );
// });
//
// ADD CUSTOM LOGIN STYLES
// add_action( 'login_enqueue_scripts', function() {
//     wp_enqueue_style( 'custom-login', get_stylesheet_directory_uri() . '/css/main.css' );
// });
