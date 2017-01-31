/*
HOW TO USE ES6 VERSION
(ES5 in Snippets)

import onResize from '../lib/onResize'

function log() { ... }

onResize( log() )
*/


export default function(...runOnResize) {

	const waitForFinalEvent = (() => {

        let timers = {}

        return function(cb, ms, resizeID) {

            if( !resizeID ) { resizeID = '239586' }

    		if( timers[resizeID] ) {
                clearTimeout(timers[resizeID])
            }

            timers[resizeID] = setTimeout(cb, ms)
        }

    })()

	window.onresize = e => {
		waitForFinalEvent(() => {

            runOnResize()

		}, 10, 'resizeID')
	}

}
