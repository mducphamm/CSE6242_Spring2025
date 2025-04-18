from flask import Flask, request, jsonify
from flask_cors import CORS  
import pandas as pd
import numpy as np
import json
import joblib

app = Flask(__name__)
CORS(app)

def preprocess_date(df):
    # Preprocesses the date feature by extracting relevant components.
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['day_of_week'] = df['date'].dt.dayofweek  # Monday=0, Sunday=6
    df['day_of_week_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['day_of_week_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)

    df = df.drop('date', axis=1)
    return df

def load_model_and_scaler(model_path, scaler_path):
    # Loads the trained model and scaler from the specified file paths.
    try:
        with open(model_path, 'rb') as file:
            print('File name', file)
            model = joblib.load(file)
    except FileNotFoundError:
        print(f"Error: Model file not found at {model_path}")
        model = None

    try:
        with open(scaler_path, 'rb') as file:
            scaler = joblib.load(file)
    except FileNotFoundError:
        print(f"Error: Scaler file not found at {scaler_path}")
        scaler = None

    return model, scaler

def preprocess_features(data, scaler):
    # Preprocesses the input features using the loaded scaler.
    if scaler is None:
        print("Error: Scaler not loaded. Cannot preprocess features.")
        return None
    scaled_data = scaler.transform(data)
    scaled_df = pd.DataFrame(scaled_data, columns=data.columns)
    return scaled_df

def make_prediction(model, preprocessed_data):
    # Makes predictions using the loaded model and preprocessed data.
    if model is None:
        print("Error: Model not loaded. Cannot make predictions.")
        return None
    predictions = model.predict(preprocessed_data)
    return predictions

@app.route('/model', methods=['POST'])
def receive_data():
    # Initialize ridership_prediction with a default value
    ridership_prediction = 0
    
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        model_randomforest = './best_random_forest_model.pkl' # joblib.load()
        scaler_file_path = './scaler_temporal_features.pkl' 

        # Load the model and scaler
        loaded_model, loaded_scaler = load_model_and_scaler(model_randomforest, scaler_file_path)

        print("Received data \n:", data)
        print('data type: ', {type(data)})

        # Transform the dictionary to the desired format
        input_data = {
            'date': [data.get('date')],  # Wrap the value in a list
            'temperature_2m_mean': [float(data.get('temperature_2m_mean')) if data.get('temperature_2m_mean') else None],
            'daylight_duration': [float(data.get('daylight_duration')) if data.get('daylight_duration') else None],
            'sunshine_duration': [float(data.get('sunshine_duration')) if data.get('sunshine_duration') else None],
            'precipitation_sum': [float(data.get('precipitation_sum')) if data.get('precipitation_sum') else None],  # Fixed typo here
            'snowfall_sum': [float(data.get('snowfall_sum')) if data.get('snowfall_sum') else None],
            'wind_speed_10m_max': [float(data.get('wind_speed_10m_max')) if data.get('wind_speed_10m_max') else None],
            'wind_direction_10m_dominant': [int(data.get('wind_direction_10m_dominant')) if data.get('wind_direction_10m_dominant') else None],
            'shortwave_radiation_sum': [float(data.get('shortwave_radiation_sum')) if data.get('shortwave_radiation_sum') else None],
            'weekend': [int(data.get('weekend')) if data.get('weekend') else None],
            'is_holiday': [int(data.get('is_holiday')) if data.get('is_holiday') else None],
            'apparent_temp_range': [float(data.get('apparent_temp_range')) if data.get('apparent_temp_range') else None],
            'temp_2m_range': [float(data.get('temp_2m_range')) if data.get('temp_2m_range') else None],
            'weather_categories_Clear or Fair Weather': [int(data.get('Clear_or_FairWeather')) if data.get('Clear_or_FairWeather') else None],
            'weather_categories_Precipitation (Light to Moderate)': [int(data.get('Light_to_Moderate')) if data.get('Light_to_Moderate') else None],
            'weather_categories_Severe Weather': [int(data.get('Severe_Weather')) if data.get('Severe_Weather') else None]
        }
        print("Processed input data: \n", input_data)
        input_df = pd.DataFrame(input_data)
        
        # Preprocess the date temporal feature
        input_df_processed_date = preprocess_date(input_df.copy())

        # Select the features that were used for training
        feature_columns_to_scale = [
            'temperature_2m_mean', 'daylight_duration', 'sunshine_duration',
            'precipitation_sum', 'snowfall_sum', 'wind_speed_10m_max',
            'wind_direction_10m_dominant', 'shortwave_radiation_sum', 'weekend',
            'is_holiday', 'apparent_temp_range', 'temp_2m_range',
            'weather_categories_Clear or Fair Weather',
            'weather_categories_Precipitation (Light to Moderate)',
            'weather_categories_Severe Weather', 'month', 'day', 'day_of_week',
            'day_of_week_sin', 'day_of_week_cos'
        ]
        
        # Ensure all required columns are present
        if all(col in input_df_processed_date.columns for col in feature_columns_to_scale):
            input_df_for_scaling = input_df_processed_date[feature_columns_to_scale]

            # Preprocess and scale all features
            scaled_features_df = preprocess_features(input_df_for_scaling, loaded_scaler)
            print("\n Scaled Features :", scaled_features_df)

            if scaled_features_df is not None:
                # Make the prediction 
                prediction = make_prediction(loaded_model, scaled_features_df)
                if prediction is not None:
                    ridership_prediction = round(prediction[0])
                    print("Daily NYC Subway Ridership Prediction:", ridership_prediction)
                else:
                    print("Prediction failed.")
            else:
                print("Feature scaling failed.")
        else:
            missing_features = [col for col in feature_columns_to_scale if col not in input_df_processed_date.columns]
            print("Error: Not all required features are present in the input data.")
            print("Missing features:", missing_features)
            
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500
        
    return jsonify({"number": ridership_prediction})

if __name__ == '__main__':
    app.run(debug=True, port=8000)