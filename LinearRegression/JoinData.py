import pandas as pd
import datetime
from azureml.opendatasets import PublicHolidays # You need to pip install azureml-opendatasets 
from datetime import datetime
from dateutil import parser
from dateutil.relativedelta import relativedelta
import pandas as pd

end_date = datetime.today()
start_date = datetime.today() - relativedelta(months=51)
hol = PublicHolidays(start_date=start_date, end_date=end_date)
hol_df = hol.to_pandas_dataframe()

# Replace this with the path to your CSV file
file_path = '../Weather/weather_data.csv'

# Read the CSV into a DataFrame, parse the 'date' column
df = pd.read_csv(file_path, parse_dates=['date'])

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

##======== KG
# categorizing weather_code into five categorizes based on the severity of the weather: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
# Define the bins and labels as per the nodc.noaa.gov WMO Categories
bins = [0, 19, 29, 39, 49, 69, 79, 99]
labels = [
    "Clear or Fair Weather",
    "Precipitation (Light to Moderate)",
    "Severe Weather",
    "Fog or Ice Fog",
    "Precipitation (Light to Moderate)",
    "Severe Weather",
    "Thunderstorms"
]

thunderstorm_codes = [9, 17, 27, 29] + list(range(91, 100))

def categorize_weather(code):
    if code in thunderstorm_codes:
        return "Thunderstorms"
    elif 0 <= code <= 19:
        return "Clear or Fair Weather"
    elif 20 <= code <= 29 or 50 <= code <= 69:
        return "Precipitation (Light to Moderate)"
    elif 30 <= code <= 39 or 70 <= code <= 79 or 80 <= code <= 90:
        return "Severe Weather"
    elif 40 <= code <= 49:
        return "Fog or Ice Fog"
    else:
        return "Unknown"  
    
df['weather_categories'] = df['weather_code'].apply(categorize_weather)
###=========

rider_df = pd.read_csv("../ridership.csv", parse_dates=['date'])

# Aggregate the 'ridership' by 'date'
aggregated_df = rider_df.groupby('date')['ridership'].sum().reset_index()

df['date'] = pd.to_datetime(df['date'])
aggregated_df['date'] = pd.to_datetime(aggregated_df['date'])
daily_weather_data = pd.merge(df, aggregated_df, on='date', how='left')

# pulling holiday data from Azure opendataset: KG
us_hol_df = hol_df[hol_df['countryOrRegion'] =='United States']
us_hol_clean_df = us_hol_df.sort_values(by = 'date', ascending=True)
us_hol_clean_df = us_hol_clean_df[(us_hol_clean_df['date'] >= '2021-06-01') & (us_hol_clean_df['date'] < '2025-01-01')]
us_hol_clean_df = us_hol_clean_df[['holidayName', 'date']]

# merging into daily weather data: KG
daily_weather_data['date'] = pd.to_datetime(daily_weather_data['date'])
us_hol_clean_df['date'] = pd.to_datetime(us_hol_clean_df['date'])
daily_RWH_df = daily_weather_data.merge(us_hol_clean_df, how='left', on = 'date') #RWH: Ridership Weather Holiday
daily_RWH_df['holidayName'] = daily_RWH_df['holidayName'].fillna('No holiday')
daily_RWH_df['is_holiday'] = daily_RWH_df['holidayName'].apply(lambda x: 1 if x != 'No holiday' else 0)

# exporting daily ridership weather holiday data
output_file = "./daily_ridership_weather_holi_data.csv"
daily_RWH_df.to_csv(output_file, index=False)

