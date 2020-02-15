#!flask/bin/python

from flask_restful import Api, Resource, reqparse
from flask import Flask, request
from pathlib import Path
import json

app = Flask(__name__, static_url_path="")
api = Api(app)

app.config['UPLOAD_FOLDER'] = 'data'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


class EduVidDesmos(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('name', type=str, required=True,
                                   help='Name this content',
                                   location='json')
        self.reqparse.add_argument('desmos', type=str, required=True,
                                   help='Need content pls',
                                   location='json')

        self.storage = Path('data')
        super(EduVidDesmos, self).__init__()

    def get(self):
        recordings = (item.stem for item in (self.storage / 'recordings').glob('*.json'))
        return list(recordings), 200

    def post(self):
        args = self.reqparse.parse_args()

        location = self.storage / 'recordings'
        location.mkdir(parents=True, exist_ok=True)
        desmos_location = (location / args['name']).with_suffix('.json')

        with desmos_location.open(mode='w') as file:
            json.dump(args['content'], file)

        return f"data/recordings/{args['name']}.json saved", 200


class EduVidUploader(Resource):
    def __init__(self):
        pass

    def post(self):
        if 'file' not in request.files:
            return 'file not found', 201

        f = request.files['file']

        if f.filename == '':
            return 'no file name', 201

        f.save('data/recordings/', f.filename)


api.add_resource(EduVidDesmos, '/desmos', endpoint='desmos')
api.add_resource(EduVidUploader, '/uploader', endpoint='video')
api.add_resource(EduVidGetter, '/get', endpoint='video')


if __name__ == '__main__':
    app.run(debug=True)
