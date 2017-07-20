const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// runs when new device token is added
exports.sendPostNotification = functions.database.ref('/posts/{postID}').onWrite(event => {
    const postID = event.params.postID

    // if data deleted => exit
    if( !event.data.val() ) {
        return console.log('Post', postID, 'deleted')
    }

    // Get Device tokens
    const getDeviceTokensPromise = admin.database().ref('device_ids').once('value').then(snapshots => {

        // console.log('array snap', Object.keys(snaps));
        //
        // const snapshots = snapshots.val()
        // const tokens = Object.keys(snapshots)
        // const snapList = Object.keys(snaps)
        //
        // console.log('snap', snapshots);


        //Check if tokens exist
        if( !snapshots ) {
            return console.log('No notification to send.')
        }

        snapshots.forEach(childSnapshot => {
        //for( let key in snapshots ) {

            const snapKey = childSnapshot.key
            const token = childSnapshot.val()

            console.log('key', snapKey);
            console.log('token', token);
        //    console.log('ref', childSnapshot.ref.parent(token));

            //const token = Object.values(childSnapshot.val())[1]
            //console.log('Token', token)


            // Notification details
            const payload = {
                notification: {
                    title: 'Hello World',
                    body: `Your token: ${token}`
                }
            }


            // Send notification to all tokens
            admin.messaging().sendToDevice(token, payload).then(response => {

                response.results.forEach(result => {
                    const error = result.error

                    if( error ) {
                        console.error(`Failed delivery to "${token}"`, error)

                        // Prepare unused tokens for removal
                        if( error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered' ) {
                            childSnapshot.ref.remove()
                            console.info(`Was removed: ${token}`)
                        }
                    }

                })

            })

        })

        //return Promise.all(tokensToRemove)

        return




    })

})
