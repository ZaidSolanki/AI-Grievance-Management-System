from flask import Blueprint, abort, render_template
from jinja2 import TemplateNotFound

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def index():
    return render_template("welocme.html")


@main_bp.route("/welcome.html")
def welcome():
    return render_template("welocme.html")


@main_bp.route("/<path:template_name>")
def render_html_page(template_name):
    if not template_name.endswith(".html"):
        abort(404)

    try:
        return render_template(template_name)
    except TemplateNotFound:
        if template_name == "welcome.html":
            return render_template("welocme.html")
        abort(404)
