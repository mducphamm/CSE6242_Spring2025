import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import joblib


file_path = './joined_data.csv'
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

X = df.drop(columns=['ridership'])
y = df['ridership']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()

model.fit(X_train, y_train)

joblib.dump(model, './LinearRegression/linear_regression_model.pkl')
y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse}")
print(f"R-squared: {r2}")

plt.scatter(y_test, y_pred)
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red', linestyle='--')
plt.xlabel('Actual Ridership')
plt.ylabel('Predicted Ridership')
plt.title('Actual vs Predicted Ridership')
plt.savefig("Linear Regression Model Test.png")

print(f"Coefficients: {model.coef_}")
print(f"Intercept: {model.intercept_}")