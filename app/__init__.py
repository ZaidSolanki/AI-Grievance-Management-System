from flask import Flask
from flask_login import LoginManager

from config import Config


login_manager = LoginManager()
login_manager.login_view = "auth.login"


def create_app(test_config=None):
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    login_manager.init_app(app)

    from app.db import init_db
    init_db()

    from app.models.user import User
    from app.services.auth_service import load_user

    @login_manager.user_loader
    def load_user_callback(user_id):
        return load_user(user_id)

    from app.routes.auth import auth_bp
    from app.routes.user import user_bp
    from app.routes.main import main_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)

    return app
