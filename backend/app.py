from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
import traceback
from utils.preprocessing import preprocess_keypoints  # Your preprocessing function

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


# Helper function to convert non-serializable data
def convert_to_serializable(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()  # Convert NumPy arrays to lists
    elif isinstance(obj, (np.float32, np.float64)):
        return float(obj)  # Convert NumPy floats to Python floats
    elif isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}  # Recursively handle dicts
    elif isinstance(obj, list):
        return [convert_to_serializable(i) for i in obj]  # Recursively handle lists
    return obj  # Already serializable


# Load models based on user input
def load_model(exercise, model_type, model_name):
    model_path = f'./models/{exercise}/{model_type}/{model_name}.keras'
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    return tf.keras.models.load_model(model_path)


# Predict feedback based on input keypoints
def predict_feedback(model, keypoints):
    
    processed_keypoints = preprocess_keypoints(keypoints)
    processed_keypoints = np.array(processed_keypoints).reshape(1, -1)
    prediction = model.predict(processed_keypoints)
    return prediction


def generate_feedback(exercise, model_type, keypoints):
    # Load the pose-label model to check for general posture correctness
    pose_model = load_model(exercise, model_type, f"{model_type}_pose-label")
    pose_prediction = predict_feedback(pose_model, keypoints)
    print(pose_prediction)
    feedback = "Good Posture"  # Default feedback

    # If the pose is incorrect, load the error-label model
    if pose_prediction[0][0] < 0.5:  # Assuming <0.5 means incorrect posture
        error_model = load_model(exercise, model_type, f"{model_type}_error-label")
        error_prediction = predict_feedback(error_model, keypoints)
        
        # Extract confidence scores
        low_confidence = error_prediction[0][1]
        high_confidence = error_prediction[0][2]

        print(f"Error Prediction: Low: {low_confidence}, High: {high_confidence}")  # Debugging

        # Determine specific error feedback
        if high_confidence > 0.5 and low_confidence < 0.5:
            feedback = "Posture too high, try lowering your body."
        elif low_confidence > 0.5 and high_confidence < 0.5:
            feedback = "Posture too low, try raising your hips."
        elif low_confidence > 0.9 and high_confidence > 0.9:
            feedback = "Perfect posture! Keep it up!"
        else:
            feedback = "Posture adjustment needed, but the type of error is unclear."
    
    return feedback



# Generalized Feedback Route
@app.route('/scan', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        exercise = data.get('exercise')
        model_type = data.get('model')
        keypoints = data.get('keypoints')

        if not exercise or not model_type or not keypoints:
            return jsonify({"error": "Missing required fields"}), 400

        feedback = generate_feedback(exercise, model_type, keypoints)
        return jsonify({"exercise": exercise, "model": model_type, "feedback": convert_to_serializable(feedback)})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Dynamic Exercise Route
@app.route('/exercise/<name>', methods=['POST'])
def exercise_predict(name):
    try:
        model_type = request.form.get("model")
        keypoints = request.form.get("keypoints")

        if not model_type or not keypoints:
            return jsonify({"error": "Missing required fields"}), 300

        keypoints = np.array(eval(keypoints))  # Convert JSON string back to list

        feedback = generate_feedback(name, model_type, keypoints)
        return jsonify({"exercise": name, "feedback": feedback})
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# Status Route
@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "OK"}), 200


# Squats Route
@app.route('/squats', methods=['POST'])
def handle_squats():
    response = jsonify('Test')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)