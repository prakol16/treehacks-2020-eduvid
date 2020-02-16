from flask_restful import Resource, reqparse
from flask import request, send_from_directory
from pathlib import Path
import sqlite3
import json

from app import app, api

storage = Path('data')
location = storage / 'recordings'
location.mkdir(parents=True, exist_ok=True)


class EduVidContent(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('filename', type=str, required=True,
                                   help='Filename for file you have uploaded',
                                   location='json')
        self.reqparse.add_argument('events', type=str, required=True,
                                   help='Desmos series of actions',
                                   location='json')

        super(EduVidContent, self).__init__()

    def get(self, name):
        path = (location / name).with_suffix('.json')
        if not path.exists():
            return 'content not found', 404

        with path.open() as file:
            metadata = file.read()

        return metadata, 200

    def post(self, name):
        args = self.reqparse.parse_args()

        if (location / name).with_suffix('.json').exists():
            print('overwriting', name)

        metadata = {**args}
        metadata['name'] = name

        fpath = Path(location / metadata['filename']).with_suffix('.webm')

        if not fpath.exists():
            return f"{metadata['filename']} is nonexistant!", 404

        metadata['vidpath'] = str(Path(location / metadata['filename']))
        metadata['viduri'] = f"video/{metadata['filename']}"

        content_location = (location / name).with_suffix('.json')

        with content_location.open(mode='w') as file:
            json.dump(metadata, file)

        return f'GET URI: /content/{name}', 201


class EduVideo(Resource):
    def __init__(self):
        pass

    def get(self, name):
        path = (location / name).with_suffix('.webm')
        if not path.exists():
            return 'nonexistant file', 201

        return send_from_directory(app.config['UPLOAD_FOLDER'], path.name, as_attachment=True), 200

    def post(self, name):
        if 'data' not in request.files:
            return 'data file not found', 404
        f = request.files['data']

        if f.filename == '':
            return 'no file name', 400

        f.save(location / f'{name}.webm')

        return f"success! {name}.webm", 201


class EduVidList(Resource):
    def __init__(self):
        pass

    def get(self):
        recordings = (item.stem for item in location.glob('*.json'))
        return list(recordings), 200


api.add_resource(EduVidContent, '/content/<string:name>', endpoint='content')
api.add_resource(EduVideo, '/video/<string:name>')
api.add_resource(EduVidList, '/list')
