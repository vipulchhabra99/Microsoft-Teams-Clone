const socket = io('/')
let counter = false;
const peer_id = localStorage.getItem("user_id")
const myPeer = new Peer(peer_id, {
    path: '/peerjs',
    host: '/',
    port: '443'
  })

myPeer.on('open', id => {
    socket.emit('joinRoom', ROOM_ID, id)
})

const inpt = document.querySelector("#myMessage");
const button = document.querySelector("#send");
button.addEventListener('click', () => {
    if (inpt.value != "") {
        
        let message = inpt.value;
        message = {
                'id': localStorage.getItem("user_id"),
                "message": message
        }

        socket.emit('sendMessage', message)
        SubmitChat(inpt.value, localStorage.getItem("user_id"));
        inpt.value = "";
    }
});

const SubmitChat = (message, user_id) => {
    const data = JSON.stringify({
        roomId: ROOM_ID,
        email: 'test@in.com',
        name: user_id,
        message : message
    });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    };
    xhttp.open("POST", "/storeChat", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);
}

const scrollToBottom = () => {
    var d = $('#messages');
    d.scrollTop(d.prop("scrollHeight"));
}
    
socket.on('recieve', (a) => {

    let divi = document.querySelector("#messages")
    if (a.id == localStorage.getItem("user_id")) {
        divi.innerHTML += `<div style='text-align:right;font-weight:600'><b style='font-weight:100'>${a.id}</b>: ${a.message}</div>`
    } else {
        divi.innerHTML += `<div  style='font-weight:600'><b  style='font-weight:100'>${a.id}</b>: ${a.message}</div>`
    }
    scrollToBottom();
});


document.getElementById('myMessage').addEventListener("keyup", function(event) {
    // For tracking enter key press
    if (event.keyCode === 13) {
        // Cancel the default action
        event.preventDefault();
        // Trigger the send button
        document.getElementById("send").click();
    }
});
