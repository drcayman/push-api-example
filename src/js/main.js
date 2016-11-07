import Polyfill from 'dynamic-polyfill'

Polyfill({
    fills: 'fetch, promise',
    options: 'gated',
    afterFill() {
        main()
    }
})


function main() {

    

}
