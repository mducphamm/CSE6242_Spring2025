import numpy as np
import pickle
import pandas as pd
import RTLearner as rt
import BagLearner as bl
import math


if __name__ == "__main__":
    bagLearners = []
    for i in range(5, 15):
        bagLearner = bl.BagLearner(learner=rt.RTLearner, kwargs={"leaf_size": i + 1}, bags=25, verbose=False)
        bagLearners.append(bagLearner)


    file_path = '../data/daily_ridership_weather_holi_data.csv'
    df = pd.read_csv(file_path, parse_dates=['date'])


    # Drop irrelevant columns
    df = df.drop(columns=['date', 'weather_code', 'weather_categories', 'holidayName'])
    df = df.astype('float64')


    # Handle missing data
    df = df.dropna()

    # print(df['ridership'].describe())
    # Prepare data
    X = df.drop(columns=['ridership']).to_numpy()
    # print(X[0])
    y = df['ridership'].to_numpy()


    # Train-test split
    train_rows = int(0.7 * df.shape[0])
    X_train = X[:train_rows]
    X_test = X[train_rows:]
    y_train = y[:train_rows]
    y_test = y[train_rows:]


    train_results = []
    test_results = []


    # Train each BagLearner
    for bagLearner in bagLearners:
        bagLearner.add_evidence(X_train, y_train)


        # Evaluate on training data
        pred_y_train = bagLearner.query(X_train)
        train_rmse = math.sqrt(((y_train - pred_y_train) ** 2).sum() / y_train.shape[0])
        train_results.append(train_rmse)


        # Evaluate on testing data
        pred_y_test = bagLearner.query(X_test)
        test_rmse = math.sqrt(((y_test - pred_y_test) ** 2).sum() / y_test.shape[0])
        test_results.append(test_rmse)


    print("Training RMSEs:", train_results)
    print("Testing RMSEs:", test_results)

    index = -1
    Best_train_rmse = math.inf
    Best_test_rmse = math.inf
    for i in range(len(bagLearners)):
        if test_results[index] < Best_test_rmse:
            Best_train_rmse = train_results[index]
            Best_test_rmse = test_results[index]
            index = i

    with open("bag_learner.pkl", 'wb') as f:
        pickle.dump(bagLearners[index], f)

    with open("best_rmse_results.txt", "w") as file:
        file.write(f"Best Train RMSE: {Best_train_rmse}\n")
        file.write(f"Best Test RMSE: {Best_test_rmse}\n")
        file.write(f"Mean: {df['ridership'].mean()}\n")



