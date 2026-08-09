import os

from flask import Flask
from flask_login import LoginManager

from config import Config

login_manager = LoginManager()


def create_app(test_config=None):
	base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
	template_dir = os.path.join(base_dir, "templates")
	static_dir = os.path.join(base_dir, "static")

	app = Flask(
		__name__,
		instance_relative_config=True,
		template_folder=template_dir,
		static_folder=static_dir,
	)
	app.config.from_object(Config)

	if test_config:
		app.config.update(test_config)

	os.makedirs(app.config.get("UPLOAD_FOLDER", os.path.join(app.root_path, "static", "uploads")), exist_ok=True)

	login_manager.init_app(app)
	login_manager.login_view = "auth.login"

	from app.services.auth_service import load_user

	login_manager.user_loader(load_user)

	from app.routes.main import main_bp
	from app.routes.auth import auth_bp
	from app.routes.user import user_bp

	app.register_blueprint(main_bp)
	app.register_blueprint(auth_bp)
	app.register_blueprint(user_bp)

	return app
