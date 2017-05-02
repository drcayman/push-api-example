
export default function() {

    let handler = document.getElementById('nav-handler'),
        navMain = document.getElementById('nav-main'),
        overlay = document.querySelector('.nav-overlay')

    handler.addEventListener('click', () => toggleNavElements())

    overlay.addEventListener('click', () => toggleNavElements())


    function toggleNavElements() {
        handler.classList.toggle('is-active')
        navMain.classList.toggle('is-visible')
        overlay.classList.toggle('is-visible')
    }


}
