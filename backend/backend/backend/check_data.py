import pandas as pd
import kagglehub
import os

path = kagglehub.dataset_download(
    "pavansubhasht/ibm-hr-analytics-attrition-dataset"
)

file_path = os.path.join(path, "WA_Fn-UseC_-HR-Employee-Attrition.csv")

df = pd.read_csv(file_path)

print(df.shape)
print(df.head())