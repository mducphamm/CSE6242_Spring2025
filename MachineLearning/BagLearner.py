import numpy as np


class BagLearner(object):
    """
    This is a Linear Regression Learner. It is implemented correctly.

    :param verbose: If “verbose” is True, your code can print out information for debugging.
        If verbose = False your code should not generate ANY output. When we test your code, verbose will be False.
    :type verbose: bool
    """

    def __init__(self, learner=object, kwargs={}, bags=1, boost=False, verbose=False):
        self.bags = bags
        self.boost = boost
        self.learner = learner
        self.verbose = verbose

        learners = []
        for i in range(0, self.bags):
            learners.append(self.learner(**kwargs))
        self.learners = learners

    def add_evidence(self, data_x, data_y):
        """
        Train each sub-learner on a bootstrap sample of the given data.
        :param data_x: A numpy array of shape (N, d) containing the features.
        :param data_y: A numpy array of shape (N,) containing the target values.
        """
        n = data_x.shape[0]
        for i in range(self.bags):
            # Sample n indices with replacement from [0..n-1]
            sample_indices = np.random.choice(n, n, replace=True)
            # Subset data based on sampled indices
            boot_x = data_x[sample_indices, :]
            boot_y = data_y[sample_indices]
            # Train the i-th sub-learner
            self.learners[i].add_evidence(boot_x, boot_y)

    def query(self, points):
        """
        Estimate a set of test points given the model we built.

        :param points: A numpy array with each row corresponding to a specific query.
        :type points: numpy.ndarray
        :return: The predicted result of the input data according to the trained model
        :rtype: numpy.ndarray
        """
        all_predictions = []
        for i in range(self.bags):
            preds = self.learners[i].query(points)
            all_predictions.append(preds)
        all_predictions = np.array(all_predictions).T
        return np.mean(all_predictions, axis=1)