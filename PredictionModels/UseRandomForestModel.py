# Example how to use
import joblib
import pandas as pd
import numpy as np

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

if __name__ == "__main__":
    model_file_path = 'best_random_forest_model.pkl' 
    scaler_file_path = 'scaler_temporal_features.pkl' 

    # Load the model and scaler
    loaded_model, loaded_scaler = load_model_and_scaler(model_file_path, scaler_file_path)

    if loaded_model and loaded_scaler:
        # --- Get input data for prediction ---
        input_data = { # This input data will be coming from the FRONT END USER INTERACTION
            'date': ['2025-04-15'],  
            'temperature_2m_mean': [15.0],
            'daylight_duration': [13.5],
            'sunshine_duration': [10.0],
            'precipitation_sum': [0.0],
            'snowfall_sum': [0.0],
            'wind_speed_10m_max': [5.0],
            'wind_direction_10m_dominant': [270],
            'shortwave_radiation_sum': [20.0],
            'weekend': [0],
            'is_holiday': [0],
            'apparent_temp_range': [10.0],
            'temp_2m_range': [8.0],
            'weather_categories_Clear or Fair Weather': [1],
            'weather_categories_Precipitation (Light to Moderate)': [0],
            'weather_categories_Severe Weather': [0]
            #'month', 'day', 'day_of_week', 'day_of_week_sin', 'day_of_week_cos' will be generated from the 'date' column 
            # using preprocess_date()
            
        }
        input_df = pd.DataFrame(input_data)

        # Preprocess the date temproal feature ---
        input_df_processed_date = preprocess_date(input_df.copy())

        # Select the features that were used for training. Very import to have the same order of columns that was used for RandomForest training
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

            # Preprocess and scale all features using the loaded scaler that was used for model training
            scaled_features_df = preprocess_features(input_df_for_scaling, loaded_scaler)

            if scaled_features_df is not None:
                # Make the prediction 
                prediction = make_prediction(loaded_model, scaled_features_df)

                if prediction is not None:
                    print("Daily NYC Subway Ridership Prediction:", prediction)
                else:
                    print("Prediction failed.")
            else:
                print("Feature scaling failed.")
        else:
            print("Error: Not all required features are present in the input data.")
            missing_features = [col for col in feature_columns_to_scale if col not in input_df_processed_date.columns]
            print("Missing features:", missing_features)

    else:
        print("Failed to load model or scaler.")