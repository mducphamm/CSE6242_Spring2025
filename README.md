# WEB APPLICATION LINK: 
# https://cse6242-mta-ridership-app-359c84fb8d2a.herokuapp.com/

**IMPORTANT Notice #1:** Your NPM and python environment will determine if you can successfully install and run the web application. If you are unable to get the program running, we have built a website you can access linked above.

## Folder structure

Each folder is as follows:

1. ridership-data: Ridership data and the code used to process it
2. weather-data: Code for gathering weather data and preprocessing
3. linear-regression-models: Initial base regression model establishing correlation between weather and ridership
4. advanced-prediction-models: Advanced Random Forest model that improved upon the linear regression approach
5. time-series-analysis: Jupyter notebook containing time series analysis of the data
6. ridership-prediction-app-frontend: React-based frontend with static pages and interactive dashboards using D3.js and Tableau visualizations
7. ridership-prediction-app-backend: Flask-based backend using the Random Forest model to calculate ridership based on weather data
8. ridership-prediction-app-heroku: Combined frontend and backend files for Heroku deployment
---


## Setting up Python

1. Download and install Python from [python.org](https://www.python.org/downloads/)
   - **Important:** Check "Add Python to PATH" during installation
2. Verify installation:
   ```
   python --version
   pip --version
   ```

### Data Analysis Python Setup

1. Once you have installed python, install the following packages:
   ```
   pip install pandas matplotlib numpy scipy statsmodels scikit-learn
   ```

2. Additionally, you may need to install more requirements located in the advanced-prediction-models folder (virtual environment recommended):
   ```
   pip install -r modeling_requirements.txt
   ```
   

## Frontend Setup (React)

### Installing Node.js (Windows)

1. Download the Windows Installer (.msi) from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the prompts (check "Add to PATH")
3. Verify installation with Command Prompt:
   ```
   node -v
   npm -v
   ```

### Running the React Project

1. Clone this repository:
   ```
   git clone [repository URL]
   cd [project-directory]/ridership-prediction-app-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The React application will open at `http://localhost:3000`

## Backend Setup (Python/Flask)

### Note: You must have folloed the directions for installing python prior to this. 

1. Navigate to backend directory:
   ```
   cd [project-directory]/ridership-prediction-app-backend
   ```

2. With virtual environment activated, install required libraries:
   ```
   pip install Flask==2.2.3 Werkzeug==2.2.3 Flask-cors==3.0.10 pandas==1.3.3 numpy==1.21.2 joblib==1.2.0 scikit-learn==1.6.1
   ```
   
3. If other library issues arise, please pip install them. Otherwise, run the Flask application:
   ```
   python server.py
   ```

3. The Flask backend will run at `http://localhost:5000`
  
4. Assuming you have the react application running as well, you have now completed all the steps required to run the application. 
