
import esPolyfill from 'es-dynamic-polyfill'
//import number from './number'
//import letter from './letter'
//import promise from './promise'
//
//

esPolyfill({
    fills: 'fetch, Promise',
    options: 'gated',
    afterFill() {
        main()
    }
})

function main() {

    console.log('hit yea');

    document.getElementById('link').addEventListener('click', function() {

        fetch('/about.html').then(res => res.text())
        .then(res => {
            //document.getElementById('content').innerHTML = res;
            document.getElementById('content').innerHTML = res;

            console.log(res);
            alert(`Features: ${res}!`)

        })
        .catch(err => console.log(err));

    });



}



//number(2)

//promise
//letter('eeeggggggggggff')
