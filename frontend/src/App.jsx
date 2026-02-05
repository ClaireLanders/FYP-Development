// This file renders the root React component to display the apps header and two main sections on one page
// this is adapted from (Tech With Tim, 2024)

import React from 'react';
import './App.css';
import Products from './components/Listing.jsx';
import Browse from './components/Browsing.jsx';
import EditListings from './components/ManageListings.jsx';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>WasteNot FoodRescue Frontend</h1>
      </header>
      <main>
        {/*shop worker: create listing */}
        <Products />
        {/*shop worker: edit or cancel existing listings */}
        <EditListings />
        <hr />
        {/* volunteer browse & claim */}
        <Browse />
      </main>
    </div>
  );
};

export default App;

// REFERENCES
// ChatGPT. (2025, November 7). Retrieved from chatgpt.com: https://chatgpt.com/c/69176485-1458-8331-b053-4df0abe35697
// ChatGPT. (2025, November 11). Retrieved from chatgpt.com: https://chatgpt.com/c/69203ef4-2430-8326-be09-e8e39fed78c5
// NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youttube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s
// Tim, T. W. (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend. Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4
// W3 Schools. (2025, November 16). SQL Server COALESCE() Function. Retrieved from w3schools.com: https://www.w3schools.com/sql/func_sqlserver_coalesce.asp
// W3Schools. (2025, November 18). Web APIs - Introduction. Retrieved from w3schools.com: https://www.w3schools.com/js/js_api_intro.asp
// Yamamoto, T. (2025, August 22). Preventing Race Conditions with SELECT FOR UPDATE in Web Applications. Retrieved from leapcell.io: https://leapcell.io/blog/preventing-race-conditions-with-select-for-update-in-web-applications

