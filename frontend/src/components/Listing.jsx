
// This is adapted from (Tech With Tim, 2024)
// this is also adapted from (w3 schools, 2025)'s JS Web API tutorials
// this file shows products for a store branch and lets the store worker input quantities of their products to post listings
import React, {useEffect, useState} from 'react';
import api from "../api.js";

// these are hard-coded ids for the moment
// user_branch_id
const UserBranchID = '0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8';
// branch_id
const BranchID = '03a897a0-e271-4174-aed2-d283a888dbae';


export default function Products() {
  const [products, setProducts] = useState([]); // get all products from this branch
  const [qty, setQty] = useState({}); // the users input
  const [saving, setSaving] = useState(false); // sending listing to server

// loading the branch's products
  useEffect(() => {
    (async () => {
      try {
        // calling the api
        const r = await api.get('/get_products', {
          params: {branch_id: BranchID},
        });
        setProducts(r.data);
      } catch (e) {
        console.error(e);
        alert('Failed to load products');
      }
    })();
  }, []);

  const onSave = async () => {
    const items = products.map(p => ({
      product_id: p.product_id,
      // allow zero
      quantity: Number(qty[p.product_id] ?? 0),
    }));

    // posting the listing we made
    setSaving(true);
    try {
      const r = await api.post('/listing', {
        user_branch_id: UserBranchID,
        items,
      });
      alert(`Listing created: ${r.data.listing_id}`);
      setQty({});
    } catch (e) {
      console.error(e);
      alert('Failed to create listing');
    } finally {
      setSaving(false);
    }
  };



// the user interface, returns the products for the branch and user can enter a quantity to make a claim
  return (
    <div>
      <h2>Create Tonight's Listing</h2>
      <div>
        {products.map(p => (
          <div key={p.product_id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 240 }}>{p.product_name}</div>
            <input
              type="number"
              min="0"
              value={qty[p.product_id] ?? 0}
              onChange={e => setQty(prev => ({...prev, [p.product_id]: e.target.value}))}
              style={{ width: 100 }}
            />
          </div>
        ))}
      </div>

      <button disabled={saving} onClick={onSave}>
        {saving ? 'Saving…' : 'Save Listing'}
      </button>
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

