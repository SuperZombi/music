import os
import shutil
import time
from dateutil import parser as dataparse
from flask import Flask, request, jsonify, send_from_directory, abort, redirect
from flask_cors import CORS
import json
import re
from enum import Enum
app = Flask(__name__)
CORS(app)

class Errors(Enum):
	incorrect_name_or_password = {
		'en': "The username or password you entered is incorrect!",
		'ru': "Неверное имя пользователя или пароль!"
	}
	user_dont_exist = {
		'en': "This user does not exist!",
		'ru': "Такого пользователя не существует!"
	}
	name_already_taken = {
		'en': "This nickname is already taken!",
		'ru': "Этот ник уже занят!"
	}
	track_already_exists = {
		'en': "Track already exists!",
		'ru': "Трек уже существует!"
	}
	forbidden_character = {
		'en': "Forbidden character in nickname!",
		'ru': "Запрещённый символ в нике!"
	}
	creating_folder_error = {
		'en': "Error creating folder on server! A similar name with a different case is already taken.",
		'ru': "Ошибка создания папки на сервере! Аналогичное имя с другим регистром уже занято."
	}
	invalid_parameters = {
		'en': "Invalid parameters!",
		'ru': "Неверные параметры!"
	}

@app.route("/status")
def status():
	return jsonify({'online': True, 'time': time.time()})

@app.route('/<path:filepath>')
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

@app.route("/api/decode_error", methods=["POST"])
def get_error_value():
	if 'lang' in request.json.keys():
		lang = request.json['lang'].lower()

	try:
		temp = Errors[request.json['code']].value
		if isinstance(temp, dict):
			if lang in temp.keys():
				return {'successfully': True, 'value': temp[lang]}
			return {'successfully': True, 'value': temp['en']} # default
		return temp
	except:
		return {'successfully': False}

@app.route('/api/get_tracks')
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
			users = json.loads(file.read())
	except FileNotFoundError:
		None
load_users()

def save_users():
	with open('users.bd', 'w', encoding='utf8') as file:
		file.write(json.dumps(users, indent=4, ensure_ascii=False))
def register_user(data):
	temp = {}
	temp[data['name']] = {}
	temp[data['name']]['password'] = data['password']
	temp[data['name']]['registration_time'] = time.time()

	if 'email' in data.keys():
		temp[data['name']]['email'] = data['email']

	if 'gender' in data.keys():
		temp[data['name']]['gender'] = data['gender']

	if 'phone' in data.keys():
		temp[data['name']]['phone'] = data['phone']	

	global users
	users.update(temp)

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
		file.write('bd = ' + json.dumps(tracks, indent=4, ensure_ascii=False))

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

	d = dataparse.parse(date)
	d_str = f'{str(d.day).zfill(2)}.{str(d.month).zfill(2)}.{d.year}'

	tracks[artist]['tracks'][track_name]["date"] = d_str


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


@app.route("/api/user_exists", methods=["POST"])
def user_exists_post():
	if request.json['name'] in users.keys():
		return jsonify({'exist': True})
	return jsonify({'exist': False})

@app.route("/api/name_available", methods=["POST"])
def name_available():
	if '"' in request.json['name']:
		return jsonify({'available': False, 'reason': Errors.forbidden_character.name})
	if request.json['name'] in users.keys():
		return jsonify({'available': False, 'reason': Errors.name_already_taken.name})
	user_folder = os.path.join("data", request.json['name'].lower().replace(" ", "-"))
	if os.path.exists(user_folder):
		return jsonify({'available': False, 'reason': Errors.creating_folder_error.name})
	return jsonify({'available': True})

@app.route("/api/login", methods=["POST"])
def login():
	if request.json['name'] in users.keys():
		if users[request.json['name']]['password'] == request.json['password']:
			return jsonify({'successfully': True})
		else:
			return jsonify({'successfully': False, 'reason': Errors.incorrect_name_or_password.name})
		
	return jsonify({'successfully': False, 'reason': Errors.user_dont_exist.name})

@app.route("/api/register", methods=["POST"])
def register():
	if request.json['name'] in users.keys():
		return jsonify({'successfully': False, 'reason': Errors.name_already_taken.name})
	
	if '"' in request.json['name']:
		return jsonify({'successfully': False, 'reason': Errors.forbidden_character.name})

	try:
		user_folder = os.path.join("data", request.json['name'].lower().replace(" ", "-"))
		if not os.path.exists(user_folder):
			os.makedirs(user_folder)
			with open(os.path.join(user_folder, 'config.json'), 'w', encoding='utf8') as file:
				file.write(atrist_config(request.json['name']))
			with open(os.path.join(user_folder, 'index.html'), 'w', encoding='utf8') as file:
				file.write(artist_index(request.json['name']))
		else:
			return jsonify({'successfully': False, 'reason': Errors.creating_folder_error.name})
	except:
		return jsonify({'successfully': False, 'reason': Errors.creating_folder_error.name})

	try:
		register_user(request.json)
	except:
		shutil.rmtree(user_folder)
		return jsonify({'successfully': False, 'reason': Errors.invalid_parameters.name})

	save_users()
	return jsonify({'successfully': True})


def make_config(data, files):
	config = {}
	config["track_name"] = data["track_name"]
	config["artist"] = data["artist"]
	config["genre"] = data["genre"]
	config["main_img"] = files["image"].filename
	config["allow_download"] = data["allow_download"]
	config["download_file"] = files["audio"].filename
	config["audio_preview"] = files["audio"].filename

	config["show_time"] = True
	config["animate_time"] = True

	links = {}
	hosts = ['spotify', 'youtube_music', 'youtube', 'apple_music', 'deezer', 'soundcloud', 'newgrounds']
	for i in hosts:
		if i in data.keys():
			links[i] = data[i]
	if links:
		config['links'] = links

	return config


def fast_login(user, password):
	if user in users.keys():
		if users[user]['password'] == password:
			return True
	return False

@app.route('/api/uploader', methods=['POST'])
def upload_file():
	if request.method == 'POST':
		if fast_login(request.form['artist'], request.form['password']):
			user_folder = os.path.join("data", request.form['artist'].lower().replace(" ", "-"))
			track_folder = os.path.join(user_folder, request.form['track_name'].lower().replace(" ", "-"))

			if os.path.exists(user_folder):
				if track_exists(request.form['artist'], request.form['track_name']):
					return jsonify({'successfully': False, 'reason': Errors.track_already_exists.name})

				if not os.path.exists(track_folder):
					os.makedirs(track_folder)

					for i in request.files:
						f = request.files[i]
						f.save(os.path.join(track_folder, f.filename))

					try:
						config = make_config(request.form.to_dict(), request.files.to_dict())
						with open(os.path.join(track_folder, 'config.json'), 'w', encoding='utf8') as file:
							file.write('config = ' + json.dumps(config, indent=4, ensure_ascii=False))

						with open(os.path.join(track_folder, 'index.html'), 'w', encoding='utf8') as file:
							file.write(track_index(request.form['artist'], request.form['track_name'], request.files['image'].filename))
					
						add_track(artist=request.form['artist'],
								track_name=request.form['track_name'],
								genre=request.form['genre'],
								image=request.files['image'].filename,
								date=request.form['release_date'])

						save_tracks()

						return jsonify({'successfully': True})

					except Exception as e:
						print(e)
						shutil.rmtree(track_folder)
						return jsonify({'successfully': False, 'reason': Errors.invalid_parameters.name})
			
			return jsonify({'successfully': False, 'reason': Errors.creating_folder_error.name})

		else:
			return jsonify({'successfully': False, 'reason': Errors.incorrect_name_or_password.name})

		


if __name__ == '__main__':
	app.run(host='0.0.0.0', port='80', debug=True)
