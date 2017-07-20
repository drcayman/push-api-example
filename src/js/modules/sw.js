import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/messaging'


firebase.initializeApp({
    apiKey: "AIzaSyCNWf72UrEdxbzu1YnW4Yd3zfzQIKtXl94",
    authDomain: "push-test-75834.firebaseapp.com",
    databaseURL: "https://push-test-75834.firebaseio.com",
    projectId: "push-test-75834",
    storageBucket: "push-test-75834.appspot.com",
    messagingSenderId: "858712102689"
})

const pushBtn  = document.getElementById('push-button')
const database = firebase.database()
const messaging = firebase.messaging()


const applicationServerPublicKey = 'AAAAx-861yE:APA91bEuwfs9GkkS4xq2zmZX-mafVCyP1F9AVV9OLjd-4IEYASX5NmWqXsTnJoz3ROZ9iTG6VUaHolu6NhlrlThFBm0bpgr2zrJscdc6bwgA4ufQ2AeoxWgRDqAz7fe3EgUVX-HEcLK8'

let isSubscribed   = false,
    swRegistration = null


    messaging.onMessage(payload => {
        console.log('onMessage', payload)
    })


// CONVERT APP KEY TO Uint8Array (Push API needs binary string)
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for( let i = 0; i < rawData.length; ++i ) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

// UPADTE SUBSCRIPTION BUTTON
function updateBtn() {

    if( Notification.permission === 'denied' ) {
        pushBtn.textContent = 'Subscription blocked.'
        return
    }

    pushBtn.textContent = isSubscribed ? 'Unsubscribe' : 'Subscribe'
    pushBtn.disabled = false
}

// UPDATE SUBSCRIPTION ON SERVER
function updateSubscriptionOnServer(subscription) {
    //const uid = subscription.endpoint.split('gcm/send/')[1]
    const uid = subscription // firebase token

    console.log(uid)

    if( isSubscribed ) {
        return database.ref('device_ids')
                .orderByValue()
                .equalTo(uid)
                .on('child_added', snapshot => snapshot.ref.remove())
    }

    return database.ref('device_ids').push(uid)
}

// SUBSCRIBE
function subscribeUser() {
    //const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)

    messaging.requestPermission()
        .then(() => messaging.getToken())
        .then(token => {

            updateSubscriptionOnServer(token)
            isSubscribed = true
            updateBtn()
        })
        .catch(err => console.log('Denied'))

    // swRegistration.pushManager.subscribe({
    //     userVisibleOnly: true,
    //     //applicationServerKey
    // })
    // .then(subscription => {
    //
    //     updateSubscriptionOnServer(subscription)
    //
    //     isSubscribed = true
    //
    //     updateBtn()
    // })
    // .catch(err => {
    //     console.log('Failed to subscribe.', err)
    //     updateBtn()
    // })

}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(subscription => {
            subscription.unsubscribe()
                .then(() => {
                    updateSubscriptionOnServer(subscription)
                    isSubscribed = false
                    updateBtn()
                })
        })
        .catch(err => console.log('Error unsubscribing', err))
}


// INIT PUSH
function initializePush() {

    pushBtn.addEventListener('click', () => {
        pushBtn.disabled = true

        if( isSubscribed )
            return unsubscribeUser()

        return subscribeUser()
    })

    // CHECK IF ALREADY SUBSCRIBED
    swRegistration.pushManager.getSubscription()
        .then(subscription => {
            isSubscribed = subscription !== null

            console.log(isSubscribed)

            if( 'is subscribed: ', isSubscribed ) {
                console.log('User is subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn()
        })
}


// REGISTER SW
window.addEventListener('load', () => {

    if( 'serviceWorker' in navigator ) {

        navigator.serviceWorker.register('/service-worker.js')
            .then(register => {
                console.log('SW Reg successfull.', register.scope)

                swRegistration = register

                // For Firebase Messaging use seperate firebase-messaging-sw.js

                initializePush()


            })
            .catch(err => console.log('Service Worker Error', err))

    } else {
        console.warn('Push messaging is not supported')
        pushBtn.textContent = 'Push not supported.'
    }

})
