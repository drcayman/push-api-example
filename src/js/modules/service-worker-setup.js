
(function() {

    window.addEventListener('load', () => {

        if( 'serviceWorker' in navigator ) {

            navigator.serviceWorker.register('/serviceWorker.js')
                .then(registration => {
                    console.log('SW Reg successfull.', registration.scope);

                    if( navigator.serviceWorker.controller ) {

                        // The updatefound event implies that registration.installing is set
                        const installingWorker = registration.installing

                        installingWorker.onstatechange = () => {

                            switch (installingWorker.state) {
                                case 'installed':
                                    // Add "New content is available; please refresh." message.
                                    break;

                                case 'redundant':
                                    throw new Error('The installing service worker became redundant.');

                                default:
                                // Ignore
                            }
                        }
                    }


                }, err => {
                    console.log('SW failed.', err);
                })

        }

    })

})()
