import pickle

# model load karo
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# example input (isko apne model ke hisaab se change karna hoga)
sample_input = [[1, 2, 3, 4]]

# prediction
result = model.predict(sample_input)

print("Prediction:", result)
print("test.py is running")