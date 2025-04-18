# combines the weather_data with ridership, and Federal & NYC public holiday data
# and saves it under data folder for EDA and further data processing

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

# adding more NYC Public school holidays and recess
# manually adding NYC Public School holidays from calander: https://www.schools.nyc.gov/calendar/2022-2023-school-year-calendar
holiday_dict = {
    #2021
    '2021-06-19': 'Juneteenth',
    '2021-09-16': 'Yom Kippur',
    '2021-10-11': 'Italian Heritage / Indigenous Peoples Day',
    '2021-11-02': 'Election Day',
    '2021-11-11': 'Veterans Day',
    '2021-11-04': 'Diwali',
    '2021-11-26': 'Thanksgiving Recess',
    '2021-11-27': 'Thanksgiving Recess',
    '2021-11-28': 'Thanksgiving Recess',
    '2021-12-24': 'Winter Recess',
    '2021-12-26': 'Christmass Recess',
    '2021-12-31': 'New Years Eve',

    #2022
    '2022-02-01': 'Lunar Newyear',
    '2022-02-21': 'Midwinter Recess',
    '2022-02-25': 'Midwinter Recess',
    '2022-04-15': 'Spring Recess',
    '2022-04-16': 'Spring Recess',
    '2022-04-17': 'Spring Recess',
    '2022-04-18': 'Spring Recess',
    '2022-04-22': 'Spring Recess',
    '2022-05-02': 'Eid al-Fitr',
    '2022-06-19': 'Juneteenth',
    '2022-06-20': 'Juneteenth Recess',
    '2022-09-27': 'Rosh Hashanah',
    '2022-10-05': 'Yom Kippur',
    '2022-10-10': 'Italian Heritage / Indigenous Peoples Day',
    '2022-11-08': 'Election Day',
    '2022-11-11': 'Veterans Day',
    '2022-11-25': 'Thanksgiving Recess',
    '2022-11-26': 'Thanksgiving Recess',
    '2022-11-27': 'Thanksgiving Recess',
    '2022-12-24': 'Christmas Eve ',
    '2022-12-26': 'Winter Recess',
    '2022-12-31': 'New Years Eve',

    #2023
    '2023-01-02': 'Winter Recess',
    '2023-02-20': 'Midwinter Recess',
    '2023-02-24': 'Midwinter Recess',
    '2023-04-06': 'First Day of Passover',
    '2023-04-07': 'Second Day of Passover',
    '2023-04-10': 'Spring Recess',
    '2023-04-11': 'Spring Recess',
    '2023-04-12': 'Spring Recess',
    '2023-04-13': 'Spring Recess',
    '2023-04-14': 'Spring Recess',
    '2023-04-21': 'Eid al-Fitr',
    '2023-06-19': 'Juneteenth',
    '2023-09-15': 'Yom Kippur',
    '2023-09-16': 'Rosh Hashanah',
    '2023-09-17': 'Rosh Hashanah',
    '2023-10-09': 'Italian Heritage / Indigenous Peoples Day',
    '2023-11-07': 'Election Day',
    '2023-11-11': 'Veterans Day',
    '2023-11-12': 'Diwali',
    '2023-11-24': 'Thanksgiving Recess',
    '2023-11-25': 'Thanksgiving Recess',
    '2023-11-26': 'Thanksgiving Recess',
    '2023-12-23': 'Christmass Eve Recess',
    '2023-12-24': 'Christmass Eve',
    '2023-12-31': 'New Years Eve',

    #2024
    '2024-02-10': 'Lunar Newyear',
    '2024-02-12': 'Midwinter Recess',
    '2024-02-23': 'Midwinter Recess',
    '2024-03-29': 'Easter Weekend',
    '2024-04-01': 'Easter Weekend',
    '2024-04-10': 'Eid al-Fitr',
    '2024-04-22': 'Spring Recess',
    '2024-04-30': 'Spring Recess',
    '2024-06-07': 'Clerical Day',
    '2024-06-17': 'Eid al-Adha',
    '2024-06-19': 'Juneteenth',
    '2024-09-03': 'Rosh Hashanah',
    '2024-09-04': 'Rosh Hashanah',
    '2024-10-14': 'Italian Heritage/Indigenous Peoples Day',
    '2024-11-01': 'Diwali',
    '2024-11-05': 'Election Day',
    '2024-11-11': 'Veterans Day',
    '2024-11-29': 'Thanksgiving Recess',
    '2024-11-30': 'Thanksgiving Recess',
    '2024-12-23': 'Winter Recess',
    '2024-12-24': 'Christmas Eve',
    '2024-12-26': 'Christmas Recess',
    '2024-12-27': 'Christmas Recess',
    '2024-12-31': 'New Years Eve',

}
for date_str, holiday_name in holiday_dict.items():
    date_datetime = pd.to_datetime(date_str)
    mask = daily_RWH_df['date'] == date_datetime
    daily_RWH_df.loc[mask, 'holidayName'] = holiday_name
    daily_RWH_df.loc[mask, 'is_holiday'] = 1


# exporting daily ridership weather holiday data
output_file = "./data/daily_ridership_weather_holi_data.csv"
daily_RWH_df.to_csv(output_file, index=False)

