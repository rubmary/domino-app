from flask import Blueprint, jsonify, request
from .game import Game

main = Blueprint('main', __name__)
game = Game()

@main.route('/get_strategy')
def get_strategy():

    get_state = request.get_json()
    game.get_strategy(get_state['information'])

    return game.get_json()
