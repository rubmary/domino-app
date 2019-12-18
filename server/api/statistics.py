from threading import Lock

class Statistics:
    def __init__(self, filename):
        print("Init")
        self.filename = filename
        self.lock = Lock()

    def add_result(self, player1, player2, result):
        with self.lock:
            if(player1):
                print("El jugador 1 fue la maquina")
            if(player2):
                print ("El jugador 2 fue la maquina")
        return "ok"

    def get_statistics(self):
        with self.lock:
            print("Obteniendo estadisticas")
        return "Jugador 1", "Jugador 2"
