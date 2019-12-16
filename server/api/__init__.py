from flask import Flask
from flask_cors import CORS, cross_origin

def create_app():
    app = Flask(__name__)
    cors = CORS(app)
    from .services import main
    app.register_blueprint(main)
    return app
