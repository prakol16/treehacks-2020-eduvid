from flask_restful import Resource, reqparse
from flask import request
from pathlib import Path
import json
import time

from app import app, db

location = Path(app.config['UPLOAD_FOLDER'])


class EduVidContent(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('filename', type=str, required=True,
                                   help='Name for video you have uploaded',
                                   location='json')
        self.reqparse.add_argument('events', type=str, required=True,
                                   help='Desmos series of actions',
                                   location='json')

        super(EduVidContent, self).__init__()

    def get(self, name):
        vid = db.get_video(name)

        if not vid:
            return 'video not found', 404

        with open(vid['metadata_path']) as file:
            metadata = json.load(file)

        metadata.update(vid)

        return metadata, 200

    def post(self, name):
        # print('detect')
        # args = self.reqparse.parse_args()
        args = request.get_json()
        print(args)

        video_path = (location / args['filename']).with_suffix('.webm')
        metadata_path = (location / name).with_suffix('.json')

        video_uri = f"video/{args['filename']}"
        metadata_uri = f'/content/{name}'

        if not video_path.exists():
            return f"{args['filename']} is nonexistant!", 404

        db.add_video(
            name,
            video_uri, str(video_path),
            metadata_uri, str(metadata_path),
        )

        metadata = {
            'timestamp': int(time.time()),
            'events': args['events'],
            'title': name,
        }

        with metadata_path.open(mode='w') as file:
            json.dump(metadata, file)

        return f'GET URI: {metadata_uri}', 201
