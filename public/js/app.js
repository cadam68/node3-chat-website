// console.log('Client side javascript is loaded');

// -- define global var --
// -- elements --
let $messages;
let $messageForm;
let $messageFormInput;
let $messageFormButton;
let $sendLocationButton;
let $sidebar;
// -- templates --
let messageTemplate;
let locationMessageTemplate;
let sidebarTemplate;

const init = () => {
    $messageForm = document.querySelector('#message-form');
    $messageFormInput = $messageForm.querySelector('input');
    $messageFormButton = $messageForm.querySelector('button');
    $sendLocationButton = document.querySelector('#send-location');
    $messages = document.querySelector('#messages');
    messageTemplate = document.querySelector('#message-template').innerHTML;
    locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
    sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
    $sidebar= document.querySelector('#sidebar');

    $messageForm.addEventListener('submit', (e) => {
        e.preventDefault();                                                 // prevent default full page refresh

        const message=e.target.elements.message.value;                      // get the element "message" from the form
        if(message) {
            $messageFormButton.setAttribute('disabled', 'disabled')         // disable the form
            emitMessage(message, (error) => {
                $messageFormButton.removeAttribute('disabled');
                if(error) alert(error)
                else $messageFormInput.value='';
                $messageFormInput.focus();
            }); 
        }    
    })

    $sendLocationButton.addEventListener('click', () => {
        if (!navigator.geolocation) { return alert('Geolocation is not supported by your browser.'); }

        $sendLocationButton.setAttribute('disabled', 'disabled');
        navigator.geolocation.getCurrentPosition((position) => {
            emitLocation(position.coords, () => {
                $sendLocationButton.removeAttribute('disabled');
            });
        })
    })

    // sign-on 
    emitJoin(Qs.parse(location.search,  { ignoreQueryPrefix : true} ));
}

const renderMessage = (message) => {
    // $messages.textContent=message;
    // -- sol 1 --
    // $messages.insertAdjacentHTML('beforeend', `<div><p>${message}</p></div>`); 
    // -- sol 2 --
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);                    // afterbegin, afterend, beforedebin, beforeend
    autoscroll();
}

const renderLocation = (location) => {
    // $messages.innerHTML = `<a href="${url}">User Location</a>`;
    // -- sol 1 --
    // $messages.insertAdjacentHTML('beforeend', `<div><p><a href="${url}" target="_blank">My current location</a></p></div>`);
    // -- sol 2 --
    const html = Mustache.render(locationMessageTemplate, { 
        username:location.username, 
        url:location.url, 
        createdAt:moment(location.createdAt).format('h:mm a') 
    });
    $messages.insertAdjacentHTML('beforeend', html); 
    autoscroll();
}

const renderRoomData = ({ room, users }) => {
    // console.log(room, users);
    const html = Mustache.render(sidebarTemplate, { room, users });
    $sidebar.innerHTML=html; 
}

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);                 // get the style of the message element
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight+newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;                           // height of the visible container

    // Height of messages containes
    const containerHeight = $messages.scrollHeight;                         // total height of the container

    // How far have I scrolled ?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    // where we at the bottom before the message was render ?
    if(containerHeight - newMessageHeight <= scrollOffset ) {               
        $messages.scrollTop = $messages.scrollHeight;
    }
}