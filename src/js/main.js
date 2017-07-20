import firebase from 'firebase/app'
import 'firebase/database'

import './modules/sw'



const postBtn = document.getElementById('add-post')
const list = document.getElementById('list')

function saveToDB() {
    firebase.database().ref('posts').push('Post Title')

    firebase.database().ref('device_ids').once('value')
        .then(snap => console.log(snap.val()))

}

postBtn.addEventListener('click', () => {
    const listItem = document.createElement('li')
    listItem.innerHTML = 'Post Title'
    list.append(listItem)

    saveToDB()
})
