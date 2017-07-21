importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-database.js')
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js')


const VERSION = 'v2::'
const BASIC_CACHE = VERSION + 'basic-cache'

let urls = [
    '/',
     'css/main.css',
     'js/vendor.js',
     'js/main.js',
     'https://fonts.googleapis.com/css?family=Open+Sans:300,700'
]

// Register SW
self.addEventListener('install', event => {
    console.log('SW installed')

    event.waitUntil(
        caches.open(BASIC_CACHE)
            .then(cache => cache.addAll(urls))
            .then(() => console.log('WORKER BASIC: complete'))
    )

})


// Phase out old SW after update
// self.addEventListener('activate', event => {
//
//     event.waitUntil(
//         caches.keys()
//             .then(keys => Promise.all(
//                 keys.filter(key => !key.startsWith(VERSION))
//                        .map(key => caches.delete(key))
//             ))
//             .then(() => console.log('WORKER: activated'))
//     )
//
// })


// Save files in cache
// self.addEventListener('fetch', event => {
//
//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//
//                 if( response )
//                     return response
//
//                 // clone stream one for cache + one for browser
//                 let fetchRequest = event.request.clone()
//
//                 return fetch(fetchRequest)
//                     .then(response => {
//
//                         if( !response || response.status !== 200 )
//                             return response
//
//                         // clone stream one for cache + one for browser
//                         let responseToCache = response.clone()
//
//                         caches.open(BASIC_CACHE)
//                             .then(cache => {
//                                 cache.put(event.request, responseToCache)
//                             })
//
//                         return response
//
//                     })
//             })
//     )
// })


// SENT PUSH NOTIFICATION
// self.addEventListener('push', event => {
//
//     const title   = 'You are subscribed.'
//     const options = {
//         body: 'Click to read the latest article',
//         icon: 'https://push.artofmyself.com/assets/img/push-icon.png',
//         tag: 'new-article'
//     }
//
//     event.waitUntil(self.registration.showNotification(title, options))
// })


// ON NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
    console.log(event)

    event.notification.close()

    event.waitUntil(
        self.clients.openWindow('https://push.artofmyself.com')
    )
})





firebase.initializeApp({
    apiKey: "AIzaSyCNWf72UrEdxbzu1YnW4Yd3zfzQIKtXl94",
    authDomain: "push-test-75834.firebaseapp.com",
    databaseURL: "https://push-test-75834.firebaseio.com",
    projectId: "push-test-75834",
    storageBucket: "push-test-75834.appspot.com",
    messagingSenderId: "858712102689"
})

const messaging = firebase.messaging()

// // SHOW NOTIFICATION WHEN WEBSITE IS IN BACKGROUND
// firebase.messaging().setBackgroundMessageHandler(payload => {
//     const title = "Hello World"
//     const options = {
//         body: 'Custom Body'
//         // body: payload.data.status
//     }
//     return self.registration.showNotification(title, options)
// })
