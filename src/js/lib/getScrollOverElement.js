/*
* @PascalAOMS
* Run callback when element is scrolled into view.
*/

export default function({ el, boundry = 'top', offset = 0, cb }) {

    let element = document.querySelector(el)

    if( element ) {

        let scrollTop     = window.pageYOffset,
            elBoundry     = element.getBoundingClientRect()[boundry],
            windowHeight  = window.innerHeight,
            elDistanceTop = Math.round(elBoundry - windowHeight),
            elWithOffset  = elDistanceTop + offset

        getScrollOverElement()

        window.addEventListener('scroll', getScrollOverElement)

        getScrollOverElement(element)

    }

    function getScrollOverElement(element) {

        if( window.pageYOffset >= elWithOffset ) {

            cb(element)

            window.removeEventListener('scroll', getScrollOverElement)

        }

    }



}
