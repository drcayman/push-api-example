

export default function() {

    let navHandler = document.getElementById('nav-handler'),
        navMain    = document.getElementById('nav-main')

    navHandler.addEventListener('click', function() {
        this.classList.toggle('is-active')
    })

}
