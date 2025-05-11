
    let counter = 1;
    let audioIN = { audio: true };
    // audio is true, for recording

    // Access the permission for use
    // the microphone
    navigator.mediaDevices.getUserMedia(audioIN)

    // 'then()' method returns a Promise
    .then(function (mediaStreamObj) {


        // Start record
        let start = document.getElementById('btnStart');
        let playIcon = start.querySelector('img');

        // 2nd audio tag for play the audio
        let playAudio = document.getElementById('audioPlay');

        // This is the main thing to recorded
        // the audio 'MediaRecorder' API
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        // Pass the audio stream

        // Start event
        start.addEventListener('click', function (ev) {
            if(counter % 2 == 1){
                mediaRecorder.start();
                playIcon.src = "/static/images/stop.jpeg";
                start.querySelector('span').textContent = "stop";
            }
            else{
                mediaRecorder.stop();
                playIcon.src = "/static/images/play.jpeg";
                start.querySelector('span').textContent = "start";
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

            let file = new File([audioData], "audio.mp3", {type: 'audio/mp3',});
            const generatedText = document.getElementById('generated-text')
            const formData = new FormData();
            formData.append('file', file, 'audio.mp3');

            fetch('http://127.0.0.1:5000/upload_files', {
                method: 'POST',
                body:formData,
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("HTTP error " + res.status)
                }
                return res.text();
            })
            .then((data) => {
                generatedText.innerHTML = `Command: "${data}"`
            })
            .catch((err) => ('Error occured', err))

            // After fill up the chunk
            // array make it empty
            dataArray = [];

            // Creating audio url with reference
            // of created blob named 'audioData'
            let audioSrc = window.URL
                .createObjectURL(audioData);

            // Pass the audio url to the 2nd video tag
            playAudio.src = audioSrc;
        }
    })

    // If any error occurs then handles the error
    .catch(function (err) {
        console.log(err.name, err.message);
    });