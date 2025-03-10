import pandas as pd

# Replace this with the path to your CSV file
file_path = './Weather/weather_data.csv'

# Read the CSV into a DataFrame, parse the 'date' column
df = pd.read_csv(file_path, parse_dates=['date'])

# Drop the 'weather_code' column
df = df.drop(columns=['weather_code'])

# Convert the 'date' column to the desired format (year-month-day)
df['date'] = df['date'].dt.strftime('%Y-%m-%d')

# Ensure the correct data types
df = df.astype({
    'temperature_2m_max': 'float64',
    'temperature_2m_min': 'float64',
    'temperature_2m_mean': 'float64',
    'apparent_temperature_max': 'float64',
    'apparent_temperature_min': 'float64',
    'apparent_temperature_mean': 'float64',
    'sunrise': 'int64',
    'sunset': 'int64',
    'daylight_duration': 'float64',
    'sunshine_duration': 'float64',
    'precipitation_sum': 'float64',
    'rain_sum': 'float64',
    'snowfall_sum': 'float64',
    'precipitation_hours': 'float64',
    'wind_speed_10m_max': 'float64',
    'wind_gusts_10m_max': 'float64',
    'wind_direction_10m_dominant': 'float64',
    'shortwave_radiation_sum': 'float64',
    'et0_fao_evapotranspiration': 'float64',
    'weekend': 'int64'
})

rider_df = pd.read_csv("./ridership.csv", parse_dates=['date'])

# Aggregate the 'ridership' by 'date'
aggregated_df = rider_df.groupby('date')['ridership'].sum().reset_index()

df['date'] = pd.to_datetime(df['date'])
aggregated_df['date'] = pd.to_datetime(aggregated_df['date'])
merged_df = pd.merge(df, aggregated_df, on='date', how='left')
output_file = "./joined_data.csv"
merged_df.to_csv(output_file, index=False)
