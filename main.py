import os
from flask import Flask, flash, request, redirect, render_template, jsonify
from dotenv import load_dotenv
import speechRecognition

app = Flask(__name__, template_folder='templates')
app.secret_key = os.getenv('APP_KEY')

load_dotenv()


# check if uploaded file is of type mp3
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() == 'mp3'


# root route
@app.route('/')
def home():
    return render_template('index.html')


# file upload route
@app.route('/upload_files', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request contains a file
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If there's no file raise an error
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        # If there's a file and is of type mp3 then transcribe to text
        if file and allowed_file(file.filename):
            generated_text = speechRecognition.recognize(file, os.getenv('AAI_KEY'))
            return jsonify(generated_text)


if __name__ == '__main__':
    app.run()
