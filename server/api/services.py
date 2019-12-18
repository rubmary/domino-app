from flask import Blueprint, jsonify, request
from .game import Game, InformationSet
from .statistics import Statistics
from flask_cors import cross_origin

main = Blueprint('main', __name__)
game = Game()
statistics = Statistics("test")

@main.route('/api/get_action', methods=['POST'])
@cross_origin()
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

@main.route('/api/get_statistics', methods=['GET'])
def get_statistics():
    player1, player2 = statistics.get_statistics()
    return jsonify({
        "player1": player1,
        "player2": player2
    })

@main.route('/api/add_result', methods=['POST'])
def add_result():
    state = request.get_json()
    p1, p2, u = state['player1'], state['player2'], state['utility'],
    result = statistics.add_result(p1, p2, u)
    return jsonify({
        "result": result
    })
