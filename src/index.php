
<?php get_header(); ?>


<div class="header-sticky">
<header class="header">

    <div class="flex container">

        <div class="logo">
            <a href="./">
                <img src="assets/img/logo.svg" alt="__TITLE__">
            </a>
        </div>
        <!-- <h1>__TITLE__</h1> -->

        <div id="nav-handler" class="nav-handler">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <nav id="nav-main" class="nav">
            <ul>
                <li class="nav-dropdown nav--item"><a href="#0">Item</a></li>
                <li class="nav-drop nav--item"><a href="#0">Item Has Sub</a>
                    <ul class="nav-sub">
                        <li class="nav-sub--item"><a  href="#0">Sub Item</a></li>
                        <li class="nav-drop nav-sub--item"><a href="#0">Sub Item Has Deep</a>
                            <ul class="nav-deep">
                                <li class="nav-deep--item"><a href="#0">Deep Item</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>

</header>
</div>



<main id="content"> <!-- content -->

    

</main> <!-- end content -->


<?php get_footer(); ?>
