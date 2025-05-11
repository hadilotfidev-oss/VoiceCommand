import os
from flask import Flask, flash, request, redirect, render_template
from dotenv import load_dotenv
import speechRecognition

app = Flask(__name__, template_folder='templates')
app.secret_key = 'super secret key'

load_dotenv()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() == 'mp3'


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/upload_files', methods=['POST'])
def upload_file():
    print("we reached this point1")
    if request.method == 'POST':
        print("we reached this point2")
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        print("we reached this point 3")
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            print("we reached this point 4")
            return redirect(request.url)
        if file and allowed_file(file.filename):
            print("we reached this point 5")
            generated_text = speechRecognition.recognize(file, os.getenv('AAI_KEY'))
            print(generated_text)
            return generated_text


if __name__ == '__main__':
    app.run()
