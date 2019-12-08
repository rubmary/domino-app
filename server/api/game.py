from flask import jsonify

class Game:
    def __init__(self):
        print("Leyendo la estrategia")
        

    def get_strategy(self, information):
        self.information = information

    def get_json(self):
        return jsonify({
            'test': self.test,
            'information': self.information
        })
