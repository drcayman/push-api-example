

// Capitalize Strings - src.capitalize()
String.prototype.capitalize = function() {
    return this.replace(/\b\w/g, l => l.toUpperCase())
}


// Wait for CSS Background Images for be loaded
export function getLoadedBackground(src, cb) {

    let url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,''),
        img = new Image()

    img.onload = () => cb()

    img.src = url
    if( img.complete ) img.onload()

}
