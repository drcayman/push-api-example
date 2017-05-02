/*
* @PascalAOMS
* Create parallax effect with requestAnimationFrame.
*/

export default function({
    el,
    attr = 'background-position-y',
    speed = 5,
    unit = 'px'
}) {

    let element = document.querySelector(el)

    if ( element ) {

        // Height Calctulations
        let elHeight = element.clientHeight,
            elOffset = element.offsetTop,
            elScrollDistance = elHeight + elOffset

        window.addEventListener('scroll', setParallax)
    }


    function setParallax() {

        let wScroll = window.pageYOffset

         function animate() {
             element.style[attr] = Math.ceil(wScroll / speed) + unit
         }

         if (wScroll <= elScrollDistance) {

            window.requestAnimationFrame(animate)

         }

    }



}
