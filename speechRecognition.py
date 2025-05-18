import assemblyai as aai


def recognize(audio_file, api_key):
    # set client key from parameter
    aai.settings.api_key = api_key
    # set audio file from parameter
    audio_file = audio_file
    # choose the speech model
    config = aai.TranscriptionConfig(speech_model=aai.SpeechModel.best)
    # transcribe the audio file to text
    transcript = aai.Transcriber(config=config).transcribe(audio_file)
    # raise error if transcription failed
    if transcript.status == "error":
        raise RuntimeError(f"Transcription failed: {transcript.error}")
    # check if the text maps to a command
    if transcript.text.find("light") != -1 :
        if transcript.text.find("on") != -1:
            path = "ON"
        elif transcript.text.find("off") != -1:
            path = "OFF"
        else:
            path = "invalid"
    else:
        path = "invalid"
        
    return [transcript.text, path]
