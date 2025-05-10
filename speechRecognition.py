import assemblyai as aai


def recognize(audio_file, api_key):

    aai.settings.api_key = api_key
    audio_file = audio_file
    config = aai.TranscriptionConfig(speech_model=aai.SpeechModel.best)
    transcript = aai.Transcriber(config=config).transcribe(audio_file)

    if transcript.status == "error":
        raise RuntimeError(f"Transcription failed: {transcript.error}")

    return transcript.text
