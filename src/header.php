<!DOCTYPE html>
<head>

	<!-- COPY TAGS FROM INDEX.HTML -->

	<?php wp_head(); ?>
</head>
<body id="<?php echo get_query_var('name'); ?>">


	<div class="header-sticky">
	<header class="header">
		<div class="container">

			<div class="logo">
				<h1>REST API Test</h1>
			</div>

			<?php

				wp_nav_menu( array(
					'container'       => 'nav',
					'container_class' => 'nav',
					'items_wrap'      => '<ul>%3$s</ul>',
				) );
			 ?>

		</div>
	</header>
	</div>
