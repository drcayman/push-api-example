

// Capitalize Strings - src.capitalize()
String.prototype.capitalize = function() {
    return this.replace(/\b\w/g, l => l.toUpperCase())
}


// Delay function call
export function throttle(cb, delay) {
    let timer

    return () => {
        clearTimeout(timer)
        timer = setTimeout(() => cb(), delay)
    }
}
