import math

import pandas as pd

import RTLearner as rt
import BagLearner as bl

if __name__ == "__main__":
    bagLearners = []
    for i in range(5, 15):
        bagLeaner = bl.BagLearner(learner=rt.RTLearner, kwargs={"leaf_size": i+1}, bags=25, verbose=False)
        bagLearners.append(bagLeaner)

    file_path = '../data/daily_ridership_weather_holi_data.csv'
    df = pd.read_csv(file_path, parse_dates=['date'])

    # numeric_columns = [
    #     'temperature_2m_max', 'temperature_2m_min', 'temperature_2m_mean',
    #     'apparent_temperature_max', 'apparent_temperature_min', 'apparent_temperature_mean',
    #     'sunrise', 'sunset', 'daylight_duration', 'sunshine_duration',
    #     'precipitation_sum', 'rain_sum', 'snowfall_sum', 'precipitation_hours',
    #     'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant',
    #     'shortwave_radiation_sum', 'et0_fao_evapotranspiration', 'weekend'
    # ]
    df = df.drop(columns=['date','weather_categories','holidayName'])
    df = df.astype('float64')
    X = df.drop(columns=['ridership'])
    X = X.to_numpy()
    y = df['ridership'].to_numpy()

    train_rows = int(0.6 * df.shape[0])
    X_train = X[:train_rows]
    X_test = X[train_rows:]
    y_train = y[:train_rows]
    y_test = y[train_rows:]

    train_results = []
    test_results = []
    # print(X_train)
    # print(y_train)
    for bagLearner in bagLearners:
        bagLearner.add_evidence(X_train, y_train)

        pred_y = bagLearner.query(X_train)
        rmse = math.sqrt(((y_train - pred_y) ** 2).sum() / y_train.shape[0])
        train_results.append(rmse)

        pred_y = bagLearner.query(X_test)  # get the predictions
        rmse = math.sqrt(((y_test - pred_y) ** 2).sum() / y_test.shape[0])
        test_results.append(rmse)

    print(train_results)
    print(test_results)