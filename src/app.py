from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for specific origin (React frontend running on localhost:5173)
CORS(app, origins="http://localhost:5173")  # Adjust if needed

# Load the crop prediction model
crop_model_path = "crop_prediction_model.pkl"
try:
    crop_model = joblib.load(crop_model_path)
except Exception as e:
    print(f"Error loading crop prediction model: {e}")
    crop_model = None

# Load the water quality models (Assuming models are saved as pickle files)
water_quality_models_path = "catboost_models.pkl"  # Adjust the path to where your models are saved
try:
    water_quality_models = joblib.load(water_quality_models_path)
except Exception as e:
    print(f"Error loading water quality models: {e}")
    water_quality_models = None

# Handle Preflight requests (OPTIONS) to fix CORS errors
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request handled'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

# Crop Prediction Endpoint
@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    try:
        # Ensure the crop prediction model is loaded
        if crop_model is None:
            return jsonify({"error": "Crop prediction model is not loaded properly."})

        # Get input data for crop prediction
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"})

        # Extract features for crop prediction
        features = np.array([data['N'], data['P'], data['K'], data['temperature'], data['humidity'], data['ph'], data['rainfall']]).reshape(1, -1)

        # Make crop prediction
        if hasattr(crop_model, 'predict'):
            crop_prediction = crop_model.predict(features)
            label_mapping = {
                0: 'Rice', 1: 'Maize', 2: 'Chickpea', 3: 'Kidneybeans', 4: 'Pigeonpeas', 5: 'Mothbeans',
                6: 'Mungbean', 7: 'Blackgram', 8: 'Lentil', 9: 'Pomegranate', 10: 'Banana', 11: 'Mango',
                12: 'Grapes', 13: 'Watermelon', 14: 'Muskmelon', 15: 'Apple', 16: 'Orange', 17: 'Papaya',
                18: 'Coconut', 19: 'Cotton', 20: 'Jute', 21: 'Coffee'
            }
            predicted_crop = label_mapping.get(crop_prediction[0], "Unknown")
            return jsonify({"prediction": predicted_crop})
        else:
            return jsonify({"error": "Model does not have a 'predict' method."})
            
        if fertilizer_model and fertilizer_scaler:
            npk_features = np.array([[data['N'], data['P'], data['K']]])
            npk_features_scaled = fertilizer_scaler.transform(npk_features)
            fertilizer_prediction = fertilizer_model.predict(npk_features_scaled)
            fertilizer_mapping = {0: 'Urea', 1: 'DAP', 2: 'NPK', 3: 'Organic Fertilizer'}
            recommended_fertilizer = fertilizer_mapping.get(fertilizer_prediction[0], "Unknown")
            print(f"🌱 Recommended Fertilizer: {recommended_fertilizer}")

        return jsonify({
            "prediction": predicted_crop,
            "fertilizer": recommended_fertilizer
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# Water Quality Prediction Endpoint
@app.route('/predict_water_quality', methods=['POST'])
def predict_water_quality():
    try:
        # Ensure the water quality models are loaded
        if water_quality_models is None:
            return jsonify({"error": "Water quality models are not loaded properly."})

        # Get input data for water quality prediction
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"})

        # Extract features for water quality prediction
        ph = data['ph']
        hardness = data['hardness']
        solids = data['solids']
        input_data = np.array([[ph, hardness, solids]])

        # Make water quality predictions
        chloramines = water_quality_models['catboost_chloramines'].predict(input_data)[0] / 1000
        sulfate = water_quality_models['catboost_sulfate'].predict(input_data)[0] / 1000
        organic_carbon = water_quality_models['catboost_organic_carbon'].predict(input_data)[0]
        potability = water_quality_models['catboost_potability'].predict(input_data)[0]

        # Potability status
        potability_status = "Safe for consumption" if potability >= 0.5 else "Not safe for consumption"

        # Return the water quality report
        return jsonify({
            'chloramines': round(chloramines, 2),
            'sulfate': round(sulfate, 2),
            'organicCarbon': round(organic_carbon, 2),
            'potability': potability_status
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)