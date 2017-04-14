import Polyfill from 'dynamic-polyfill'
// import onResize from './lib/onResize'

// import Nav from './modules/nav'
import App from '@/App'
import Vue from 'vue'

new Vue({
    el: '#content',
    components: { App }
})


// Polyfill({
//     fills: ['fetch', 'Promise'],
//     options: ['gated'],
//     afterFill() {
//         main()
//     }
// })

// function main() {
//
//     Nav()
//
//     onResize()
//
//
// }
