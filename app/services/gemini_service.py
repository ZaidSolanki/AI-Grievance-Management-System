import os
import google.generativeai as genai
from flask import current_app


def classify_severity(title, category, description):
    api_key = current_app.config.get("GEMINI_API_KEY", "")
    if not api_key:
        return classify_severity_heuristic(title, category, description)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = (
            "You are a grievance triage assistant. Classify the severity of the following complaint as exactly one of: Low, Medium, High.\n"
            f"Title: {title}\n"
            f"Category: {category}\n"
            f"Description: {description}\n"
            "Respond with only the severity label."
        )
        response = model.generate_content(prompt)
        text = (response.text or "").strip()
        if text.lower().startswith("high"):
            return "High"
        if text.lower().startswith("low"):
            return "Low"
        return "Medium"
    except Exception:
        return classify_severity_heuristic(title, category, description)


def classify_severity_heuristic(title, category, description):
    high_keywords = ["urgent", "emergency", "danger", "fire", "flood", "accident", "injury", "collapse", "death", "unsafe", "hazard"]
    text = f"{title} {category} {description}".lower()
    for kw in high_keywords:
        if kw in text:
            return "High"
    medium_keywords = ["broken", "leak", "leaking", "damage", "damaged", "not working", "failed", "failure", "delay", "no water", "no power", "contamination", "overflow", "blocked", "blockage"]
    for kw in medium_keywords:
        if kw in text:
            return "Medium"
    return "Low"
