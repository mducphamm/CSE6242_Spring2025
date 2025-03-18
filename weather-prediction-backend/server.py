from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/model', methods=['POST'])
def receive_data():
    # Get the JSON data from the request
    data = request.get_json()

    model = joblib.load('LinearRegression/linear_regression_model.pkl')
    print("Received data:", data)

    expected_fields = [
        'temperature_2m_max', 'temperature_2m_min', 'temperature_2m_mean',
        'apparent_temperature_max', 'apparent_temperature_min', 'apparent_temperature_mean',
        'sunrise', 'sunset', 'daylight_duration', 'sunshine_duration',
        'precipitation_sum', 'rain_sum', 'snowfall_sum', 'precipitation_hours',
        'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant',
        'shortwave_radiation_sum', 'et0_fao_evapotranspiration', 'weekend'
    ]


    df = pd.DataFrame([data])
    df = df.fillna(0.0)
    # Print the DataFrame for debugging (optional)
    print("DataFrame:\n", df)
    predictions = model.predict(df)
    print(predictions[0])
    return jsonify({"number": predictions[0]})

if __name__ == '__main__':
    app.run(debug=True, port=8000)