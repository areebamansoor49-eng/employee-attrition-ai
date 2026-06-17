import pandas as pd
import kagglehub
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

# =========================
# 1. Load dataset
# =========================
path = kagglehub.dataset_download(
    "pavansubhasht/ibm-hr-analytics-attrition-dataset"
)

file_path = path + "/WA_Fn-UseC_-HR-Employee-Attrition.csv"
df = pd.read_csv(file_path)

# =========================
# 2. Basic cleaning
# =========================
if "EmployeeNumber" in df.columns:
    df = df.drop("EmployeeNumber", axis=1)

df["Attrition"] = df["Attrition"].map({"Yes": 1, "No": 0})

# =========================
# 3. Features & target
# =========================
X = df.drop("Attrition", axis=1)
y = df["Attrition"]

# One-hot encoding
X = pd.get_dummies(X)

# =========================
# 4. Train-test split
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =========================
# 5. SMOTE (balance data)
# =========================
sm = SMOTE(random_state=42)
X_train, y_train = sm.fit_resample(X_train, y_train)

# =========================
# 6. Model
# =========================
model = RandomForestClassifier(
    n_estimators=400,
    random_state=42,
    class_weight="balanced_subsample"
)

model.fit(X_train, y_train)

# =========================
# 7. Prediction (WITH THRESHOLD TUNING)
# =========================
y_proba = model.predict_proba(X_test)[:, 1]
y_pred = (y_proba > 0.3).astype(int)   # IMPORTANT FIX

# =========================
# 8. Evaluation
# =========================
print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))