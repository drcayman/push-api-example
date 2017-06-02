import Polyfill from 'dynamic-polyfill'
import onResize from './lib/onResize'
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
