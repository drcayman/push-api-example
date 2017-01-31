import Polyfill from 'dynamic-polyfill'

Polyfill({
    fills: 'fetch, Promise',
    options: 'gated',
    afterFill() {
        main()
    }
})


function main() {



}
