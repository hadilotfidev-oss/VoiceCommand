import assemblyai as aai


def recognize(audio_file):

    aai.settings.api_key = "3122572906cb458885fa3c123f294554"
    audio_file = audio_file
    config = aai.TranscriptionConfig(speech_model=aai.SpeechModel.best)
    transcript = aai.Transcriber(config=config).transcribe(audio_file)

    if transcript.status == "error":
        raise RuntimeError(f"Transcription failed: {transcript.error}")

    return transcript.text
