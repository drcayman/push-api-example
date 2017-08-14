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

//const messaging = firebase.messaging()
