/*
HOW TO USE ES6 VERSION
(ES5 in Snippets)

* Import all Modules in main.js
* Run Module in onResize Function

function log() { ... }
onResize( log )
*/


export default function(...cb) {

	const waitForFinalEvent = (() => {

        let timers = {}

        return function(callback, ms, resizeID) {

            if( !resizeID ) { resizeID = '239586' }

    		if( timers[resizeID] ) {
                clearTimeout(timers[resizeID])
            }

            timers[resizeID] = setTimeout(callback, ms)
        }

    })()

	window.onresize = () => {
		waitForFinalEvent(() => {

			for( let i = 0; i < cb.length; i++ ) {
			    cb[i]()
			}


		}, 30, 'resizeID')
	}

}
