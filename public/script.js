//const { text } = require("express");

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream=>{
            addVideoStream(video, userVideoStream)
        });
    });

    socket.on('user-connected', (userId)=>{
        connecToNewUser(userId, stream);
    });
});

peer.on('open', id=>{
    socket.emit('join-room', ROOM_ID, id);
});

const connecToNewUser = (userId, stream) =>{
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        console.log('medo');
    });
}

const addVideoStream = (video, stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}

let text = $('input')

$('html').keydown((e)=>{
    if(e.which ==13 && text.val().length !==0){
        socket.emit('message', text.val());
        text.val('');
    }
});

socket.on('createMessage', message=>{
    $('.messages').append(`<li class="message"><b>User</b><br/>${message}</li>`)
})

const scrollToBotton = () =>{
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHight"));
}