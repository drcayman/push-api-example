import Polyfill from 'dynamic-polyfill'
import onResize from './lib/onResize'


Polyfill({
    fills: 'fetch, Promise',
    options: 'gated',
    afterFill() {
        main()
    }
})


function main() {



    onResize()

}
