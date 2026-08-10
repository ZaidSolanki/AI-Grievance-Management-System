# 🤖 AI Grievance Management System

An AI-powered digital grievance management platform designed to simplify, automate, and improve the process of submitting, classifying, routing, tracking, and managing citizen grievances.

The system uses Artificial Intelligence to analyze submitted complaints, determine their severity, and support efficient grievance management for users and administrators.

---

## 👥 Team

### Team Members

|       Name         |    Role     |
|--------------------|-------------|
| **Zaid Solanki**   | Team Member |
| **Jeel Khandivar** | Team Member |
| **Kavya Sankhala** | Team Member |
| **Dev Pandadiya**  | Team Member |
| **Tirth Sangani**  | Team Member |

### Mentor

**Vasanti Chavda**

---

# 📌 Project Overview

Traditional grievance management systems often depend on manual complaint registration, classification, department assignment, and follow-up.

This can result in:

- Delayed complaint processing
- Incorrect categorization
- Difficulty in prioritizing urgent complaints
- Lack of transparency
- Difficulty tracking complaint status
- Increased workload for administrative staff

The **AI Grievance Management System** addresses these challenges by providing a centralized web-based platform where users can submit grievances and receive AI-assisted classification and severity analysis.

Administrators can manage complaints and users through an administrative interface.

---

# 🎯 Objectives

The main objectives of the project are:

- Provide a centralized platform for grievance submission.
- Simplify the complaint registration process.
- Use AI to analyze grievance information.
- Automatically classify complaint severity.
- Improve complaint management and tracking.
- Provide administrators with a centralized dashboard.
- Reduce manual effort in grievance processing.
- Improve transparency between citizens and administrative authorities.
- Provide a scalable foundation for AI-assisted civic grievance management.

---

# 🚀 Key Features

## 👤 User Features

- User registration
- Secure user login
- Password hashing
- User authentication
- User dashboard
- Grievance submission
- Complaint category selection
- Complaint description
- Complaint severity analysis
- Complaint history
- Complaint tracking
- Complaint details
- User profile management

---

## 🤖 AI-Powered Features

The system integrates Google's Gemini AI to assist with grievance analysis.

### AI Severity Classification

When a user submits a grievance, the system processes:

- Complaint title
- Complaint category
- Complaint description

The information is passed to the AI service for severity classification.

The system can then assign a severity level such as:

- Low
- Medium
- High

This helps administrators identify complaints that may require faster attention.

---

## 👨‍💼 Administrator Features

The administrative section provides tools for managing the grievance system.

Features include:

- Admin authentication
- Admin dashboard
- Complaint management
- Complaint details
- User management
- Department management
- Complaint analytics
- Complaint monitoring
- Administrative overview

---

# 🔄 How the System Works

The overall workflow is:

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Register / Login    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Submit Grievance    │
                    │ Title + Category +  │
                    │ Description         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AI Processing     │
                    │     Gemini AI       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Severity Analysis   │
                    │ Low / Medium / High│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Complaint Stored    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ User Tracks Status  │
                    └─────────────────────┘


              ┌────────────────────────────┐
              │          ADMIN             │
              └─────────────┬──────────────┘
                            │
                            ▼
              ┌────────────────────────────┐
              │ Dashboard / Complaints     │
              │ Users / Departments        │
              │ Analytics / Management     │
              └────────────────────────────┘