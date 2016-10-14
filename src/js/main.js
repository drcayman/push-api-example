
import esPolyfill from 'es-dynamic-polyfill'
import letter from './letter'

console.log([1,2,3,4].includes(3))

esPolyfill({
    fills: 'fetch, Promise',
    options: 'gated',
    afterFill() {
        main()
    }
})

function main() {

    console.log('hit yeaa!');

    // document.getElementById('link').addEventListener('click', function() {
    //
    //     fetch('/about.html').then(res => res.text())
    //     .then(res => {
    //         //document.getElementById('content').innerHTML = res;
    //         document.getElementById('content').innerHTML = res;
    //
    //         console.log(res);
    //         alert(`Features: ${res}!`)
    //
    //     })
    //     .catch(err => console.log(err));
    //
    // });



}



//number(2)

//promise
letter('abc')
