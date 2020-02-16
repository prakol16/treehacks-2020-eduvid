from flask_restful import Api
from flask import Flask

from pathlib import Path

app = Flask(__name__, static_url_path="")
api = Api(app)

app.config['UPLOAD_FOLDER'] = 'data/recordings/'
Path(app.config['UPLOAD_FOLDER']).mkdir(parents=True, exist_ok=True)

from app import content
