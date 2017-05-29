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

function main() {

    Nav()

    onResize()


}



// window.addEventListener('load', () => {
//
//     if( 'serviceWorker' in navigator ) {
//
//         navigator.serviceWorker.register('/serviceWorker.js')
//             .then(registration => {
//                 console.log('SW Reg successfull.', registration.scope);
//             }, err => {
//                 console.log('SW failed.', err);
//             })
//
//     }
//
// })
