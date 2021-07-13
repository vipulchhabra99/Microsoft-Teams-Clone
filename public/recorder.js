const record=document.getElementById("btnRecord");
//choice variable denotes record the webcam or the display screen
choice=1;
record.addEventListener("click",()=>{
    if(record.classList.contains('startRecord')){
         startRecording()
         record.getElementsByTagName('i')[0].style.color="red"
         record.getElementsByTagName('span')[0].innerText="Stop Recording"
         record.classList.remove('startRecord')
         record.classList.add('stopRecord')
    }
    else if(record.classList.contains('stopRecord')){
        stopRecording()
         record.getElementsByTagName('i')[0].style.color="black"
         record.getElementsByTagName('span')[0].innerText="Record"
         record.classList.add('startRecord')
         record.classList.remove('stopRecord')

         document.getElementById("download").style.display = "flex"

        const downloadButton = document.querySelector('#download');
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
    var date=new Date();
    filename=""+date.getDate()+"_"+date.getMonth()+"_"+date.getFullYear()+"_"+date.getTime()+"";
  a.download =filename +'.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});


    }
})

document.querySelector(".stopRecord")


function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = {mimeType: 'video/webm;codecs=vp8,opus'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: ''};
      }
    }
  }

  try {
  
       
      
       if(choice==0)
                //choice is 0 that means recording only the webcam . The webcam video stream is being captured and then the bits of data are sent to the mediaRecorder 
                {  let webCam=document.getElementById(peer_id).captureStream()
                       
                 }
       else{
            //this part executes when display needs to be recorded. When screen sharing , the audio is not captured but only captures for the webcam. So below we take both streams of the webcam and the screen share but we alter the final stream which we send to the Media Recorder by taking the audio track from the webcam stream and placing it in the Screen share stream. This allows the final video to have screenshare as well as the audio.
            let screenData =document.getElementById('streamView').captureStream() 
            let webCam=document.getElementById(peer_id).captureStream()
             let webcamAudio=webCam.getAudioTracks()[0]
              screenData.addTrack(webcamAudio)

               mediaRecorder = new MediaRecorder(screenData, options);
       }




  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}