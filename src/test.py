import joblib
import numpy as np
import pandas as pd

# Load the model
model_path = 'crop_prediction_model.pkl'  # Adjust if necessary
model = joblib.load(model_path)

# Define the correct column names that the model was trained on
columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

# Create a DataFrame with the correct column names
test_input = pd.DataFrame([[50, 60, 40, 40, 80, 6.5, 150]], columns=columns)

# Make a prediction
prediction = model.predict(test_input)
label_mapping = {
    0: 'rice', 1: 'maize', 2: 'chickpea', 3: 'kidneybeans', 4: 'pigeonpeas', 5: 'mothbeans',
    6: 'mungbean', 7: 'blackgram', 8: 'lentil', 9: 'pomegranate', 10: 'banana', 11: 'mango',
    12: 'grapes', 13: 'watermelon', 14: 'muskmelon', 15: 'apple', 16: 'orange', 17: 'papaya',
    18: 'coconut', 19: 'cotton', 20: 'jute', 21: 'coffee'
}

# Correctly map the prediction value
predicted_crop = label_mapping[prediction[0]]

print("Prediction:", predicted_crop)
