import numpy as np
import joblib

# Load the scaler for normalization
scaler = joblib.load("C:/Users/p/Desktop/felise-ai/lastest_backend/preprocessing/scaler.pkl")

def preprocess_keypoints(keypoints):
    """
    Preprocess keypoints:
    - Validate input shape
    - Normalize using the scaler
    - Reshape into (1, 88, 1) to match model input
    """
    if len(keypoints) != 88:
        raise ValueError("Keypoints must contain exactly 88 values.")
    
    # Normalize the keypoints
    keypoints = scaler.transform([keypoints])  # shape: (1, 88)

    # Reshape to (1, 88, 1) - Add batch dimension and feature dimension
    keypoints = keypoints.reshape(1, 88, 1)
    return keypoints
