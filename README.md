# WasteNot Food Rescue - FYP Iteration 3

A React Native mobile application for connecting food retailers with charities to reduce food waste. Store workers can create listings of surplus food, while charity volunteers can browse and claim these items.

## Project Structure

- `backend/` - FastAPI backend with PostgreSQL database
- `WasteNotDev/` - React Native mobile app (Expo)
- `frontend/` - React web frontend (development/testing)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Python 3.8 or higher
- Node.js 18.0 or higher
- npm or yarn
- PostgreSQL database
- Expo Go app on your mobile device (for testing)

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

The backend API will be available at `http://localhost:8000`

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

This will:
- Start the Expo development server
- Display a QR code in the terminal
- Open Expo DevTools in your browser

### 9. Test on Your Device

1. Install **Expo Go** on your mobile device:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app to scan the QR code

3. The app will load on your device

## Optional: Web Frontend Setup

To run the React web frontend for development/testing:

```bash
cd frontend
npm install
npm run dev
```

The web frontend will be available at `http://localhost:5173`

## Project Features

### Store Worker Features
- Create daily food surplus listings
- Edit existing listing quantities
- Cancel listings

### Charity Volunteer Features
- Browse available food listings
- Claim items from listings
- View organization and branch details

## Technology Stack

### Backend
- FastAPI - Python web framework
- PostgreSQL - Relational database
- Psycopg2 - PostgreSQL adapter for Python

### Mobile App
- React Native - Mobile framework
- Expo - Development platform
- TypeScript - Type-safe JavaScript
- Axios - HTTP client

### Web Frontend
- React - UI library
- Vite - Build tool
- Axios - HTTP client

## Troubleshooting

### Backend Issues
- **Port already in use**: Change the port in `backend/main.py`
- **Database connection error**: Verify PostgreSQL is running and connection settings are correct

### Mobile App Issues
- **Cannot connect to API**: Ensure your device is on the same network as your development machine
- **QR code not scanning**: Try entering the URL manually in Expo Go
- **Metro bundler errors**: Clear the cache with `npx expo start -c`

### General Issues
- **Module not found errors**: Run `npm install` or `pip install -r requirements.txt` again
- **Virtual environment issues**: Deactivate and reactivate the virtual environment

## Development Notes

- Hard-coded user and branch IDs are used for development (see `constants/config.ts`)
- TODO: Implement proper authentication and user context management
- The app uses local storage on mobile devices for temporary data

## References

This project was developed with guidance from the following resources:

- ChatGPT. (2025, November 7). Retrieved from chatgpt.com: https://chatgpt.com/c/69176485-1458-8331-b053-4df0abe35697
- ChatGPT. (2025, November 11). Retrieved from chatgpt.com: https://chatgpt.com/c/69203ef4-2430-8326-be09-e8e39fed78c5
- ChatGPT. (2026, January 23). Retrieved from chatgpt.com: https://chatgpt.com/c/6973dd84-c8bc-832c-a62c-d1ceef72c186
- Expo. (2024, June 15). Create a project. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/create-a-project/
- Expo. (2025, July 10). Set up your environment. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build
- Grimm, S. (2024, July 9). From React to React Native in 12 Minutes. Retrieved from Youtube: https://www.youtube.com/watch?v=6UB3gw3SKfY
- Kodaps Academy. (2023, March 29). React Native vs React JS in 2024 Differences and Shared Features. Retrieved from Youtube: https://www.youtube.com/watch?v=MSgIRdyJ6rk
- NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youttube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s
- Programming with Mosh. (2020, May 11). React Native Tutorial for Beginners -Build a React Native App. Retrieved from Youtube: https://www.youtube.com/watch?v=0-S5a0eXPoc
- React Native. (2025, December 16). Introduction. Retrieved from reactnative.dev/docs: https://reactnative.dev/docs/getting-started
- Tim, T. W. (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend. Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4
- W3 Schools. (2025, November 16). SQL Server COALESCE() Function. Retrieved from w3schools.com: https://www.w3schools.com/sql/func_sqlserver_coalesce.asp
- W3Schools. (2025, November 18). Web APIs - Introduction. Retrieved from w3schools.com: https://www.w3schools.com/js/js_api_intro.asp
- W3Schools. (2025, November 19). SQL LEFT JOIN Keyword. Retrieved from w3schools.com: https://www.w3schools.com/sql/sql_join_left.asp
- Woodworth, S. (2026, January). IS4447 Modules. Retrieved from ucc.instructure.com: https://ucc.instructure.com/courses/86289
- Yamamoto, T. (2025, August 22). Preventing Race Conditions with SELECT FOR UPDATE in Web Applications. Retrieved from leapcell.io: https://leapcell.io/blog/preventing-race-conditions-with-select-for-update-in-web-applications
- YpnConnect-Soft. (2025, July 21). Styling in react vs reactnative (Web vs Mobile development). Retrieved from Youtube: https://www.youtube.com/watch?v=4CNERtrb3oQ

