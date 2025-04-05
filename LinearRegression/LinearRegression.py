import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, root_mean_squared_error
import matplotlib.pyplot as plt
import joblib

if __name__ == "__main__":
    file_path = '../data/daily_ridership_weather_holi_data.csv'
    df = pd.read_csv(file_path, parse_dates=['date'])

    numeric_columns = [
        'temperature_2m_max', 'temperature_2m_min', 'temperature_2m_mean',
        'apparent_temperature_max', 'apparent_temperature_min', 'apparent_temperature_mean',
        'sunrise', 'sunset', 'daylight_duration', 'sunshine_duration',
        'precipitation_sum', 'rain_sum', 'snowfall_sum', 'precipitation_hours',
        'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant',
        'shortwave_radiation_sum', 'et0_fao_evapotranspiration', 'weekend', 'is_holiday'
    ]

    df[numeric_columns] = df[numeric_columns].astype('float64')
    df = df.drop(columns=['date', 'weather_code', 'weather_categories', 'holidayName'])
    X = df.drop(columns=['ridership'])
    y = df['ridership']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()

    model.fit(X_train, y_train)

    joblib.dump(model, './linear_regression_model.pkl')
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    rmse_train = root_mean_squared_error(y_pred_train, y_train)
    rmse_test = root_mean_squared_error(y_pred_test, y_test)
    with open("best_rmse_results.txt", "w") as file:
        file.write(f"Train RMSE: {rmse_train}\n")
        file.write(f"Test RMSE: {rmse_test}\n")
        file.write(f"Mean: {df['ridership'].mean()}\n")
