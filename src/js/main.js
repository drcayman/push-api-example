// import firebase from 'firebase/app'
// import 'firebase/database'
import loadPosts from './modules/loadPosts'

// importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js')
// importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-database.js')
// importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js')

import './modules/sw'

const postBtn = document.getElementById('add-post')
const list = document.getElementById('list')

function saveToDB(title) {
    firebase.database().ref('posts').push(title)

    // firebase.database().ref('posts').onDisconnect().update({
    //     status: 'Offline'
    // })
}

postBtn.addEventListener('click', () => {
    const inputVal = document.getElementById('input-title').value
    const listItem = document.createElement('li')

    listItem.innerHTML = inputVal
    list.append(listItem)

    saveToDB(inputVal)
})


// Load Posts from DB
loadPosts()
