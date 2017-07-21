const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

// runs when new device token is added
exports.sendPostNotification = functions.database.ref('/posts/{postID}').onWrite(event => {
    const postID = event.params.postID
    const postTitle = event.data.val()

    // if data deleted => exit
    if( !event.data.val() ) {
        return console.log('Post', postID, 'deleted')
    }

    // Get Device tokens
    const getDeviceTokensPromise = admin.database().ref('device_ids').once('value').then(snapshots => {

        //Check if tokens exist
        if( !snapshots ) {
            return console.log('No device IDs to send notifications to.')
        }

        snapshots.forEach(childSnapshot => {
            const snapKey = childSnapshot.key
            const token = childSnapshot.val()

            // Notification details
            const payload = {
                notification: {
                    title: `New Article: ${postTitle}`,
                    body: 'Click to read article.',
                    icon: 'https://push.artofmyself.com/assets/img/push-icon.png'
                }
            }

            // Send notification to all tokens
            admin.messaging().sendToDevice(token, payload).then(response => {

                response.results.forEach(result => {
                    const error = result.error

                    if( error ) {
                        console.error('Failed delivery to', token, error)

                        // Prepare unused tokens for removal
                        if( error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered' ) {
                            childSnapshot.ref.remove()
                            console.info('Was removed:', token)
                        }
                    } else {
                        console.info('Notification sent to', token)
                    }

                })

            })

        })

    })

})
