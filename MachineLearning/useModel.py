import pickle
import numpy as np

if __name__ == "__main__":
    myLearner = pickle.load(open('bag_learner.pkl', 'rb'))

    arr = np.ones((1, 22))

    print(myLearner.query(arr)[0])