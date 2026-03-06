# WasteNot Food Rescue - FYP Iteration 6

A React Native mobile application for connecting food retailers with charities to reduce food waste. Store workers can create listings of surplus food, while charity volunteers can browse and claim these items.

## Project Structure

- `backend/` - FastAPI backend with PostgreSQL database
- `WasteNotDev/` - React Native mobile app (Expo)


## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FYP-Development-main
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
pip install -r backend/requirements.txt
```


### 4. Run the Backend

```bash
cd backend
python main.py
```

The backend API will be available at `http://localhost:8001`

### 5. Install Mobile App Dependencies

Open a new terminal window and navigate to the mobile app directory:

```bash
cd WasteNotDev
npm install
```

### 6. Configure API Endpoint

Update the API base URL in `WasteNotDev/services/api.ts`:
- For local development on a physical device, use your computer's local IP address
- For emulator/simulator, use `http://localhost:8001`

### 7. Run the Mobile App

```bash
npx expo start
```

### 8. Test on Your Device

1. Install **Expo Go** on your mobile device:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app to scan the QR code

3. The app will load on your device



## Development Notes
The backend runs locally. Update the API base URL in WasteNotDev/services/api.ts to match your machine's local IP when testing on a physical device.

## References
See REFERENCES.md for a full list of sources.


