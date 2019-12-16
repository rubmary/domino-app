from flask import jsonify
from random import random

def piece_mask(piece):
    # Los ultimos tres bytes representan la primera cara
    # los siguientes tres la segunda
    mask = 0
    mask |= piece[0]
    mask |= (piece[1] << 3)
    return mask

class InformationSet:
    def __init__(self, history, hand, taken_piece):
        self.history = history
        self.hand = hand
        self.taken_piece = taken_piece

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
        taken_piece = piece_mask(self.taken_piece)
        return tuple([n] + history + [m] + hand + [taken_piece])

class Game:
    def __init__(self):
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
        return strategy

    def get_action_id(self, strategy):
        x = random()
        N = len(strategy)
        cum_prob = 0
        for i in range(N):
            if(x < cum_prob+strategy[i]):
                return i
            cum_prob += strategy[i]
        return N-1

    def get_actions(self, hand, left, right, taken_piece):
        actions = []
        if (taken_piece[0] != -1):
            hand = [taken_piece]
        print("hand (actions) = " + str(hand))
        for piece in hand:
            if(left == -1):
                actions.append((piece, 'left'))
            else:
                if (left == piece[0] or left == piece[1]):
                    actions.append((piece, 'left'))
                if ((right == piece[0] or right == piece[1]) and left != right):
                    actions.append((piece, 'right'))
        return actions

    def get_action(self, history, hand, left, right, taken_piece):
        actions = self.get_actions(hand, left, right, taken_piece)
        print("hand (action)  = " + str(hand))
        return actions[0]
        if (len(actions) == 1):
            return actions[0]
        information_set = InformationSet(history, hand, taken_piece)
        strategy = self.get_strategy(information_set)
        print(strategy)
        action_id = self.get_action_id(strategy)
        action = actions[action_id]
        return action[0], action[1]
