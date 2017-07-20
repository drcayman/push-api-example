const VERSION = 'v1::'
const BASIC_CACHE = VERSION + 'basic-cache'

let urls = [
    // '/',
    // 'css/main.css',
    // 'js/vendor.js',
    // 'js/main.js',
     'https://fonts.googleapis.com/css?family=Open+Sans:300,700'
]

// Register SW
self.addEventListener('install', event => {
    console.log('SW installed')

    // event.waitUntil(
    //     caches.open(BASIC_CACHE)
    //         .then(cache => cache.addAll(urls))
    //         .then(() => console.log('WORKER BASIC: complete'))
    // )

})


// Phase out old SW after update
self.addEventListener('activate', event => {

    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => !key.startsWith(VERSION))
                       .map(key => caches.delete(key))
            ))
            .then(() => console.log('WORKER: activated'))
    )

})


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
self.addEventListener('push', event => {
    console.log('Push message received', event)

    const title   = 'You are subscribed.'
    const options = {
        body: 'Click to read the latest article',
        icon: './assets/img/push-icon.png',
        tag: 'new-article'
    }

    event.waitUntil(self.registration.showNotification(title, options))
})


// ON NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked')

    event.notification.close()

    event.waitUntil(
        clients.openWindow('https://google.com')
    )
})
