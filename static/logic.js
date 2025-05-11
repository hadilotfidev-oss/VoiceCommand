    // counter for start/stop button toggle
    let counter = 1;

    // audio is true, for recording
    let audioIN = { audio: true };
    

    // Access the permission for use
    // the microphone
    navigator.mediaDevices.getUserMedia(audioIN)

    // 'then()' method returns a Promise
    .then(function (mediaStreamObj) {


        // Start recording
        let start = document.getElementById('btnStart');
        let playIcon = start.querySelector('img');

        // audio tag for play the audio
        let playAudio = document.getElementById('audioPlay');

        // Pass the audio stream to mediaRecorder API
        let mediaRecorder = new MediaRecorder(mediaStreamObj);

        // Start event
        start.addEventListener('click', function (ev) {
            if(counter % 2 == 1){
                mediaRecorder.start();
                playIcon.src = "/static/images/stop.jpeg";
            }
            else{
                mediaRecorder.stop();
                playIcon.src = "/static/images/play.jpeg";
            }
            counter++;
        })

        // If audio data available then push
        // it to the chunk array
        mediaRecorder.ondataavailable = function (ev) {
            dataArray.push(ev.data);
        }

        // Chunk array to store the audio data
        let dataArray = [];

        // Convert the audio data in to blob
        // after stopping the recording
        mediaRecorder.onstop = function (ev) {

            // blob of type mp3
            let audioData = new Blob(dataArray,
                        { 'type': 'audio/mp3;' });
            
            // convert blob to mp3 file
            let file = new File([audioData], "audio.mp3", {type: 'audio/mp3',});

            // get the html tag that holds the transcribed text
            const generatedText = document.getElementById('generated-text')

            // append the created file to form data
            const formData = new FormData();
            formData.append('file', file, 'audio.mp3');
            
            // send the form data to the server for processing
            fetch('https://project1-production-8213.up.railway.app/upload_files', {
                method: 'POST',
                body:formData,
            })
            // handle response from the server
            .then((res) => {
                if (!res.ok) {
                    throw new Error("HTTP error " + res.status)
                }
                return res.text();
            })

            // get the transcribed data and fill it in the html tag
            .then((data) => {
                generatedText.innerHTML = `Command: "${data}"`
            })
            .catch((err) => ('Error occured', err))

            // empty the audio chunk array for subsequent uses
            dataArray = [];

            // create url for the audio blob so it can be played by the audio tag
            let audioSrc = window.URL
                .createObjectURL(audioData);

            // Pass the audio url to the audio tag
            playAudio.src = audioSrc;
        }
    })

    // If any error occurs then handles the error
    .catch(function (err) {
        console.log(err.name, err.message);
    });