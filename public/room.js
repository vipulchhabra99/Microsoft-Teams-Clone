const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peer_id = localStorage.getItem("user_id")
const myPeer = new Peer(peer_id, {
    path: '/peerjs',
    host: '/',
    port: '443'
  });

const myCam = document.getElementById('myCam')
let counter = false; // For tracking screen

// Initial Setting upon loading
const streamView = document.getElementById("streamView")
streamView.style.display = "none"
streamView.muted = true;

const myVideo = document.createElement('video')
myVideo.muted = true
myVideo.id = peer_id
const peers = {}
let tracks = []
let roomMembers = []
var screen = false;

let toastVar = document.getElementById('toastDiv')


var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    document.getElementById('btnScreen').style.display = "none"
}


const scrollToBottom = () => {
    var d = $('#messages');
    d.scrollTop(d.prop("scrollHeight"));
}

const addMessageToChat = (a, message_box) => {
    if (a.id == localStorage.getItem("user_id")) {
        message_box.innerHTML += `<div style='text-align:right;font-weight:600'><b style='font-weight:100'>${a.id}</b>: ${a.message}</div>`
    } else {
        message_box.innerHTML += `<div  style='font-weight:600'><b  style='font-weight:100'>${a.id}</b>: ${a.message}</div>`
    }
}

// POST chat to backend for backup
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

//Webcam access
navigator.mediaDevices.getUserMedia({
    video: true,
    echoCancellation: true,
    noiseSuppression: true,
    audio: {
        echoCancellation: true,
        noiseSuppression: true
    }
}).then(stream => {
    selfVideo(myVideo, stream)

    const screenShareButton = document.querySelector("#btnScreen")
    screenShareButton.addEventListener('click', () => {
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            alert("Screensharing disabled for phones")
        } else {
            if (!counter) {
                screenSharing()

            } else
                alert("Screen is already shared");
        }
    })

    const inpt = document.querySelector("#myMessage")
    const sendMessageButton = document.querySelector("#send")
    sendMessageButton.addEventListener('click', () => {
        if (inpt.value != "") {
            let message = inpt.value;
            message = {
                'id': localStorage.getItem("user_id"),
                "message": message
            }
            socket.emit('sendMessage', message);
            SubmitChat(inpt.value, localStorage.getItem("user_id"));
            inpt.value = "";
        }
    })
    socket.on('recieve', (a) => {
        let message_box = document.querySelector("#messages")
        addMessageToChat(a, message_box);
        scrollToBottom();
    })

    myPeer.on('call', call => {
        peers[call.peer] = call
        call.answer(stream)
        const video = document.createElement('video')
        video.id = call.peer
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })
    })

    socket.on('userConnected', userId => {

        if (userId != localStorage.getItem("user_id")) {
            roomMembers.push(userId)
            connectToNewUser(userId, stream)
        }
    })

});

// On Getting Disconnected message
socket.on('userDisconnected', userId => {

    if(peers[userId])
        peers[userId].close()
    toastVar.getElementsByTagName('label')[0].innerText = userId + " has left the room"
    toastVar.classList.add('showToast')

    setTimeout(function() {
        toastVar.classList.remove('showToast')
    }, 2000)
})

myPeer.on('open', id => {
    socket.emit('joinRoom', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    video.controls = true;
    video.setAttribute('disablepictureinpicture', '')
    video.setAttribute("controls", "true")
    video.id = userId;

    toastVar.getElementsByTagName('label')[0].innerText = userId + " has joined the room"
    toastVar.classList.add('showToast')

    setTimeout(function() {
        toastVar.classList.remove('showToast')
    }, 2000)

    call.on('stream', userVideoStream => {

        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.controls = true;

    video.setAttribute("controls", "true")
    video.setAttribute('disablepictureinpicture', '')
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    video.style.border = "4px solid " + getRandomColor() + ""
    videoGrid.append(video)
}

function selfVideo(video, stream) {
    video.style.width = "100%"
    video.srcObject = stream
    video.setAttribute('disablepictureinpicture', '')
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    myCam.append(video)

    document.getElementById("nameLabel").innerText = localStorage.getItem("user_id")

}

async function screenSharing() {
    await navigator.mediaDevices.getDisplayMedia({
        video: true,
        echoCancellation: true,
        noiseSuppression: true,
        audio: {
            echoCancellation: true,
            noiseSuppression: true
        }
    }).then(stream => {

        counter = true;
        document.getElementById("btnRecord").style.display = "flex"

        document.getElementById('btnScreen').getElementsByTagName('i')[0].style.color = "red"
        document.getElementById('btnScreen').getElementsByTagName('span')[0].innerText = "Sharing Screen"

        streamView.srcObject = stream;
        streamView.play()
        streamView.style.display = "block";

        for (let key of myPeer._connections.keys()) {
            myPeer._connections.get(key)[0].peerConnection.getSenders()[1].replaceTrack(stream.getTracks()[0])
        }

        stream.getTracks()[0].onended = () => {
            let myFace = document.getElementById(peer_id).captureStream()
            for (let key of myPeer._connections.keys()) {
                myPeer._connections.get(key)[0].peerConnection.getSenders()[1].replaceTrack(myFace.getVideoTracks()[0])

            }

            document.getElementById("btnRecord").style.display = "none"

            streamView.style.display = "none";
            streamView.pause()
            counter = false;
            document.getElementById('btnScreen').getElementsByTagName('i')[0].style.color = "black"
            document.getElementById('btnScreen').getElementsByTagName('span')[0].innerText = "Share Screen"
        }
    })

}

const muteUnmute = () => {
    const enabled = myVideo.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideo.srcObject.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideo.srcObject.getAudioTracks()[0].enabled = true;
    }
}
const playStop = () => {
    let enabled = myVideo.srcObject.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideo.style.backgroundColor = "grey";
        myVideo.srcObject.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()

        myVideo.srcObject.getVideoTracks()[0].enabled = true;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.getElementById('myMessage').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("send").click();
    }
});


setTimeout(() => {
    document.querySelector('body').style.overflow = "auto"
}, 3000)
