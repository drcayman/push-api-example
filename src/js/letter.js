
import $ from 'jquery'

export default function(a) {
    $('body').prepend(a)
    console.log(a, 'higggg');
}
