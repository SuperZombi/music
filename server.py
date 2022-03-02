import os
import shutil
import time
from flask import Flask, request, jsonify, send_from_directory, abort, redirect
from flask_cors import CORS
import json
import re
app = Flask(__name__)
CORS(app)

@app.route("/")
def status():
	return jsonify({'online': True, 'time': time.time()})

@app.route('/data/<path:filepath>')
def data(filepath):
	p = os.path.join("data", filepath)
	if os.path.exists(p):
		if os.path.isfile(p):
			return send_from_directory('data', filepath)
		if filepath[-1] != "/":
			return redirect("/" + p + "/")
		if os.path.isfile(os.path.join(p, 'index.html')):
			return send_from_directory('data', os.path.join(filepath, 'index.html'))
	if os.path.isfile(p + '.html'):
		return send_from_directory('data', filepath + '.html')
	abort(404)

@app.route('/get_tracks')
def get_tracks():
	unswer = []
	for user, array in tracks.items():
		for track in array:
			unswer.append( os.path.join('data', user.lower().replace(" ", "-"), track.lower().replace(" ", "-"))  )
	return jsonify(unswer)

users = {}
def load_users():
	global users
	try:
		with open('users.bd', 'r', encoding='utf8') as file:
			users = eval("{" + file.read() +"}")
	except FileNotFoundError:
		None
load_users()

def save_user(name, password):
	with open('users.bd', 'a', encoding='utf8') as file:
		file.write(f'"{name}": "{password}",\n')

tracks = {}
def load_tracks():
	global tracks
	try:
		with open(os.path.join('data', 'root_', 'bd.json'), 'r', encoding='utf8') as file:
			string = file.read()
			string = string.split('=', 1)[1]
			
			regex = r'''(?<=[}\]"']),(?!\s*[{["'])'''
			result = re.sub(regex, "", string, 0)
			
			tracks = json.loads(result)
	except FileNotFoundError:
		None
load_tracks()

def save_tracks():
	global tracks
	with open(os.path.join('data', 'root_', 'bd.json'), 'w', encoding='utf8') as file:
		file.write(json.dumps(tracks, indent=4, ensure_ascii=False))

def user_exists(artist):
	return artist in tracks.keys()
def track_exists(artist, track):
	if user_exists(artist):
		return track in tracks[artist]['tracks'].keys()
	return False

def add_user(artist):
	global tracks
	tracks[artist] = {}
	tracks[artist]['path'] = artist.lower().replace(" ", "-")
	tracks[artist]['tracks'] = {}

def add_track(artist, track_name, genre, image, date):
	global tracks
	if not user_exists(artist):
		add_user(artist)
	tracks[artist]['tracks'][track_name] = {}
	tracks[artist]['tracks'][track_name]["path"] = track_name.lower().replace(" ", "-")
	tracks[artist]['tracks'][track_name]["genre"] = genre
	tracks[artist]['tracks'][track_name]["image"] = image
	tracks[artist]['tracks'][track_name]["date"] = date


def track_index(artist, track, image):
	return f'''<!DOCTYPE html><html><head>
	<title>Zombi Music</title>
	<meta name="viewport" content="width=device-width"><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="shortcut icon" href="../../root_/images/logo2.png" type="image/png">
	<!-- og:zone -->
	<meta property="og:image" content="{image}">
	<meta property="og:title" content="{artist} - {track}">
	<meta property="og:description" content="Zombi Music">
	<meta property="og:site_name" content="zombi.music">
	<meta property='og:type' content="music.song">
	<script src="../../root_/scripts/lang.js"></script>
	<script src="../../root_/scripts/theme.js"></script>
	<link rel="stylesheet" href="../../root_/styles/main.css">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">
	<script src="config.json"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/wavesurfer.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/2.0.4/plugin/wavesurfer.regions.min.js"></script>
	<script src="../../root_/htmls/header.html"></script>
	<script src="../../root_/htmls/body.html"></script>
	<script src="../../root_/htmls/footer.html"></script>
	<script src="../../root_/scripts/main.js"></script>
	</head><body></body></html>'''

def atrist_config(name, image="../root_/images/people.svg"):
	return "ARTIST = {" + f'''"name": "{name}", "image": "{image}"''' + "}"

def artist_index(name, image="../root_/images/people.svg"):
	return f'''<!DOCTYPE html><html><head>
	<title>Zombi Music</title>
	<meta name="viewport" content="width=device-width"><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="shortcut icon" href="../root_/images/logo2.png" type="image/png">
	<!-- og:zone -->
	<meta property="og:image" content="{image}">
	<meta property="og:title" content="{name}">
	<meta property="og:description" content="Artist">
	<meta property="og:site_name" content="zombi.music">
	<script src="../root_/scripts/lang_artist.js"></script>
	<script src="../root_/scripts/theme_artist.js"></script>
	<script src="artist.json"></script>
	<script src="../root_/bd.json"></script>
	<link rel="stylesheet" href="../root_/styles/main.css">
	<script src="../root_/htmls/header_artist.html"></script>
	<script src="../root_/htmls/body_artist.html"></script>
	<script src="../root_/htmls/footer_artist.html"></script>
	<script src="../root_/scripts/artist.js"></script>
	</head><body></body></html>'''


@app.route("/user_exists", methods=["POST"])
def user_exists_post():
	if request.json['name'] in users.keys():
		return jsonify({'exist': True})
	return jsonify({'exist': False})

@app.route("/login", methods=["POST"])
def login():
	if request.json['name'] in users.keys():
		if users[request.json['name']] == request.json['password']:
			return jsonify({'successfully': True})
		else:
			return jsonify({'successfully': False, 'reason':'Не верное имя пользователя или пароль!'})
		
	return jsonify({'successfully': False, 'reason':'Такого пользователя не существует!'})

@app.route("/register", methods=["POST"])
def register():
	if request.json['name'] in users.keys():
		return jsonify({'successfully': False, 'reason':'Этот ник уже занят!'})
	
	if '"' in request.json['name']:
		return jsonify({'successfully': False, 'reason':'Запрещённый символ в нике!'})

	try:
		if not os.path.exists(request.json['name'].lower()):
			user_folder = os.path.join("data", request.json['name'].lower().replace(" ", "-"))
			os.makedirs(user_folder)
			with open(os.path.join(user_folder, 'config.json'), 'w', encoding='utf8') as file:
				file.write(atrist_config(request.json['name']))
			with open(os.path.join(user_folder, 'index.html'), 'w', encoding='utf8') as file:
				file.write(artist_index(request.json['name']))
		else:
			return jsonify({'successfully': False, 'reason':'Ошибка создании папки пользователя на сервере! Папка уже существует!'})
	except:
		return jsonify({'successfully': False, 'reason':'Ошибка создании папки пользователя на сервере!'})
		
	users[request.json['name']] = request.json['password']
	save_user(request.json['name'], request.json['password'])
	return jsonify({'successfully': True})


def fast_login(user, password):
	if user in users.keys():
		if users[user] == password:
			return True
	return False

@app.route('/uploader', methods=['POST'])
def upload_file():
	if request.method == 'POST':
		if fast_login(request.form['artist'], request.form['password']):
			user_folder = os.path.join("data", request.form['artist'].lower().replace(" ", "-"))
			track_folder = os.path.join(user_folder, request.form['track_name'].lower().replace(" ", "-"))

			if os.path.exists(user_folder):
				if track_exists(request.form['artist'], request.form['track_name']):
					return jsonify({'successfully': False, 'reason':'Трек уже существует!'})

				if not os.path.exists(track_folder):
					os.makedirs(track_folder)

					try:
						add_track(artist=request.form['artist'],
								track_name=request.form['track_name'],
								genre=request.form['genre'],
								image=request.files['image'].filename,
								date=request.form['release_date'])
					except Exception as e:
						print(e)
						shutil.rmtree(track_folder)
						return jsonify({'successfully': False, 'reason':'Неверные параметры!'})

					save_tracks()

					for i in request.files:
						f = request.files[i]
						f.save(os.path.join(track_folder, f.filename))

					if request.form['config']:
						with open(os.path.join(track_folder, 'config.json'), 'w', encoding='utf8') as file:
							file.write(request.form['config'])

					try:
						with open(os.path.join(track_folder, 'index.html'), 'w', encoding='utf8') as file:
							file.write(track_index(request.form['artist'], request.form['track_name'], request.files['image'].filename))
					except Exception as e:
						print(e)
						shutil.rmtree(track_folder)
						return jsonify({'successfully': False, 'reason':'Неверные параметры!'})

					return jsonify({'successfully': True})
			
			return jsonify({'successfully': False, 'reason':'Ошибка создании папки трека на сервере!'})

		else:
			return jsonify({'successfully': False, 'reason':'Не верное имя пользователя или пароль!'})

		


if __name__ == '__main__':
	app.run(host='0.0.0.0', port='80', debug=True)
