
export function transitionEnd() {

    var s = document.body || document.documentElement, s = s.style, /*prefixAnimation = '',*/ prefixTransition = '';

    if( s.WebkitTransition === '' )	prefixTransition = '-webkit-';

    Object.prototype.onCSSTransitionEnd = function( callback ) {

        var runOnce = function( e ){ callback(); e.target.removeEventListener( e.type, runOnce ); };
        this.addEventListener( 'webkitTransitionEnd', runOnce );
        this.addEventListener( 'transitionend', runOnce );
        this.addEventListener( 'transitionend', runOnce );
        if( ( prefixTransition === '' && !( 'transition' in s ) ) /*|| getComputedStyle( this )[ prefixAnimation + 'transition-duration' ] == '0s'*/ ) callback();
        return this;

    };

}

    // var addClass = function( el, className )
    // 		{
    // 			el.classList ? el.classList.add( 'do-it' ) : ( el.className += ' do-it' );
    // 		},
    // 		removeClass = function( el, className )
    // 		{
    // 			el.classList ? el.classList.remove( className ) : ( el.className = el.className.replace( new RegExp( '(^|\\b)' + className.split( ' ' ).join( '|' ) + '(\\b|$)', 'gi' ), ' ' ) );
    // 		};

    	// onCSSAnimationEnd & onCSSTransitionEnd

    	// ;( function ( document, window, index )
    	// {
    	// 	var s = document.body || document.documentElement, s = s.style, /*prefixAnimation = '',*/ prefixTransition = '';
        //
    	// 	//if( s.WebkitAnimation == '' )	prefixAnimation	 = '-webkit-';
    	// 	//if( s.MozAnimation == '' )		prefixAnimation	 = '-moz-';
    	// 	//if( s.OAnimation == '' )		prefixAnimation	 = '-o-';
        //
    	// 	if( s.WebkitTransition == '' )	prefixTransition = '-webkit-';
    	// 	if( s.MozTransition == '' )		prefixTransition = '-moz-';
    	// 	if( s.OTransition == '' )		prefixTransition = '-o-';
        //
    	// 	// Object.prototype.onCSSAnimationEnd = function( callback )
    	// 	// {
    	// 	// 	var runOnce = function( e ){ callback(); e.target.removeEventListener( e.type, runOnce ); };
    	// 	// 	this.addEventListener( 'webkitAnimationEnd', runOnce );
    	// 	// 	this.addEventListener( 'mozAnimationEnd', runOnce );
    	// 	// 	this.addEventListener( 'oAnimationEnd', runOnce );
    	// 	// 	this.addEventListener( 'oanimationend', runOnce );
    	// 	// 	this.addEventListener( 'animationend', runOnce );
    	// 	// 	if( ( prefixAnimation == '' && !( 'animation' in s ) ) || getComputedStyle( this )[ prefixAnimation + 'animation-duration' ] == '0s' ) callback();
    	// 	// 	return this;
    	// 	// };
        //
    	// 	Object.prototype.onCSSTransitionEnd = function( callback )
    	// 	{
    	// 		var runOnce = function( e ){ callback(); e.target.removeEventListener( e.type, runOnce ); };
    	// 		this.addEventListener( 'webkitTransitionEnd', runOnce );
    	// 		this.addEventListener( 'mozTransitionEnd', runOnce );
    	// 		this.addEventListener( 'oTransitionEnd', runOnce );
    	// 		this.addEventListener( 'transitionend', runOnce );
    	// 		this.addEventListener( 'transitionend', runOnce );
    	// 		if( ( prefixTransition == '' && !( 'transition' in s ) ) /*|| getComputedStyle( this )[ prefixAnimation + 'transition-duration' ] == '0s'*/ ) callback();
    	// 		return this;
    	// 	};
    	// }( document, window, 0 ));
        //
        //
    	// // test: onCSSAnimationEnd
        //
    	// // ;( function ( document, window, index )
    	// // {
    	// // 	var button = document.querySelector( '.button-animation' );
    	// // 	button.addEventListener( 'click', function( e )
    	// // 	{
    	// // 		e.preventDefault();
    	// // 		addClass( button, 'do-it' );
    	// // 		button.onCSSAnimationEnd( function()
    	// // 		{
    	// // 			alert( 'CSS animation has been completed!' );
    	// // 			removeClass( button, 'do-it' );
    	// // 		});
    	// // 	});
    	// // }( document, window, 0 ));
        //
        //
    	// // test: onCSSTransitionEnd
        //
    	// ;( function ( document, window, index )
    	// {
    	// 		content.onCSSTransitionEnd( function() {
    	// 			alert( 'CSS transition has been completed!' );
    	// 		});
    	// }( document, window, 0 ));
