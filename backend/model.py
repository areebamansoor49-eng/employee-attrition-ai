import pandas as pd
import kagglehub
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# =========================
# 1. LOAD DATASET
# =========================
path = kagglehub.dataset_download(
    "pavansubhasht/ibm-hr-analytics-attrition-dataset"
)

file_path = os.path.join(
    path,
    "WA_Fn-UseC_-HR-Employee-Attrition.csv"
)

df = pd.read_csv(file_path)

# =========================
# 2. TARGET
# =========================
df["Attrition"] = df["Attrition"].map({
    "Yes": 1,
    "No": 0
})

# =========================
# 3. ENCODE CATEGORICAL COLUMNS
# =========================
cat_cols = df.select_dtypes(include=["object"]).columns

for col in cat_cols:
    df[col] = LabelEncoder().fit_transform(df[col])

# =========================
# 4. FEATURES & TARGET
# =========================
X = df.drop("Attrition", axis=1)
y = df["Attrition"]

# =========================
# SAVE COLUMN NAMES
# =========================
model_columns = X.columns.tolist()
joblib.dump(model_columns, "columns.pkl")

# =========================
# 5. FEATURE SCALING
# =========================
scaler = StandardScaler()
X = scaler.fit_transform(X)

# =========================
# 6. TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =========================
# 7. MODEL TRAINING
# =========================
model = LogisticRegression(max_iter=5000)

model.fit(X_train, y_train)

# =========================
# 8. EVALUATION
# =========================
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))

# =========================
# 9. SAVE FILES
# =========================
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Model saved as model.pkl")
print("Scaler saved as scaler.pkl")
print("Columns saved as columns.pkl")