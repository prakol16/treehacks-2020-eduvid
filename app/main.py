from app import app, api, video, content

api.add_resource(content.EduVidContent, '/content/<string:name>', endpoint='content')
api.add_resource(video.EduVideo, '/video/<string:name>')
api.add_resource(video.EduVidList, '/list')
