from threading import Lock
import json

class Statistics:
    def __init__(self, filename):
        self.filename = filename
        self.lock = Lock()

    def add_result(self, player1, player2, result):
        with self.lock:
            data = {}
            with open(self.filename, 'r') as json_file:
                data = json.load(json_file)
                if (player1):
                    stats = data['player1']
                    stats['games'] = stats['games'] + 1
                    stats['sum'] = stats['sum'] + result
                    stats['average'] = stats['sum']/stats['games']
                if (player2):
                    stats = data['player2']
                    stats['games'] = stats['games'] + 1
                    stats['sum'] = stats['sum'] - result
                    stats['average'] = stats['sum']/stats['games']
            with open(self.filename, 'w') as out_file:
                json.dump(data, out_file)
        return "ok"

    def get_statistics(self):
        with self.lock:
            with open(self.filename) as json_file:
                data = json.load(json_file)
                return data
        return {"result": error}
