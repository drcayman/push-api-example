webpackJsonp([0],[function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function o(e){firebase.database().ref("posts").push(e)}var i=n(2),a=function(e){return e&&e.__esModule?e:{default:e}}(i);n(3);var r=document.getElementById("add-post"),u=document.getElementById("list");r.addEventListener("click",function(){var e=document.getElementById("input-title"),t=document.querySelector(".mdl-textfield"),n=document.createElement("li");n.innerHTML=e.value,u.append(n),o(e.value),e.value="",t.classList.remove("is-dirty")}),(0,a.default)()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=firebase.database();e.ref(".info/connected").on("value",function(e){e.val()}),function(){e.ref("posts").once("value").then(function(e){e.forEach(function(e){var t=e.val(),n=document.createElement("li");n.innerHTML=t,list.append(n)})})}()}},function(e,t,n){"use strict";function o(){if("denied"===Notification.permission)return void(d.textContent="Subscription blocked");d.textContent=v?"Unsubscribe":"Subscribe",d.disabled=!1}function i(e){if(v)return f.ref("device_ids").orderByValue().equalTo(e).on("child_added",function(e){return e.ref.remove()});f.ref("device_ids").once("value").then(function(t){var n=!1;if(t.forEach(function(t){if(t.val()===e)return void(n=!0)}),!n)return f.ref("device_ids").push(e)})}function a(){l.requestPermission().then(function(){return l.getToken()}).then(function(e){i(e),v=!0,p=e,localStorage.setItem("pushToken",e),o()}).catch(function(e){})}function r(){l.deleteToken(p).then(function(e){i(p),v=!1,p=null,localStorage.removeItem("pushToken"),o()}).catch(function(e){})}function u(){var e=localStorage.getItem("pushToken");p=e,v=null!==e,o(),d.addEventListener("click",function(){return d.disabled=!0,v?r():a()})}var c=n(4),s=function(e){return e&&e.__esModule?e:{default:e}}(c);firebase.initializeApp({apiKey:"AIzaSyCNWf72UrEdxbzu1YnW4Yd3zfzQIKtXl94",authDomain:"push-test-75834.firebaseapp.com",databaseURL:"https://push-test-75834.firebaseio.com",projectId:"push-test-75834",storageBucket:"push-test-75834.appspot.com",messagingSenderId:"858712102689"});var d=document.getElementById("push-button"),f=firebase.database(),l=firebase.messaging(),p=null,v=!1;l.onMessage(function(e){(0,s.default)(e)}),window.addEventListener("load",function(){"serviceWorker"in navigator?navigator.serviceWorker.register("/service-worker.js").then(function(e){l.useServiceWorker(e),u()}).catch(function(e){}):d.textContent="Push not supported."})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=document.querySelector("#demo-snackbar-example"),n={message:e.notification.title,timeout:5e3,actionHandler:function(e){location.reload()},actionText:"Reload"};t.MaterialSnackbar.showSnackbar(n)},n(5)}],[0]);