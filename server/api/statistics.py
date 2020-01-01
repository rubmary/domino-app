from threading import Lock
import json

class Statistics:
    def __init__(self):
        self.data = {
            'player1': {
                'average': 0,
                'games': 0,
                'sum': 0
            },
            'player2': {
                'average': 0,
                'games': 0,
                'sum': 0
            }
        }
        self.lock = Lock()

    def add_result(self, player1, player2, result):
        with self.lock:
            data = {}
            if (player1):
                stats = self.data['player1']
                stats['games'] = stats['games'] + 1
                stats['sum'] = stats['sum'] + result
                stats['average'] = stats['sum']/stats['games']
            if (player2):
                stats = self.data['player2']
                stats['games'] = stats['games'] + 1
                stats['sum'] = stats['sum'] - result
                stats['average'] = stats['sum']/stats['games']
        return "ok"

    def get_statistics(self):
        with self.lock:
            return self.data
        return {"result": error}
