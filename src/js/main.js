import Polyfill from 'dynamic-polyfill'
import onResize from './lib/onResize'
import WebFont  from 'webfontloader'
//import './modules/service-worker-setup'

import Nav from './modules/nav'


Polyfill({
    fills: ['fetch', 'Promise'],
    options: ['gated'],
    afterFill() {
        main()
    }
})

function main() {

    Nav()

    onResize()


}

WebFont.load({
    google: {
        families: ['Roboto:400,700']
    }
})

setTimeout(() => import('./test'), 2000)
