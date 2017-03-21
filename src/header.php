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
	<meta property="og:image" content="assets/img/social-preview.png">  <!-- 1200x630 (1.91:1), <1MB -->
	<meta property="og:url"   content="__URL__" >
	<meta name="twitter:card" content="summary_large_image">

	<!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="assets/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="assets/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="assets/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="assets/favicons/manifest.json">
    <link rel="mask-icon" href="assets/favicons/safari-pinned-tab.svg" color="#bbd7d4">
    <meta name="theme-color" content="#bbd7d4">

	<?php wp_head(); ?>
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
