// This file renders the charity browsing and claiming UI
// it loads all available listings from FastAPI GET/listings endpoint
// the user is allowed to enter quantities per line item to make a claim
// this is adapted from (Tech With Tim, 2024)
// this is also adapted from (w3 schools, 2025)'s JS Web API tutorials

import React, { useEffect, useState } from 'react';
import api from '../api.js';

// charity user from my db
const USER_ID = '10e30991-20d0-4580-a48e-6664cab10323';

// NOTE: use state - ref
export default function Browse() {
  const [listings, setListings] = useState([]); // all listings are fetched from the api
  const [claimQty, setClaimQty] = useState({}); // what the user inputs into the boxes
  const [submitting, setSubmitting] = useState(false); // sending claim to the server

  // loading the listings
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get('/listings');
        setListings(r.data); // [{ listing_id, org_name, branch_name, items:[...] }]
      } catch (e) {
        console.error(e);
        alert('Failed to load listings');
      }
    })();
  }, []);

  // submit a claim for one listing
  const submitClaim = async (listing) => {
    const items = listing.items
      .map(it => {
        const q = Number(claimQty[it.listing_line_item_id] ?? 0);
        return q > 0 ? { listing_line_item_id: it.listing_line_item_id, quantity: q } : null;
      })
      .filter(Boolean);
    // constraint so the user selects at least one item
    if (!items.length) {
      alert('Choose at least one quantity to claim');
      return;
    }
    // Clear the inputs for this listing
    setSubmitting(true);
    try {
      const r = await api.post('/claims', {
        user_id: USER_ID,
        items,
      });
      alert(`Claim created: ${r.data.claim_id}`);
      // clear inputs for this listing
      setClaimQty(prev => {
        const next = { ...prev };
        listing.items.forEach(it => { next[it.listing_line_item_id] = 0; });
        return next;
      });
    } catch (e) {
      console.error(e);
      alert('Failed to create claim');
    } finally {
      setSubmitting(false);
    }
  };
// returning the listings available
  return (
    <div style={{ padding: 12 }}>
      <h2>Available Listings</h2>
      {listings.map(l => (
        <div key={l.listing_id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
          <div><b>{l.org_name}</b>: {l.branch_name}</div>
          {l.items.map(it => (
            <div key={it.listing_line_item_id} style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '6px 0' }}>
              <span style={{ width: 240 }}>{it.product_name}</span>
              <span>listed: {it.quantity}</span>
              <input
                type="number"
                min="0"
                value={claimQty[it.listing_line_item_id] ?? 0}
                onChange={e => setClaimQty(prev => ({ ...prev, [it.listing_line_item_id]: e.target.value }))}
                style={{ width: 80 }}
              />
            </div>
          ))}
          <button disabled={submitting} onClick={() => submitClaim(l)}>
            {submitting ? 'Submitting…' : 'Claim Selected'}
          </button>
        </div>
      ))}
    </div>
  );
}

// REFERENCES
// ChatGPT. (2025, November 7). Retrieved from chatgpt.com: https://chatgpt.com/c/69176485-1458-8331-b053-4df0abe35697
// ChatGPT. (2025, November 11). Retrieved from chatgpt.com: https://chatgpt.com/c/69203ef4-2430-8326-be09-e8e39fed78c5
// NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youttube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s
// Tim, T. W. (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend. Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4
// W3 Schools. (2025, November 16). SQL Server COALESCE() Function. Retrieved from w3schools.com: https://www.w3schools.com/sql/func_sqlserver_coalesce.asp
// W3Schools. (2025, November 18). Web APIs - Introduction. Retrieved from w3schools.com: https://www.w3schools.com/js/js_api_intro.asp
// Yamamoto, T. (2025, August 22). Preventing Race Conditions with SELECT FOR UPDATE in Web Applications. Retrieved from leapcell.io: https://leapcell.io/blog/preventing-race-conditions-with-select-for-update-in-web-applications

