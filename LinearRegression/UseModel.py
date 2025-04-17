# Example how to use
import joblib
import pandas as pd

model = joblib.load('LinearRegression/linear_regression_model.pkl')
file_path = './LinearRegression/joined_data.csv'
df = pd.read_csv(file_path, parse_dates=['date'])

numeric_columns = [
    'temperature_2m_max', 'temperature_2m_min', 'temperature_2m_mean',
    'apparent_temperature_max', 'apparent_temperature_min', 'apparent_temperature_mean',
    'sunrise', 'sunset', 'daylight_duration', 'sunshine_duration',
    'precipitation_sum', 'rain_sum', 'snowfall_sum', 'precipitation_hours',
    'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant',
    'shortwave_radiation_sum', 'et0_fao_evapotranspiration', 'weekend'
]

df[numeric_columns] = df[numeric_columns].astype('float64')

df_1 = df.drop(columns=['ridership'])
df_1 = df_1.drop(columns=['date'])
row_for_prediction = df_1.iloc[0].values.reshape(1, -1)

print(df.iloc[0])
predictions = model.predict(row_for_prediction)
print(f"Predicted Ridership: {predictions[0]}")