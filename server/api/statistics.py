from google.cloud import datastore
from threading import Lock
import json

class Statistics:
    def __init__(self):
        self.client = datastore.Client()
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
        query = client.query(kind='player', order=['id'])
        results = list(query.fetch())
        return {
            'player1': results[0],
            'player2': results[1]
        }
