import os
import time
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
import json
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
		if os.path.isfile(os.path.join(p, 'index.html')):
			return send_from_directory('data', os.path.join(filepath, 'index.html'))
		if os.path.isfile(os.path.join(p, 'config.json')):
			return send_from_directory('data', os.path.join(filepath, 'config.json'))
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
		with open('tracks.bd', 'r', encoding='utf8') as file:
			tracks = eval(file.read())
	except FileNotFoundError:
		None
load_tracks()

def save_tracks():
	global tracks
	with open('tracks.bd', 'w', encoding='utf8') as file:
		file.write(json.dumps(tracks, indent=4, ensure_ascii=False))


@app.route("/user_exists", methods=["POST"])
def user_exists():
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
			os.makedirs(os.path.join("data", request.json['name'].lower().replace(" ", "-")))
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
		if fast_login(request.form['name'], request.form['password']):
			user_folder = os.path.join("data", request.form['name'].lower().replace(" ", "-"))
			track_folder = os.path.join(user_folder, request.form['track_name'].lower().replace(" ", "-"))

			if os.path.exists(user_folder):
				try:
					if request.form['track_name'] in tracks[request.form['name']]:
						return jsonify({'successfully': False, 'reason':'Трек уже существует!'})
				except KeyError:
					None

				if not os.path.exists(track_folder):
					os.makedirs(track_folder)

					try:
						tracks[request.form['name']].append(request.form['track_name'])
					except KeyError:
						tracks.update({request.form['name']:[]})
						tracks[request.form['name']].append(request.form['track_name'])
					save_tracks()

					for i in request.files:
						f = request.files[i]
						f.save(os.path.join(track_folder, f.filename))

					if request.form['config']:
						with open(os.path.join(track_folder, 'config.json'), 'w', encoding='utf8') as file:
							file.write(request.form['config'])
					# for i in request.form:
					# 	print(i, request.form[i])

					return jsonify({'successfully': True})
			
			return jsonify({'successfully': False, 'reason':'Ошибка создании папки трека на сервере!'})

		else:
			return jsonify({'successfully': False, 'reason':'Не верное имя пользователя или пароль!'})

		


if __name__ == '__main__':
	app.run(host='0.0.0.0', port='80', debug=True)
