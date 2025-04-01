import numpy as np
#[1,2,3]
class RTLearner(object):
    """
    :param verbose: If “verbose” is True, your code can print out information for debugging.
        If verbose = False your code should not generate ANY output. When we test your code, verbose will be False.
    :type verbose: bool
    """

    def __init__(self, leaf_size=1, verbose=False):
        self.leaf_size = leaf_size
        self.verbose = verbose
        self.tree = None
        self.next_row = 0
        self.root = 0

    # factor, splitVal, leftIndex, rightIndex, cur
    def add_evidence(self, data_x, data_y):
        """
        Add training data to learner

        :param data_x: A set of feature values used to train the learner
        :type data_x: numpy.ndarray
        :param data_y: The value we are attempting to predict given the X data
        :type data_y: numpy.ndarray
        """
        self.tree = np.zeros((4*data_x.shape[0], 4))
        self.build_tree(data_x, data_y)
        self.tree = self.tree[:self.next_row, :]

    def build_tree(self, data_x, data_y):
        node_idx = self.next_row
        self.next_row += 1

        # case no data
        if data_y.shape[0] == 0:
            self.tree[node_idx] = [-1, 0.0, -1, -1]
            return node_idx
        # case shape <= left_size or just 1 value in data y
        if (data_x.shape[0] <= self.leaf_size) or (len(np.unique(data_y)) == 1) or np.all(data_x == data_x[0, :]):
            leaf_value = np.mean(data_y)
            self.tree[node_idx] = [-1, leaf_value, -1, -1]
            return node_idx

        best_feature_index = np.random.randint(0, data_x.shape[1])
        col_values = data_x[:, best_feature_index]
        split_val = np.median(col_values)

        # if the whole column is the same, make this a leaf
        if np.all(col_values == col_values[0]):
            leaf_value = np.mean(data_y)
            self.tree[node_idx] = [-1, leaf_value, -1, -1]
            return node_idx

        left_mask = col_values <= split_val
        right_mask = col_values > split_val
        if (not np.any(left_mask)) or (not np.any(right_mask)):
            mean_val = np.mean(data_y)
            self.tree[node_idx] = [-1, mean_val, -1, -1]
            return node_idx
        # Partition data
        data_x_left, data_y_left = data_x[left_mask], data_y[left_mask]
        data_x_right, data_y_right = data_x[right_mask], data_y[right_mask]

        left_child_idx = self.build_tree(data_x_left, data_y_left)
        right_child_idx = self.build_tree(data_x_right, data_y_right)
        self.tree[node_idx, 0] = best_feature_index
        self.tree[node_idx, 1] = split_val
        self.tree[node_idx, 2] = left_child_idx
        self.tree[node_idx, 3] = right_child_idx
        return node_idx

    def get_best_feature_by_correlation(self, data_x, data_y):
        num_features = data_x.shape[1]
        best_feature_idx = 0
        best_feature_value = float('-inf')
        for i in range(num_features):
            col = data_x[:, i]
            if np.all(col == col[0]):
                cof = 0.0
            else:
                cof_matrix = np.corrcoef(col, data_y)
                cof = cof_matrix[0, 1]

            if abs(cof) > best_feature_value:
                best_feature_idx = i
                best_feature_value = abs(cof)

        return best_feature_idx, best_feature_value

    def query(self, points):
        """
        Estimate a set of test points given the model we built.

        :param points: A numpy array with each row corresponding to a specific query.
        :type points: numpy.ndarray
        :return: The predicted result of the input data according to the trained model
        :rtype: numpy.ndarray
        """
        res = np.zeros(len(points))
        for i in range(points.shape[0]):
            res [i] = self.query_one(points[i])

        return res

    def query_one(self, point):
        node_idx = self.root
        while True:
            feat, val, left_idx, right_idx = self.tree[node_idx]
            feat = int(feat)
            if feat == -1:
                return val
            if point[feat] <= val:
                node_idx = int(left_idx)
            else:
                node_idx = int(right_idx)
            if node_idx < 0 or node_idx >= self.tree.shape[0]:
                return val