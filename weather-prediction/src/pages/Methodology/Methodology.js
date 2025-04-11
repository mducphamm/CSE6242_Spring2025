const Methodology = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Proposed Method</h1>
      <p>
        Building on our literature review, our project will explore the following innovations: predicting ridership by incorporating holiday data & more weather variables; implementation of a smoothing linear regression design to capture temporal fluctuations and possible non-linearities more precisely; using machine learning to build additional predictive models for predicting ridership; creating interactive visualizations to analyze the ridership and weather interactions; developing a front-end and back-end system for model inferencing to predict daily ridership.
      </p>
      <p>
        We began the data pre-processing phase focused on cleaning and transforming the data, reducing the large csv dataset of millions of rows to a 7 GB SQLite database through normalization and creating lookup tables for categorical variables. Next, we explored traditional time series models, such as Holt-Winters and SARIMA, which are useful in identifying some patterns in the data. However, they may fall short in accurately capturing complex patterns influenced by non-linear variables such as weather conditions like temperature and rainfall, and holidays. By incorporating these features, we expect our approach to deliver more accurate forecasts that consider these additional sources of variation.
      </p>
      <p>
        The initial weather dataset spans 1,325 daily observations with 26 features, which is preprocessed (feature engineered, one hot encoded) and reduced to 20 important features. We performed Exploratory Data Analysis (EDA) and multicollinearity analysis to aid in feature selection. Furthermore, feature engineering was another key part of the process, where we developed new features such as “apparent_temperature_range” and categorized weather conditions into three groups based on the World Meteorological Organization (WMO) code. These engineered features, combined with standard data preparation techniques, allowed us to build a more structured and meaningful dataset for our modeling tasks.
      </p>
      <p>
        The final dataset consists of features such as temperature (mean, range), wind speed, precipitation, weather categories (Fair, Moderate, Severe), holidays, weekend, etc. This rich dataset allows us to explore how different factors impact subway ridership and develop models that can account for those effects. The key research questions we are trying to answer include: How do weather conditions, such as temperature and rainfall, affect daily ridership? What role do public holidays and weekends play in influencing subway usage? Can machine learning models outperform traditional time series approaches in terms of prediction accuracy?
      </p>
      <p>
        Beyond time series methods, we have integrated machine learning models to account for more complex, non-linear relationships in the data. These models, such as decision trees, random forests, and gradient boosting, can capture interactions between various features—like weather conditions, holidays, and weekday/weekend—that are difficult to model with traditional time series techniques.
      </p>
      <p>
        We explored a range of machine learning techniques, leveraging both parametric and non-parametric models to analyze the data from multiple perspectives and improve predictive power. To capture the linear relationship between the features and daily ridership, we used multilinear regression and regularized regression methods (Ridge, Lasso, Elastic Net). These models offer interpretability, helping us quantify the impact of individual features and assessing statistical significance.
      </p>
      <p>
        On the other hand, non-parametric models such as tree-based approaches (e.g., Decision Tree, Random Forest, Gradient Boosting), Principal Component Analysis (PCA), K-Nearest Neighbors (KNN), and more complex models like Neural Networks, were tested to handle feature complexity. These models are better at capturing non-linear patterns and interactions, particularly for variables such as weather and holiday conditions, that may not adhere to strict linear assumptions. To further enhance predictive power, we performed n-fold cross validations across a grid of parameters (alpha for regularized regression, learning rates for boosting, and hidden layers for neural networks) to identify optimal parameters.
      </p>
      <p>
        For the visualization aspect, we’re developing an interactive web platform that uses three key data exploration techniques to build a comprehensive user experience for understanding the data. First, we’ll use D3.js to build a highly interactive data visualization tool that guides the users towards our key findings in the data analysis regarding the relationship between weather and ridership conditions. Then, we’ll have a Tableau to complement the interactive visuals by serving as a dashboard, which will tell a story about the data and allow users to explore it in more depth. For example, it’ll allow them to examine patterns across different weather conditions, holidays, and day-of-week effects with additional filters, more charts, and so on. And lastly, we'll have a Model Inference tab that allows users to input parameters into the machine learning model and in return, receive a prediction of subway ridership. This will add another layer of interactivity by demonstrating the impact of each variable on ridership in a quantifiable way. And to pull this all together, the web application itself will integrate both these visualizations, and API, for the model to provide a seamless experience for the user.
      </p>
      <h2 className="text-xl font-semibold">Initial Plan of Activities:</h2>
      <p><em>Picture</em></p>
      <h2 className="text-xl font-semibold">Updated Plan of Activities:</h2>
      <p><em>Picture</em></p>
      <p>All team members have contributed a similar amount of effort.</p>
      
      <h1 className="text-2xl font-bold">Evaluation</h1>
      <p>
        We began with a time series analysis to identify trends and seasonal patterns in the ridership data. The decomposition revealed a subtle upward trend in ridership, supported by linear regression and confirmed by Kendall’s tau, which showed a moderate positive correlation between time and ridership. It also identified a strong weekly seasonal pattern, with Sundays consistently having lower ridership than weekdays. Autocorrelation analysis reinforced this with a significant 7-day lag, highlighting the impact of weekly cycles on ridership. We also found that residuals were skewed, especially during holidays, suggesting anomalies that are challenging to model with standard time series techniques. Despite these issues, the time series analysis offered valuable insights, guiding the development of our machine learning approach.
      </p>
      <p>
        Within the context of daily ridership-predictive modeling, evaluation will be in the form of measuring the accuracy of our predictive models. In terms of experimental design, we divided the data into training and testing sets, using 70% of the data for model training and the remaining 30% for testing. To ensure robust performance and reduce overfitting, we implemented n-fold cross validation (CV) during the model training. For each model, we divided the dataset into n folds, iteratively trained it on n-1 folds and validated them on remaining folds for better measure of model generalizability. We trained several machine learning models and compared their performance based on key metrics like mean squared error (MSE) and R-squared values. Finally, we picked the model that performed the best in terms of maximizing the R-squared values while minimizing the errors across various weather and holiday conditions.
      </p>
      <p>
        The initial results from these experiments have been promising. Among the models tested, tree-based algorithms, particularly Random Forest and Gradient Boosting, performed the best, achieving lower MSE and higher R-squared values (~70%) compared to linear models, thus capturing feature complexity. Our exploratory analysis revealed some interesting patterns such as Heavy rainfall led to a noticeable 10% reduction in ridership compared to days with no rain, while moderate and light rain caused smaller declines. Additionally, we found that ridership was highest on weekdays, especially on Tuesdays through Thursdays, with weekend ridership dropping significantly, especially on Sundays. These findings were further supported by our preliminary model results, in which weekdays had the biggest positive influence on daily ridership, followed by severe weather and precipitation levels (negative influence). Surprisingly, we found that a bigger shift in daily temperature (temperature range) had a positive impact on daily ridership. These insights are valuable as they offer a deeper understanding of the ridership dynamics and help inform our model-building efforts.
      </p>
      <p>
        Looking forward, we plan to improve our models by incorporating additional predictors, particularly those that capture the effects of holidays and special events. We also intend to balance both the explanatory power and predictive accuracy by using statistical inference (p-values) to identify significant features and refining the model using predictive metrics and hyperparameter tuning.
      </p>
    </div>
  );
};

export default Methodology;
