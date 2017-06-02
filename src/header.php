<!DOCTYPE html>
<html lang="en">
<head>

	<meta charset="utf-8">

	<meta name="viewport"     content="width=device-width, initial-scale=1.0, user-scalable=no">
	<meta name="description"  content="<?php bloginfo('description') ?>">
<!-- <meta name="author" 	  content="ArtOfMySelf | Pascal Klau | www.artofmyself.com"> -->

	<title><?php bloginfo('name') ?></title>

	<!-- Social Media -->
	<meta property="og:title" content="__TITLE__">
	<meta property="og:type"  content="website">
	<meta property="og:image" content="//__DOMAIN__/assets/img/opengraph.jpg">  <!-- 1200x630 (1.91:1), <1MB -->
	<meta property="og:url"   content="__URL__" >

	<!-- Favicons -->
	<link rel="icon" href="assets/img/favicon.png" sizes="16x16 32x32 64x64 128x128" type="image/png">
    <link rel="apple-touch-icon" href="assets/img/favicon.png">

	<?php wp_head(); ?>

	<!-- inject:manifest --><!-- endinject -->
</head>
<body>


	<div class="header-sticky">
	<header class="header">
		<div class="container">

			<div class="logo">
				<h1>TITLE</h1>
			</div>

			<?php
				wp_nav_menu( array(
					'menu' => 'Main',
					'theme_location' => 'Header',
					'container' => 'nav',
					'container_class' => 'nav-main',
					'menu_class' => false
				) )
			 ?>

		</div>
	</header>
	</div>
