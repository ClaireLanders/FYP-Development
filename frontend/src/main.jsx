// This file bootstraps the React app
// this is adapted from (Tech With Tim, 2024)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// REFERENCES
// Tech With Tim, (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend.
// Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4
//
// NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youttube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s