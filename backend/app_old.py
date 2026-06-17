from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load files
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
columns = joblib.load("columns.pkl")

@app.route("/")
def home():
    return "HR Attrition Prediction API Running"

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    # Create dataframe
    df = pd.DataFrame([data])

    # Ensure same columns as training
    for col in columns:
        if col not in df.columns:
            df[col] = 0

    df = df[columns]

    # Scale
    df_scaled = scaler.transform(df)

    # Predict
    prediction = model.predict(df_scaled)

    result = "Employee May Leave" if prediction[0] == 1 else "Employee Likely Stay"

    return jsonify({
        "prediction": int(prediction[0]),
        "result": result
    })

if __name__ == "__main__":
    app.run(debug=True)