    // select the arduino's url
    let url_input = document.getElementById('url_input')
    let save = document.getElementById('save')
    let url = ""

    save.addEventListener('click', function(ev) {
        url = url_input.value
        alert("URL: " + url + " Saved")
    })

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

        // Pass the audio stream to mediaRecorder API
        let mediaRecorder = new MediaRecorder(mediaStreamObj);

        // Start event
        start.addEventListener('click', function (ev) {
            if(counter % 2 == 1){
                mediaRecorder.start();
                playIcon.src = "/static/images/stop.png";
            }
            else{
                mediaRecorder.stop();
                playIcon.src = "/static/images/play.png";
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
            const console = document.getElementById('console')

            // append the created file to form data
            const formData = new FormData();
            formData.append('file', file, 'audio.mp3');
            
            // send the form data to the server for processing
            fetch('https://voicecommand.up.railway.app/upload_files', {
                method: 'POST',
                body:formData,
            })

            // testing fetch
        //    fetch('http://127.0.0.1:5000/upload_files', {
        //        method: 'POST',
        //        body:formData,
        //    })

            // handle response from the server
            .then((res) => {
                if (!res.ok) {
                    console.innerHTML += `<p class="error">error getting response from server</p>`;
                    throw new Error("HTTP error " + res.status);
                    
                }
                return res.json();
            })
            .then((data) => {
                // check if the server returned a valid command
                if(data[1] == "invalid") {
                    // print error message
                    console.innerHTML += `<p class="error">"${data[0]}" is not a valid command`
                }else {
                    // get the transcribed data and fill it in the html tag
                    console.innerHTML += `<p class="command"><b>Command:</b> ${data[0]}</p>`;

                    // send the request to the arduino
                    fetch(`${url}${data[1]}`, {
                    "headers": {
                        "Sec-Fetch-Site": "cross-site",
                        "ngrok-skip-browser-warning": "true"
                    },
                    "method": "GET",
                    "mode": "cors"
                    })
                    // handle response from the arduino
                    .then((response) => {
                        if (!response.ok) {
                            console.innerHTML += `<p class="error">error getting response from arduino</p>`;
                            throw new Error("HTTP error" + response.status)
                        }
                        return response.text();
                    })
                    .then((text) => {
                        console.innerHTML += `<p class="response">${text}</p>`;
                    })
                    .catch((error) => ('Error occured', error))
            }
            })
            .catch((err) => ('Error occured', err));

            // empty the audio chunk array for subsequent uses
            dataArray = [];
        }
    })

    // If any error occurs then handles the error
    .catch(function (err) {
        console.log(err.name, err.message);
    });