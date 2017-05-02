
export default function(scrollDuration, cb) {

let scrollHeight = window.scrollY,
    scrollStep   = Math.PI / ( scrollDuration / 15 ),
    cosParameter = scrollHeight / 2,
    scrollCount  = 0,
    scrollMargin,
    scrollInterval = setInterval(() => {

        if ( window.scrollY !== 0 ) {
            scrollCount = scrollCount + 1
            scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep )
            window.scrollTo( 0, ( scrollHeight - scrollMargin ) )
        }
        else {
            clearInterval(scrollInterval)
            cb()
        }

    }, 15 )

}
