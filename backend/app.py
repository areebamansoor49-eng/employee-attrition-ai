from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_cors import CORS
import bcrypt
import joblib
import pandas as pd

app = Flask(__name__)

# =========================
# CORS
# =========================
CORS(app)

# =========================
# CONFIG
# =========================
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "employee_attrition_project_secret_key_2026_secure_key_123456789"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)

# =========================
# LOAD MODEL
# =========================
try:
    model = joblib.load("model.pkl")
    scaler = joblib.load("scaler.pkl")
    columns = joblib.load("columns.pkl")
    print("✅ ML Model Loaded Successfully")
    print("MODEL COLUMNS:", columns)
except Exception as e:
    print("❌ Model load error:", e)
    model = None
    scaler = None
    columns = []

# =========================
# USER MODEL
# =========================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

with app.app_context():
    db.create_all()

# =========================
# HOME
# =========================
@app.route("/")
def home():
    return jsonify({"message": "Backend + ML + Auth Running"})


# =========================
# REGISTER
# =========================
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No input data"}), 400

    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = User(
        username=data.get("username"),
        email=data.get("email"),
        password=hashed_pw
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"})


# =========================
# LOGIN
# =========================
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Missing data"}), 400

    user = User.query.filter_by(email=data.get("email")).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    is_valid = bcrypt.checkpw(
        data["password"].encode("utf-8"),
        user.password.encode("utf-8")
    )

    if not is_valid:
        return jsonify({"message": "Invalid password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "message": "Login successful"
    })


# =========================
# REQUIRED FIELDS VALIDATION (IMPORTANT FIX)
# =========================
REQUIRED_FIELDS = ["Age", "MonthlyIncome", "JobRole"]


# =========================
# PREDICT
# =========================
@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():

    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # 🔥 CHECK REQUIRED FIELDS
        missing = [f for f in REQUIRED_FIELDS if f not in data]

        if missing:
            return jsonify({
                "error": "Please fill all required fields",
                "missing_fields": missing
            }), 400

        current_user = get_jwt_identity()

        # safe input mapping
        safe_input = {}
        for col in columns:
            safe_input[col] = data.get(col, 0)

        df = pd.DataFrame([safe_input])

        df_scaled = scaler.transform(df)
        prediction = model.predict(df_scaled)

        result = "Employee May Leave" if prediction[0] == 1 else "Employee Likely Stay"

        response = {
            "user_id": current_user,
            "prediction": int(prediction[0]),
            "result": result
        }

        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(df_scaled)[0][1]
            response["probability"] = round(prob * 100, 2)

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# MODEL INFO
# =========================
@app.route("/model-info", methods=["GET"])
def model_info():

    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        coef = model.coef_[0]
        intercept = model.intercept_[0]

        table = []
        for i, col in enumerate(columns):
            table.append({
                "feature": col,
                "coefficient": float(coef[i])
            })

        return jsonify({
            "model_type": "Logistic Regression",
            "intercept": float(intercept),
            "table": table
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)