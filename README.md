# WasteNot Food Rescue - FYP Iteration 4

A React Native mobile application for connecting food retailers with charities to reduce food waste. Store workers can create listings of surplus food, while charity volunteers can browse and claim these items.

## Project Structure

- `backend/` - FastAPI backend with PostgreSQL database
- `WasteNotDev/` - React Native mobile app (Expo)
- `frontend/` - React web frontend (development/testing)


## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FYP-Iteration2
```

### 2. Set Up Python Virtual Environment

Create a virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Backend Dependencies

```bash
pip install -r backend\requirements.txt
```

### 4. Configure Database

- Ensure PostgreSQL is running
- Update database connection settings in `backend/database.py` if needed
- Run any necessary database migrations or setup scripts

### 5. Run the Backend

```bash
cd backend
python main.py
```

The backend API will be available at `http://localhost:8001`

### 6. Install Mobile App Dependencies

Open a new terminal window and navigate to the mobile app directory:

```bash
cd WasteNotDev
npm install
```

### 7. Configure API Endpoint

Update the API base URL in `WasteNotDev/services/api.ts`:
- For local development on a physical device, use your computer's local IP address
- For emulator/simulator, use `http://localhost:8000`

### 8. Run the Mobile App

```bash
npx expo start
```

### 9. Test on Your Device

1. Install **Expo Go** on your mobile device:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app to scan the QR code

3. The app will load on your device



## Development Notes
- WasteNot uses local storage on mobile devices for temporary data

## References

This project was developed with guidance from the following resources:

## REFERENCES 


## REFERENCES 


ChatGPT. (2025, November 7). Retrieved from chatgpt.com: https://chatgpt.com/c/69176485-1458-8331-b053-4df0abe35697

ChatGPT. (2025, November 11). Retrieved from chatgpt.com: https://chatgpt.com/c/69203ef4-2430-8326-be09-e8e39fed78c5

ChatGPT. (2026, January 23). Retrieved from chatgpt.com: https://chatgpt.com/c/6973dd84-c8bc-832c-a62c-d1ceef72c186

Chowdhury, P. (2025, July 23). Python PostgreSQL Connection Pooling Using Psycopg2. Retrieved from geeksforgeeks.org: https://www.geeksforgeeks.org/python/python-postgresql-connection-pooling-using-psycopg2/

Expo. (2024, June 15). Create a project. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/create-a-project/

Expo. (2025, July 10). Set up your environment. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build

Expo. (2026, February 3). Expo Camera. Retrieved from docs.expo.dev: https://docs.expo.dev/versions/latest/sdk/camera/

GeeksforGeeks. (2025, November 22). SQL Indexes. Retrieved from geeksforgeeks.org: https://www.geeksforgeeks.org/sql/sql-indexes/

Grimm, S. (2024, July 9). From React to React Native in 12 Minutes. Retrieved from youtube.com: https://www.youtube.com/watch?v=6UB3gw3SKfY

Kodaps Academy. (2023, March 29). React Native vs React JS in 2024 Differences and Shared Features. Retrieved from youtube.com: https://www.youtube.com/watch?v=MSgIRdyJ6rk

Material-UI. (2026, February 4). Badge. Retrieved from mui.com: https://mui.com/material-ui/react-badge/

NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youtube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s

NPM. (2026, January 29). react-native-qrcode-svg. Retrieved from npmjs.com: https://www.npmjs.com/package/react-native-qrcode-svg

PostgreSQL. (2026, January 30). Trigger Functions. Retrieved from postgresql.org: https://www.postgresql.org/docs/current/plpgsql-trigger.html

Programming with Mosh. (2020, May 11). React Native Tutorial for Beginners -Build a React Native App. Retrieved from youtube.com: https://www.youtube.com/watch?v=0-S5a0eXPoc

ProgrammingKnowledge. (2025, February 8). How to Create QR Codes with Python | Generate QR Codes Easily. Retrieved from youtube.com: https://www.youtube.com/watch?v=2yTlvPSIePs

Python. (2026, February 6). secrets - Generate secure random numbers for managing secrets. Retrieved from docs.python.org:https://docs.python.org/3/library/secrets.html

React Native. (2025, December 16). Introduction. Retrieved from reactnative.dev: https://reactnative.dev/docs/getting-started

React Native. (2025, December 16). Scrollview. Retrieved from reactnative.dev: https://reactnative.dev/docs/scrollview

React Native. (2026, February 6). StyleSheet. Retrieved from reactnative.dev: https://reactnative.dev/docs/stylesheet
Tim, T. W. (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend. Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4

Van Hattem, R. (2024, November 26). Retrieved from pypi.org: https://pypi.org/project/python-utils/

W3Schools. (2025, November 16). SQL Server COALESCE() Function. Retrieved from w3schools.com: https://www.w3schools.com/sql/func_sqlserver_coalesce.asp

W3Schools. (2025, November 18). Web APIs - Introduction. Retrieved from w3schools.com: https://www.w3schools.com/js/js_api_intro.asp

W3Schools. (2025, November 19). SQL LEFT JOIN Keyword. Retrieved from w3schools.com: https://www.w3schools.com/sql/sql_join_left.asp

Woodworth, S. (2026, January). IS4447 Modules. Retrieved from ucc.instructure.com: https://ucc.instructure.com/courses/86289

Yamamoto, T. (2025, August 22). Preventing Race Conditions with SELECT FOR UPDATE in Web Applications. Retrieved from leapcell.io: https://leapcell.io/blog/preventing-race-conditions-with-select-for-update-in-web-applications

YpnConnect-Soft. (2025, July 21). Styling in react vs reactnative (Web vs Mobile development). Retrieved from youtube.com: https://www.youtube.com/watch?v=4CNERtrb3oQ
