from flask import jsonify

def piece_mask(piece):
    # Los ultimos tres bytes representan la primera cara
    # los siguientes tres la segunda
    mask = 0
    mask |= piece[0]
    mask |= (piece[1] << 3)
    return mask

class InformationSet:
    def __init__(self, history, hand):
        self.history = history
        self.hand = hand

    def get_tuple(self):
        n = len(self.history)
        m = len(self.hand)
        history = []
        p = (n+1)%2
        for action in self.history:
            x = 0
            if action['side'] == 'pass':
                # El octavo bit indica si paso o no el jugador:
                x |= (1<<7);
            else:
                x |= piece_mask(action['placed'])<<8
                # El bit quince representa de que lado se jugo
                if(action['side'] == 'right'):
                    x |= (1<<14);

            if(tuple(action['taken']) != (-1, -1)):
                # El septimo bit indica si se tomo ficha o no
                x |= (1<<6);
                # Los primeros 6 bits indican la ficha tomada
                x |= piece_mask(action['taken']);
            history.append(x)

        for i in range(p, n, 2):
            history[i] &= ~((1<<6)-1)

        hand = []
        for piece in self.hand:
            hand.append(piece_mask(piece))
        return tuple([n] + history + [m] + hand)

class Game:
    def __init__(self):
        print("Leyendo los conjuntos de informacion...")
        file = open("strategy/information_sets.txt")
        I = {}
        N = int(file.readline())
        for i in range(N):
            id, inf_set = self.read_information_set(file)
            I[inf_set]  = id
        file.close()
        file = open("strategy/strategy.txt")
        N = int(file.readline())
        strategy = []
        for i in range(N):
            s = self.read_strategy(file)
            strategy.append(s)
        file.close()
        self.I = I
        self.strategy = strategy
        print("Set strategy")

    def read_information_set(self, file):
        line = file.readline().split()
        id = int(line[0])
        inf_set = tuple(map(int, line[2:]))
        return id, inf_set

    def read_strategy(self, file):
        line = file.readline().split()
        strategy = map(float, line[1:])
        return strategy

    def get_strategy(self, information_set):
        inf_set_tuple = information_set.get_tuple()
        id = self.I[inf_set_tuple]
        strategy = self.strategy[id]
        return jsonify({
            'strategy': strategy
        })