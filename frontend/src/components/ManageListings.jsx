// This file lets a store worker edit or cancel listings for their branch.
// This is adapted from (Tech With Tim, 2024)
// this is also adapted from (w3 schools, 2025)'s JS Web API tutorials


import React, { useEffect, useState } from "react";
import api from "../api.js";

// hard-coded user_branch_id for now
const UserBranchID = "0ca58dd2-df98-42ee-b0a4-f6b43c00a3d8";
// branch_id
const BranchID = '03a897a0-e271-4174-aed2-d283a888dbae';


export default function EditListings() {
  const [listings, setListings] = useState([]);
  // edited quantities keyed by listing_line_item_id
  const [editedQty, setEditedQty] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null); // the listing being saved/cancelled

  const fetchListings = async () => {
    setLoading(true);
    try {
      const r = await api.get("/get_listings", {
        params: { branch_id: BranchID },
      });
      setListings(r.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load listings for editing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const onChangeQty = (lliId, value) => {
    // store as Number to avoid sending strings to the API
    setEditedQty((prev) => ({ ...prev, [lliId]: Number(value) }));
  };

  // build payload items for PATCH from one listing
  const buildPatchItems = (listing, { onlyChanged = true, zeroAll = false } = {}) => {
    const items = listing.items.map((it) => {
      const current = Number(it.quantity ?? 0); // current remaining qty from API
      const next = zeroAll ? 0 : Number(editedQty[it.listing_line_item_id] ?? current);

      return {
        listing_line_item_id: it.listing_line_item_id,
        quantity: next,
        _changed: next !== current,
      };
    });

    return onlyChanged ? items.filter((it) => it._changed) : items;
  };

  const saveListing = async (listing) => {
    const items = buildPatchItems(listing, { onlyChanged: true, zeroAll: false });
    if (items.length === 0) {
      alert("No changes to save.");
      return;
    }

    setSavingId(listing.listing_id);
    try {
      const r = await api.patch("/listing/items", {
        user_branch_id: UserBranchID,
        listing_id: listing.listing_id,
        // strip the helper flag _changed
        items: items.map(({ _changed, ...clean }) => clean),
      });
      alert(`Updated: ${r.data.updated_amt} item(s).`);
      // refresh and clear edited values for this listing
      await fetchListings();
      setEditedQty((prev) => {
        const copy = { ...prev };
        listing.items.forEach((it) => delete copy[it.listing_line_item_id]);
        return copy;
      });
    } catch (e) {
      console.error(e);
      alert("Failed to update listing.");
    } finally {
      setSavingId(null);
    }
  };

  const cancelListing = async (listing) => {
    if (!window.confirm("Cancel this listing (set all quantities to 0)?")) return;

    const items = buildPatchItems(listing, { onlyChanged: false, zeroAll: true });

    setSavingId(listing.listing_id);
    try {
      const r = await api.post("/listing/cancel", {
        user_branch_id: UserBranchID,
        listing_id: listing.listing_id,
        items: items.map(({ _changed, ...clean }) => clean),
      });
      alert(`Listing cancelled. Updated: ${r.data.updated_amt} item(s).`);
      await fetchListings();
    } catch (e) {
      console.error(e);
      alert("Failed to cancel listing.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Edit / Cancel Listings</h2>

      {loading && <div>Loading…</div>}
      {!loading && listings.length === 0 && <div>No active listings.</div>}

      {listings.map((l) => (
        <div
          key={l.listing_id}
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, margin: "12px 0" }}
        >
          {l.items.length === 0 && (
            <div style={{ fontStyle: "italic" }}>No items (all zero / fully claimed).</div>
          )}

          {l.items.map((it) => (
            <div
              key={it.listing_line_item_id}
              style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0" }}
            >
              <span style={{ width: 260 }}>{it.product_name}</span>
              <span>qty:</span>
              <input
                type="number"
                min="0"
                value={editedQty[it.listing_line_item_id] ?? it.quantity}
                onChange={(e) => onChangeQty(it.listing_line_item_id, e.target.value)}
                style={{ width: 100 }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => saveListing(l)} disabled={savingId === l.listing_id}>
              {savingId === l.listing_id ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => cancelListing(l)}
              disabled={savingId === l.listing_id}
              style={{ opacity: 0.9 }}
            >
              {savingId === l.listing_id ? "Cancelling…" : "Cancel Listing"}
            </button>
          </div>
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


