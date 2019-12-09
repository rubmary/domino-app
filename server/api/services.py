from flask import Blueprint, jsonify, request
from .game import Game, InformationSet

main = Blueprint('main', __name__)
game = Game()

@main.route('/get_strategy')
def get_strategy():

    state = request.get_json()
    information_set = InformationSet(state['history'], state['hand'])
    return game.get_strategy(information_set)