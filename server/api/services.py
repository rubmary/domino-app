from flask import Blueprint, jsonify, request
from .game import Game, InformationSet
from flask_cors import cross_origin

main = Blueprint('main', __name__)
game = Game()

@main.route('/api/get_action', methods=['POST'])
@cross_origin()
def get_action():
    state = request.get_json()
    print("Printing state:")
    print(state)
    history, hand = state['history'], state['hand']
    left, right = state['left'], state['right']
    piece, side = game.get_action(history, hand, left, right)
    print(piece)
    print(side)
    return jsonify({
        "piece": piece,
        "side": side
    })