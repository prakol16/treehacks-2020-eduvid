import sqlite3
from app import app

DATABASE = 'data.db'
COLS = ('title', 'video_uri', 'video_path', 'metadata_uri', 'metadata_path')

# Table Schema
#
# videos(
#   title text primary key, video_uri text,
#   video_path text, metadata_uri text,
#   metadata_path text
# )


class DB:
    def __init__(self, database):
        self.database = database
        try:
            with sqlite3.connect(self.database) as conn:
                c = conn.cursor()
                c.execute('CREATE TABLE videos(title text primary key, video_uri text, video_path text, metadata_uri text, metadata_path text)')
        except:
            print('table exists')

    def add_video(self, title, video_uri, video_path, metadata_uri, metadata_path):
        with sqlite3.connect(self.database) as conn:
            c = conn.cursor()

            if title in self.get_titles():
                # print(f'updating as {title} exists')
                q = ', '.join(f'{col}=?' for col in COLS[1:])
                # print(q)
                c.execute(
                    f'UPDATE videos SET {q} WHERE title=?;',
                    (video_uri, video_path, metadata_uri, metadata_path, title)
                )
            else:
                c.execute(
                    'INSERT INTO videos VALUES (?, ?, ?, ?, ?);',
                    (title, video_uri, video_path, metadata_uri, metadata_path)
                )

            conn.commit()

    def get_video(self, title):
        with sqlite3.connect(self.database) as conn:
            c = conn.cursor()
            c.execute(
                'SELECT * FROM videos WHERE title=?;', (title, )
            )

            results = c.fetchall()

            if not results:
                return False

            return dict(zip(COLS, results[0]))

    def get_titles(self, conn=None):
        if conn is None:
            conn = sqlite3.connect(self.database)

        c = conn.cursor()
        c.execute('SELECT title FROM videos')

        results = c.fetchall()

        conn.close()
        print(list(item[0] for item in results))
        return list(item[0] for item in results)


_singleton = DB(app.config['DATA'] + DATABASE)

add_video = _singleton.add_video
get_video = _singleton.get_video
get_titles = _singleton.get_titles
