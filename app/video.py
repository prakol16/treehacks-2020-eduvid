from flask import request, send_from_directory
from flask_restful import Resource
from pathlib import Path
# import cv2

from app import app, db


location = Path(app.config['UPLOAD_FOLDER'])


# def save_thumbnail(vid, out_name):
#     cap = cv2.VideoCapture(str(vid))
#     ret, frame = cap.read()  # gets very, very first frame

#     if ret:
#         cv2.imwrite(frame, out_name)

#     cap.release()

#     return ret


class EduVideo(Resource):
    def __init__(self):
        pass

    # def get(self, name):
    #     path = (location / name).with_suffix('.webm')
    #     if not path.exists():
    #         return 'nonexistant file', 201

    #     return send_from_directory(app.config['UPLOAD_FOLDER'], path.name, as_attachment=True), 200

    def post(self, name):
        print(request.files)
        if 'data' not in request.files:
            return 'data file not found', 404

        f = request.files['data']

        if f.filename == '':
            return 'no file name', 400

        video_path = location / f'{name}.webm'
        # thumbnail_path = location / f'{name}.jpeg'

        f.save(video_path)
        # save_thumbnail(video_path, thumbnail_path)

        return f"success! {name}.webm", 201


@app.route('/showvid/<string:title>')
def show_vid(title):
    data = db.get_video(title)

    if not data:
        return 'No video here', 404
    print(data['video_path'])
    return app.send_static_file(data['video_path'])


class EduVidList(Resource):
    def __init__(self):
        pass

    def get(self):
        recordings = (item.stem for item in location.glob('*.json'))
        return list(recordings), 200
