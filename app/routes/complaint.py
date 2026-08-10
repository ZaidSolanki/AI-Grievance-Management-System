"""
=========================================
AI Grievance Management System
Complaint Routes
=========================================
"""

from flask import Blueprint, jsonify, request

from app.models.complaint import Complaint
from app.services.complaint_service import ComplaintService

complaint_bp = Blueprint(
    "complaint",
    __name__,
    url_prefix="/complaint"
)


@complaint_bp.route("/", methods=["GET"])
def complaint_home():

    return jsonify({
        "module": "Complaint",
        "status": "working"
    })


@complaint_bp.route("/all", methods=["GET"])
def get_all_complaints():

    complaints = ComplaintService.get_all_complaints()

    return jsonify([dict(row) for row in complaints])


@complaint_bp.route("/create", methods=["POST"])
def create_complaint():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is missing."
        }), 400

    required_fields = [
        "user_id",
        "title",
        "description"
    ]

    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    complaint = Complaint(
        user_id=data["user_id"],
        title=data["title"].strip(),
        description=data["description"].strip(),
        image_path=data.get("image_path"),
        category=data.get("category"),
        priority=data.get("priority"),
        department_id=data.get("department_id"),
        status="Pending",
        location=data.get("location"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude")
    )

    complaint_id = ComplaintService.create_complaint(complaint)

    return jsonify({
        "success": True,
        "message": "Complaint created successfully.",
        "complaint_id": complaint_id
    }), 201

@complaint_bp.route("/<int:complaint_id>", methods=["GET"])
def get_complaint(complaint_id):

    complaint = ComplaintService.get_complaint_by_id(complaint_id)

    if complaint is None:
        return jsonify({
            "success": False,
            "message": "Complaint not found."
        }), 404

    return jsonify(dict(complaint))

@complaint_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_complaints(user_id):

    complaints = ComplaintService.get_user_complaints(user_id)

    return jsonify([dict(row) for row in complaints])

@complaint_bp.route("/<int:complaint_id>/status", methods=["PUT"])
def update_complaint_status(complaint_id):

    data = request.get_json()

    if not data or "status" not in data:
        return jsonify({
            "success": False,
            "message": "Status is required."
        }), 400

    complaint = ComplaintService.get_complaint_by_id(complaint_id)

    if complaint is None:
        return jsonify({
            "success": False,
            "message": "Complaint not found."
        }), 404

    ComplaintService.update_status(
        complaint_id,
        data["status"]
    )

    return jsonify({
        "success": True,
        "message": "Complaint status updated successfully."
    })

@complaint_bp.route("/<int:complaint_id>", methods=["DELETE"])
def delete_complaint(complaint_id):

    complaint = ComplaintService.get_complaint_by_id(complaint_id)

    if complaint is None:
        return jsonify({
            "success": False,
            "message": "Complaint not found."
        }), 404

    ComplaintService.delete_complaint(complaint_id)

    return jsonify({
        "success": True,
        "message": "Complaint deleted successfully."
    })