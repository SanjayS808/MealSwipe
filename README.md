# CSCE 482 939 Capstone Project - MealSwipe

<img src="assets/mealSwipeLogo.png" alt="drawing" height="200"/>

#### Overview
MealSwipe is a web/mobile application that allows users to choose a variety of local restaurants in an interactive way. Using a similar mechanic to Tinder's swiping application, the user will be able to swipe left to trash a restaurant option, and swipe right to love the webstite. Other options such as seeing more information about the restaurant option, reserve in the restaurant and so on are also provided. In addition, the user will be able to create its own profile to store and revisit previously swiped restaurants.

This `README.md` file functions as a developer guide on how to build and setup MealSwipe for development. For deployment, the GitHub actions pipeline should serve enough.


#### Backend Setup

The backend relies on multiple services for it to work properly. Below are bulleted points describing what needs to be set up for MealSwipe to run as intended.

- The Backend need a Database to connect to. Currently it is pointing to a AWS-hosted database. But a local one can be used instead.

- The Backend also needs access to the Google Places API or a mocked up version that has a similar behavior as that. Note that setting up the mocked Google Places API is not found within this repository. Please read the main report to see details on that.

- If developing mealswipe. Ensure that within `config.js` folder you turn `DEV_MODE` as `DEV_MODE=true`. Otherwise some services might not work as intended.

- Finally a `.env` file is required to be created in order for the application to function as intended. Below is a schema on what the file needs to contain. In short, most of it is the URL to other services the backend needs to connect to.

```
#.env
DB_PASSWORD_DEV=<developer password>
DB_PASSWORD_PRDD=<production passwrod>
DB_USER_PROD=<production username>
DB_USER_DEV=<devleoper username>
DB_URL_PATH=<DB username path>
GOOGLE_PLACES_API=<Google API>
```

Once all of these points are covered, one can simply use npm to install setup and run/build the backend.

To install all modules simply use
```bash
npm install
```

Once all modules are installed one can run or test the code.
```bash
npm start # To run the backend service
npm test  # Test the service
npm test -- --coverage # Get coverage report.
```

#### Frontend Setup

Frontend setup is more straight forward compared to the backend. As most services are only connected to the backend. And the frontend is only connected to the backend and Google's OAuth API for logging in and authentication.

If developing mealswipe. Ensure that within `config.js` folder you turn `DEV_MODE` as `DEV_MODE=true`. Finally, one must populate a `.env` file in the frontend as well containing the information below:

```
# .env
REACT_APP_GOOGLE_WEB_CLIENT_ID=<Google API client identfication>
REACT_APP_GOOGLE_CLIENT_SECRET=<Google API client secret>
```

This information is used for the login function of a user. One can still run and build the website without this file.

#### Function Documentation
Function documentation is found in the docs folder found in the root directory. The documentation was created using JSDoc. One can see the documentation by simply opening the `docs/index.html` file. 
