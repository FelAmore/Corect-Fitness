import tensorflow as tf
import numpy as np

# Load your model
model = tf.keras.models.load_model('backend/models/squats/transformer/transformer_error-label.keras')

# Prepare your keypoints data
keypoints = [[ 0.50529944],
  [-0.01582467],
  [ 0.37720361],
  [ 0.98264993],
  [ 0.44437575],
  [-0.10807171],
  [ 0.80705842],
  [ 0.8789843 ],
  [ 0.49771291],
  [-0.04601154],
  [ 0.34295997],
  [ 0.97707631],
  [ 0.45678867],
  [-0.08826545],
  [ 0.79838965],
  [ 0.05211032],
  [ 0.42656092],
  [ 0.05282086],
  [ 0.42206521],
  [ 0.93390007],
  [ 0.40421654],
  [ 0.02290671],
  [ 0.69867821],
  [ 0.09640799],
  [ 0.41995697],
  [ 0.07938608],
  [ 0.41693558],
  [ 0.90680944],
  [ 0.40669034],
  [ 0.04545127],
  [ 0.70463029],
  [ 0.12237927],
  [ 0.40910466],
  [ 0.0884236 ],
  [ 0.44370615],
  [ 0.90519013],
  [ 0.40048346],
  [ 0.07584451],
  [ 0.68280613],
  [ 0.1244008 ],
  [ 0.41176331],
  [ 0.08572448],
  [ 0.43536917],
  [ 0.8355826 ],
  [ 0.39967125],
  [ 0.0759908 ],
  [ 0.68758442],
  [ 0.12208863],
  [ 0.57722639],
  [ 0.62273695],
  [ 0.14678815],
  [ 0.93749466],
  [ 0.68762379],
  [ 0.52399308],
  [ 0.85404064],
  [ 0.47929223],
  [ 0.50306282],
  [ 0.71935222],
  [-0.00608747],
  [ 0.99641292],
  [ 0.51622401],
  [ 0.58765334],
  [ 0.63520976],
  [ 0.33751188],
  [ 0.54476434],
  [ 1.09416123],
  [ 0.07832664],
  [ 1.00098905],
  [ 0.56421693],
  [ 1.03048942],
  [ 0.5553664 ],
  [ 0.55316937],
  [ 0.57606957],
  [ 1.11650504],
  [ 0.08891627],
  [ 0.99472754],
  [ 0.58789425],
  [ 1.10851914],
  [ 0.54860519],
  [ 0.67380163],
  [ 0.50505788],
  [ 0.94868385],
  [ 0.10481117],
  [ 0.99904131],
  [ 0.53331624],
  [ 0.87583665],
  [ 0.60524356],
  [ 0.73177741]
  ]
    


# Convert keypoints to a NumPy array and reshape to (1, 88, 1)
keypoints = np.array(keypoints).reshape((1, 88, 1))  # Shape: (batch_size=1, 88, 1)

# Make a prediction
prediction = model.predict(keypoints)

# Print the prediction result
print("Prediction:", prediction)
