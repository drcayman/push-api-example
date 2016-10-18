import Vue from 'vue'
import VueRouter from 'vue-router'
import esPolyfill from 'es-dynamic-polyfill'
//import App from './App.vue'
import Home from './Home.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Home }
]

let router = new VueRouter({
    routes
})


const app = new Vue({
    el: '#content',
    router
})



esPolyfill({
    fills: 'fetch, Promise',
    options: 'gated',
    afterFill() {
        main()
    }
})



function main() {

    console.log('hit ye!!');

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
