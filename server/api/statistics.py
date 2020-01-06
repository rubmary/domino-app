from google.cloud import datastore
from threading import Lock
import json

class Statistics:
    def __init__(self):
        self.client = datastore.Client()

    def add_result(self, player1, player2, result):
        query = self.client.query(kind='player', order=['id'])
        results = list(query.fetch())
        with self.client.transaction():
            [stats_p1, stats_p2] = results
            if (player1):
                stats_p1['games'] = stats_p1['games'] + 1
                stats_p1['sum'] = stats_p1['sum'] + result
                stats_p1['average'] = stats_p1['sum']/stats_p1['games']
            if (player2):
                stats_p2['games'] = stats_p2['games'] + 1
                stats_p2['sum'] = stats_p2['sum'] - result
                stats_p2['average'] = stats_p2['sum']/stats_p2['games']
            self.client.put_multi([stats_p1, stats_p2])

    def get_statistics(self):
        query = self.client.query(kind='player', order=['id'])
        results = list(query.fetch())
        return {
            'player1': results[0],
            'player2': results[1]
        }
