import Polyfill from 'dynamic-polyfill'
import onResize from './lib/onResize'

import Nav from './modules/nav'



Polyfill({
    fills: ['fetch', 'Promise'],
    options: ['gated'],
    afterFill() {
        main()


    }
})

console.log('hit');
function main() {

    Nav()

    onResize()


}
