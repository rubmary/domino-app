from flask import Flask, jsonify, request, render_template, send_file
from .game import Game, InformationSet
from .statistics import Statistics
from flask_cors import CORS

app = Flask(__name__, static_folder="../build/static", template_folder="../build")
cors = CORS(app)
game = Game()
statistics = Statistics()

@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/<path:path>")
def serve_files(path):
    return send_file(app.template_folder + '/' + path)

@app.route('/api/get_action', methods=['POST'])
def get_action():
    state = request.get_json()
    print("Printing state:")
    print(state)
    history, hand = state['history'], state['hand']
    left, right = state['left'], state['right']
    takenPiece = state['takenPiece']
    piece, side = game.get_action(history, hand, left, right, takenPiece)
    print("(piece, side) = (" + str(piece) + ", " + str(side) + ")")
    return jsonify({
        "piece": piece,
        "side": side
    })

@app.route('/api/get_statistics', methods=['GET'])
def get_statistics():
    return jsonify(statistics.get_statistics())

@app.route('/api/add_result', methods=['POST'])
def add_result():
    state = request.get_json()
    p1, p2, u = state['player1'], state['player2'], state['utility'],
    result = statistics.add_result(p1, p2, u)
    print("Add new result:", p1, p2, u)
    return jsonify({
        "result": result
    })
