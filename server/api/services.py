from flask import Blueprint, jsonify, request
from .game import Game, InformationSet

main = Blueprint('main', __name__)
game = Game()

@main.route('/get_action')
def get_action():
    state = request.get_json()
    history, hand = state['history'], state['hand']
    left, right = state['left'], state['right']
    action = game.get_action(history, hand, left, right)
    return jsonify({
        "action": action,
    })