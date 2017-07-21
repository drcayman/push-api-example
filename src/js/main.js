import loadPosts from './modules/loadPosts'
import './modules/sw'

const postBtn = document.getElementById('add-post')
const list = document.getElementById('list')

function saveToDB(title) {
    firebase.database().ref('posts').push(title)
}

postBtn.addEventListener('click', () => {
    const inputVal = document.getElementById('input-title').value
    const listItem = document.createElement('li')

    listItem.innerHTML = inputVal
    list.append(listItem)

    saveToDB(inputVal)
})

loadPosts()
