# This is the main backend python file for WasteNot
# This code is adapted from video "how to create a Fast APi & React Project" (Tech With Tim, 2024)
# The database interactions for this code were adapted from (NeuralNine, 2025)
# My own database and models were used, the video acted as a guide to understand the imports, models and endpoints


import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import psycopg2  # Postgres Driver
from psycopg2 import pool
from utils.qr_code import generate_qr_code, generate_secure_token

# Setting up FastAPI
app = FastAPI()

# accessing the application
# port the frontend is running on
origins = [
     "http://localhost:5173", "http://127.0.0.1:5173" # so the vite dev server can call teh api from either origin
 ]

# Adding CORS middleware to block unauthorised websites, endpoints, or servers from accessing the API
# This is needed for the Vite frontend (5173) to call the FastAPI backend (8000)
app.add_middleware(
 CORSMiddleware,
 allow_origins=origins,  # specifying the origins outlined in the above list
 allow_credentials=True,  # for allowing tokens, etc
 allow_methods=["*"],  # allowing all methods
 allow_headers=["*"],  # allowing all headers
)
# ---------------------------------------
# Connection Pool
# Adapted from (Chowdhury, 2025)
# Creating a connection pool of 2-20 connections
connection_pool = psycopg2.pool.ThreadedConnectionPool(
    2, #min
    20, #max
    host="localhost",
    database="master",
    user = "postgres",
    password = "newpword3",
    port = 5432

)
# print statement for testing
# TODO: REVMOVE !!
if connection_pool:
    print("connection pool created successfully")


# Updated get_conn function for the pool
def get_conn():
    conn = connection_pool.getconn()
    if conn:
        try:
            yield conn
        finally:
            # Return connection pool
            connection_pool.putconn(conn)
# ---------------------------------------------

# from video "PostgreSQL in Python - Crash Course" (NeuralNine, 2023)
# database connection
# commentign out for the moment while working on the connection pool
# TODO - remove?
# def get_conn():
#     conn = psycopg2.connect(
#         host="localhost",
#         database="master",
#         user="postgres",
#         password="newpword3",
#         port=5432)
#     try:
#         yield conn
#     finally:
#         conn.close()

# -----------------------------------------------------------
# The below code defines the pydantic data models
# These models will be used in the below endpoints
# This code is adapted for my models from (Tech With Tim, 2024)

# User Story 1: creating the listings
class BranchProducts(BaseModel):
    product_id: str  # UUID as string
    product_name: str


# Listing Item input
class ListingLineItem(BaseModel):
    product_id: str
    quantity: int


# Combining the line items into one list
class Listing(BaseModel):
    user_branch_id: str
    items: List[ListingLineItem]


# Listing Output
# Creating the listing generates the UUID for the listing entity
class ListingOutput(BaseModel):
    listing_id: str


# User Story 2: Claiming the items
#
class ListingItemAvailable(BaseModel):
    listing_line_item_id: str
    product_id: str
    product_name: str
    quantity: int # This now represents quantity available, not quantity inputted!


class ListingAvailable(BaseModel):
    listing_id: str
    org_name: Optional[str] = None
    branch_name: Optional[str] = None
    items: List[ListingItemAvailable]


class ClaimItem(BaseModel):
    listing_line_item_id: str
    quantity: int


class Claim(BaseModel):
    user_branch_id: str  # charity user making the claim
    items: List[ClaimItem]


class ClaimOutput(BaseModel):
    claim_id: str


# User Story 4: Editing the Items
class UpdateLineItem(BaseModel):
    listing_line_item_id: str
    quantity: int  # new remaining quantity for this line item


class UpdateListingInput(BaseModel):
    user_branch_id: str
    listing_id: str
    items: List[UpdateLineItem]


class UpdateListingOutput(BaseModel):
    updated_amt: int


class CancelListing(BaseModel):
    user_branch_id: str
    listing_id: str


class CancelListingOutput(BaseModel):
    listing_id: str
    zeroed_amt: int


# User Story 5
# TODO: ADD SOURCES AND REFERENCES
# Claim Approval Models
class ClaimItemDetail(BaseModel):
    # Details of a single item in a claim
    product_name: str
    quantity: int
    listing_line_item_id: str

class PendingClaimDetail(BaseModel):
    # Details of a claim waiting for approval
    claim_id: str
    user_id: str
    user_email: Optional[str] = None
    org_name: Optional[str] = None
    created_at: str
    approved: bool
    items: List[ClaimItemDetail]
    total_items: int


# Request to approve a claim
class ApproveClaimRequest(BaseModel):
    claim_id: str
    user_branch_id: str


# Response after approving a claim
class ApproveClaimResponse(BaseModel):
    claim_id: str
    approved: bool
    message: str

# Pickups
# Details of a user's approved claim for pickup
class PickupDetail(BaseModel):
    claim_id: str
    approved: bool
    complete: bool
    org_name: str
    branch_name: str
    branch_location: str
    total_items: int
    approved_at: Optional[str] = None


# Request to verify a pickup using a QR code
class VerifyPickupRequest(BaseModel):
    qr_code: str
    user_branch_id: str  # Store worker's branch

# Response after verifying the pickup
class VerifyPickupResponse(BaseModel):
    pickup_id: str
    claim_id: str
    success: bool
    message: str
    charity_name: Optional[str] = None
    items: List[dict]



# -----------------------------------------------
# The below code defines the endpoints
# This is adapted from (Tech With Tim, 2024)
@app.get("/get_products", response_model=List[BranchProducts])  # get endpoint that will return all the products for the branch
def get_products(
        branch_id: str = Query(..., description="Branch ID to get products for"),
        conn=Depends(get_conn),
):
        # Database interaction (NeuralNine, 2023)
        with conn, conn.cursor() as cur:
            cur.execute(
            """
            SELECT product_id, product_name
            FROM product
            WHERE branch_id = %s
            ORDER BY product_name;
            
            """,
            (branch_id,),
            )
            rows = cur.fetchall()
        # Returning a list of BranchProducts
        return [
            BranchProducts(product_id=str(r[0]), product_name=r[1])
            for r in rows
            ]

@app.post("/listing", response_model=ListingOutput)
def make_listing(payload: Listing, conn=Depends(get_conn)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="No items provided")

    with conn:
        with conn.cursor() as cur:
            # creating the listing
            cur.execute(
                """
                INSERT INTO listing ( user_branch_id)
                VALUES(%s)
                RETURNING listing_id;
                """,
                (payload.user_branch_id,),
            )
            listing_id = cur.fetchone()[0]

            cur.executemany(
                """
                INSERT INTO listing_line_item (listing_id, product_id, quantity)
                VALUES (%s, %s, %s)
                """,
                [(listing_id, it.product_id, it.quantity) for it in payload.items],
            )

    return ListingOutput(listing_id=str(listing_id))


@app.get("/listings", response_model=List[ListingAvailable])
def list_claimable_listings(conn=Depends(get_conn)):
    with conn, conn.cursor() as cur:
        #  Fetch listings
        cur.execute("""
            SELECT l.listing_id, o.org_name, b.branch_name
            FROM listing l 
            JOIN user_branch ub ON ub.user_branch_id = l.user_branch_id
            JOIN branch b ON b.branch_id = ub.branch_id
            JOIN organisation o ON o.org_id = ub.org_id
            ORDER BY l.listing_id
        """)
        listings = cur.fetchall()
        if not listings:
            return []

        listing_ids = [row[0] for row in listings]

        # fetching all line items for these listings, returning the available quantity
        cur.execute("""
            SELECT
            lli.listing_id, lli.listing_line_item_id, lli.product_id, p.product_name,
            lli.quantity AS available_qty
            FROM listing_line_item lli
            JOIN product p ON p.product_id = lli.product_id
            WHERE lli.listing_id= ANY(%s::uuid[])
            AND lli.quantity >=1 --only items with quantity available
            ORDER BY p.product_name
        """, (listing_ids,))
        rows = cur.fetchall()

    # grouping items by listing_id
    items_by_listing = {}
    for lid, lli_id, pid, pname, qty in rows:
        items_by_listing.setdefault(lid, []).append(
            ListingItemAvailable(
                listing_line_item_id=str(lli_id),
                product_id=str(pid),
                product_name=pname,
                quantity=int(qty),  # this now maps to available_qty in the above SQL

            )
        )
    # response
    listing_list: List[ListingAvailable] = []
    for lid, org_name, bname in listings:
        # if no items found, returns empty list
        items = items_by_listing.get(lid, [])
        if not items:
            continue
        listing_list.append(
            ListingAvailable(
                listing_id=str(lid),
                org_name=org_name,
                branch_name=bname,
                items = items
            )
        )
    return listing_list

# Listings per branch
@app.get("/get_listings",
         response_model=List[ListingAvailable])  # get endpoint that will return all the listings for the branch
def get_listings_by_branch(
        branch_id: str = Query(..., description="Branch ID to get listings for"),
        conn=Depends(get_conn),
):
    with conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT l.listing_id
            FROM listing l 
            JOIN user_branch ub ON ub.user_branch_id = l.user_branch_id
            JOIN branch b ON b.branch_id = ub.branch_id
            WHERE b.branch_id = %s
            ORDER BY l.listing_id

            """,
            (branch_id,),
        )
        listing_rows = cur.fetchall()
        if not listing_rows:
            return[]

        listing_ids = [row[0] for row in listing_rows]

        # Fetching the line items
        cur.execute(
            """
            SELECT lli.listing_id, lli.listing_line_item_id, lli.product_id, p.product_name,lli.quantity AS available_qty
            FROM listing_line_item lli
            JOIN product p ON p.product_id = lli.product_id
            WHERE lli.listing_id = ANY(%s::uuid[])
            AND lli.quantity >= 1
            ORDER BY p.product_name
            """,
            (listing_ids,))
        item_rows = cur.fetchall()

        # Grouping items by listing_id
        items_by_listing = {}
        for lid, lli_id, pid, pname, qty in item_rows:
            items_by_listing.setdefault(lid, []).append(
                ListingItemAvailable(
                    listing_line_item_id=str(lli_id),
                    product_id=str(pid),
                    product_name=pname,
                    quantity=int(qty),
                )
            )
        # Response
        output: List[ListingAvailable] = []
        for (lid,) in listing_rows:  # '(,)' so lid is the uuid, not the tuple
            items = items_by_listing.get(lid, [])
            if not items:
                continue
            output.append(
                ListingAvailable(
                    listing_id=str(lid),
                    items=items,
                )
            )
    return output


# Editing Listings
@app.patch("/listing/items", response_model=UpdateListingOutput)
def update_listing_items(payload: UpdateListingInput, conn=Depends(get_conn)):
    with conn:
        with conn.cursor() as cur:
            # Lock the listing row while we are updating to prevent race conditions (Yamamoto, 2025)
            cur.execute(
                """
                SELECT listing_id
                FROM listing
                WHERE listing_id = %s AND user_branch_id = %s
                FOR UPDATE
                """,
                (payload.listing_id, payload.user_branch_id))
            row = cur.fetchone()
            if row is None:
                raise HTTPException(404, "Listing not found for this branch")

            # Validating Inputs
            for it in payload.items:
                if it.quantity < 0:
                    raise HTTPException(400, "Quantity must be >= 0")

            updated = 0
            for it in payload.items:
                # Only updating items that are in this listing
                cur.execute(
                    """
                    UPDATE listing_line_item
                    SET quantity = %s
                    WHERE listing_id = %s 
                    AND listing_line_item_id = %s
                    """, (it.quantity, payload.listing_id, it.listing_line_item_id),
                )
                updated += cur.rowcount
    return UpdateListingOutput(updated_amt=updated)

# Canceling a Listing
@app.post("/listing/cancel", response_model= CancelListingOutput)
def cancel_listing(payload: CancelListing, conn=Depends(get_conn)):
    with conn:
        with conn.cursor() as cur:
            # Locking listing row:
            cur.execute(
                """
                SELECT listing_id
                FROM listing
                WHERE listing_id = %s
                AND user_branch_id = %s
                FOR UPDATE            
                """,
                (payload.listing_id, payload.user_branch_id)
            )
            row = cur.fetchone()
            if row is None:
                raise HTTPException(404, "Listing not found for this branch")

            # Set remaining quantities to zero
            cur.execute(
                """
                UPDATE listing_line_item
                SET quantity = 0
                WHERE listing_id = %s
                """,
                (payload.listing_id,)
            )
            zeroed = cur.rowcount
    return CancelListingOutput(listing_id=str(payload.listing_id), zeroed_amt=zeroed)

# Making a claim, preventing over-claims
@app.post("/claims", response_model=ClaimOutput)
def create_claim(payload: Claim, conn=Depends(get_conn)):
    if not payload.items:
        raise HTTPException(400, "No items provided")

    with conn:
        with conn.cursor() as cur:
            # Creating the claim, generating a unique id
            cur.execute(
                """
                INSERT INTO claim (user_branch_id)
                VALUES (%s)
                RETURNING claim_id
                """,
                (payload.user_branch_id,),
            )
            claim_id = cur.fetchone()[0]

            # Checking availability of each claim item as it is requested
            for it in payload.items:
                if it.quantity < 0:
                    raise HTTPException(400, "Quantity must be >=0")

                # Locking the listing line item row to avoid race conditions while we check availability(Yamamoto, 2025)
                # Preventing two claim requests for the same items at the same time
                cur.execute(
                    """
                    SELECT quantity
                    FROM listing_line_item
                    WHERE listing_line_item_id=%s
                    FOR UPDATE 
                    """,
                    (it.listing_line_item_id,),
                )

                # Confirming if the row exists
                # Returns none if the listing_line_item_id does not reference an existing listing line item
                # row is the tuple returned by cur.fetchone from the above cur.execute statement (storing only the quantity)
                row = cur.fetchone()
                if row is None:
                    raise HTTPException(404, f"listing line item not found: {it.listing_line_item_id}")

                remaining = int(row[0])
                if it.quantity > remaining:
                    raise HTTPException(
                        400,
                        f"Not enough available for item {it.listing_line_item_id}"
                        f"(Requested {it.quantity}, but only {remaining} available of this item)."
                    )

                # Updating remaining quantity into the table
                cur.execute(
                    """
                    UPDATE listing_line_item
                    SET quantity = quantity - %s
                    WHERE listing_line_item_id = %s
                    """,
                    (it.quantity, it.listing_line_item_id)
                )


                # Adding the values per item in listing claim table
                cur.execute(
                    """
                    INSERT INTO listing_claim_item (claim_id, listing_line_item_id, quantity)
                    VALUES (%s, %s, %s)
                    """,
                    (claim_id, it.listing_line_item_id, it.quantity),
                )
    return ClaimOutput(claim_id=str(claim_id))

# User story 5
# TODO: ADD SOURCE AND REFERENCE !!
# Claims pending approval
@app.get("/claims/pending", response_model=List[PendingClaimDetail])
def get_pending_claims(
        branch_id: str = Query(..., description="Branch ID to get pending claims for"),
        conn=Depends(get_conn)
):
    # Getting all unapproved claims for a specific branch.
    # Used by store workers to see which claims need approval.
    with conn, conn.cursor() as cur:
        # Get all unapproved claims for listings from this branch
        cur.execute("""
            SELECT DISTINCT
                c.claim_id,
                ub_charity.user_id,
                c.created_at,
                c.approved,
                au.user_email,
                o.org_name
            FROM claim c
            -- Getting charity user info via user_brandh_id:
            JOIN user_branch ub_charity ON ub_charity.user_branch_id = c.user_branch_id
            JOIN app_user au ON au.user_id = ub_charity.user_id
            JOIN organisation o ON o.org_id = ub_charity.org_id
            -- Getting claims for listings from this branch
            JOIN listing_claim_item lci ON lci.claim_id = c.claim_id
            JOIN listing_line_item lli ON lli.listing_line_item_id = lci.listing_line_item_id
            JOIN listing l ON l.listing_id = lli.listing_id
            JOIN user_branch ub_store ON ub_store.user_branch_id = l.user_branch_id
            WHERE ub_store.branch_id = %s
            AND c.approved = FALSE
            ORDER BY c.created_at DESC
        """, (branch_id,))

        claims = cur.fetchall()

        if not claims:
            return []

        claim_ids = [row[0] for row in claims]

        # Getting all items for these claims
        cur.execute("""
            SELECT
                lci.claim_id,
                p.product_name,
                lci.quantity,
                lci.listing_line_item_id
            FROM listing_claim_item lci
            JOIN listing_line_item lli ON lli.listing_line_item_id = lci.listing_line_item_id
            JOIN product p ON p.product_id = lli.product_id
            WHERE lci.claim_id = ANY(%s::uuid[])
            ORDER BY p.product_name
        """, (claim_ids,))

        items_rows = cur.fetchall()

        # Group items by claim_id
        items_by_claim = {}
        for claim_id, product_name, quantity, lli_id in items_rows:
            items_by_claim.setdefault(claim_id, []).append(
                ClaimItemDetail(
                    product_name=product_name,
                    quantity=int(quantity),
                    listing_line_item_id=str(lli_id)
                )
            )

        # Building response
        result = []
        for claim_id, user_id, created_at, approved, user_email, org_name in claims:
            items = items_by_claim.get(claim_id, [])
            total_items = sum(item.quantity for item in items)

            result.append(PendingClaimDetail(
                claim_id=str(claim_id),
                user_id=str(user_id),
                user_email=user_email,
                org_name=org_name,
                created_at=created_at.isoformat() if created_at else "",
                approved=approved,
                items=items,
                total_items=total_items
            ))

        return result

# Approving Claims
@app.post("/claims/approve", response_model=ApproveClaimResponse)
def approve_claim(payload: ApproveClaimRequest, conn=Depends(get_conn)):
    # Approving a claim, automatically generating a QR code for pickup
    with conn:
        with conn.cursor() as cur:
            # Verify the claim exists
            cur.execute(
                """
                SELECT c.claim_id, c.approved, ub.user_id
                FROM claim c
                JOIN user_branch ub on ub.user_branch_id = c.user_branch_id
                WHERE c.claim_id = %s
                FOR UPDATE
                """,
                (payload.claim_id,)
            )

            claim_row = cur.fetchone()

            if not claim_row:
                raise HTTPException(404, "Claim not found")

            claim_id, already_approved, charity_user_id = claim_row

            if already_approved:
                raise HTTPException(400, "Claim has already been approved")

            # Getting the store worker's user_branch_id
            cur.execute(
                """
                SELECT user_id
                FROM user_branch
                WHERE user_branch_id = %s
                """,
                (payload.user_branch_id,)
            )

            store_user_row = cur.fetchone()
            if not store_user_row:
                raise HTTPException(404, "Store worker branch not found")

            store_user_id = store_user_row[0]

            # Verify this claim is for items from this store's branch
            cur.execute(
                """
                SELECT COUNT(*)
                FROM listing_claim_item lci
                JOIN listing_line_item lli ON lli.listing_line_item_id = lci.listing_line_item_id
                JOIN listing l ON l.listing_id = lli.listing_id
                WHERE lci.claim_id = %s
                AND l.user_branch_id = %s
                """,
                (payload.claim_id, payload.user_branch_id)
            )

            count = cur.fetchone()[0]

            if count == 0:
                raise HTTPException(403, "This claim is not for items from your branch")

            # Approving the claim
            cur.execute(
                """
                UPDATE claim
                SET approved = TRUE,
                    approved_by = %s
                WHERE claim_id = %s
                """,
                (store_user_id, payload.claim_id)
            )
            # Generating QR code for pickup
            qr_code = generate_secure_token()

            # Creating a pickup record
            cur.execute(
                """
                INSERT INTO pickup (claim_id, qr_code, complete)
                VALUES (%s, %s, FALSE)
                """,
                (payload.claim_id, qr_code)
            )

            return ApproveClaimResponse(
                claim_id=str(payload.claim_id),
                approved=True,
                message="Claim approved successfully"
            )

# Get QR code
@app.get("/pickup/qr/{claim_id}")
def get_pickup_qr(
        claim_id: str,
        user_branch_id:str = Query(..., description="User branch ID of charity that made the claim"),
        conn=Depends(get_conn)
):
    # getting the QR code for the specific claim
    with conn, conn.cursor() as cur:
        # Verifying the claim belongs to this user branch
        cur.execute(
            """
            SELECT claim_id, approved
            FROM claim
            WHERE claim_id = %s AND user_branch_id = %s
            """,
            (claim_id, user_branch_id)
        )

        claim = cur.fetchone()
        if not claim:
            raise HTTPException(404, "Claim not found")
        # claim not approved
        # TODO source for the errors
        if not claim[1]:
            raise HTTPException(400, "Claim not approved yet")

        # Getting pickup details
        cur.execute(
            """
            SELECT pickup_id, qr_code, complete, created_at
            FROM pickup
            WHERE claim_id = %s
            """,
            (claim_id,)
        )
        pickup = cur.fetchone()
        if not pickup:
            raise HTTPException(404, "QR code not generated yet")

        pickup_id, qr_code, complete, created_at = pickup

        # Generating QR code image using the utitlity funciton
        qr_image = generate_qr_code(qr_code)

        # Getting claim and store info
        cur.execute(
            """
            SELECT
            p.product_name,
            lci.quantity,
                o.org_name,
                b.branch_name,
                b.branch_location
            FROM listing_claim_item lci
            JOIN listing_line_item lli ON lli.listing_line_item_id = lci.listing_line_item_id
            JOIN product p ON p.product_id = lli.product_id
            JOIN listing l ON l.listing_id = lli.listing_id
            JOIN user_branch ub ON ub.user_branch_id = l.user_branch_id
            JOIN branch b ON b.branch_id = ub.branch_id
            JOIN organisation o ON o.org_id = b.org_id
            WHERE lci.claim_id = %s
            ORDER BY p.product_name
            """,
            (claim_id,)
        )

        items_rows = cur.fetchall()

        items = []
        store_info = {}

        if items_rows:
            store_info = {
                "org_name": items_rows[0][2],
                "branch_name": items_rows[0][3],
                "branch_location": items_rows[0][4]
            }
            items = [
                {
                    "product_name": row[0],
                    "quantity": int(row[1])
                }
                for row in items_rows
            ]
        return {
            "pickup_id": str(pickup_id),
            "claim_id": str(claim_id),
            "qr_code": qr_code,
            "qr_code_image": qr_image,
            "complete": complete,
            "created_at": created_at.isoformat() if created_at else None,
            "items": items,
            "store_info": store_info
        }

# Getting all approved claims for a charity user, showing pickups ready for collection.
@app.get("/pickups/my-pickups", response_model=List[PickupDetail])
def get_my_pickups(
        branch_id: str = Query(..., description="Branch ID of charity to get pickups for"),
        conn=Depends(get_conn)
):
    with conn, conn.cursor() as cur:
        cur.execute("""
            SELECT DISTINCT
                c.claim_id,
                c.approved,
                COALESCE(p.complete, FALSE) as complete,
                store_o.org_name,
                store_b.branch_name,
                store_b.branch_location,
                c.approved_at
            FROM claim c
            LEFT JOIN pickup p ON p.claim_id = c.claim_id
            -- Getting the charity user's branch :
            JOIN user_branch ub_charity ON ub_charity.user_branch_id = c.user_branch_id
            -- Getting store branch details from listing
            JOIN listing_claim_item lci ON lci.claim_id = c.claim_id
            JOIN listing_line_item lli ON lli.listing_line_item_id = lci.listing_line_item_id
            JOIN listing l ON l.listing_id = lli.listing_id
            JOIN user_branch ub_store ON ub_store.user_branch_id = l.user_branch_id
            JOIN branch store_b ON store_b.branch_id = ub_store.branch_id
            JOIN organisation store_o ON store_o.org_id = ub_store.org_id
            WHERE ub_charity.branch_id = %s
            AND c.approved = TRUE
            ORDER BY c.approved_at DESC
        """, (branch_id,))

        claims = cur.fetchall()

        if not claims:
            return []

        claim_ids = [row[0] for row in claims]

        # Getting total items for each claim
        cur.execute(
            """
            SELECT lci.claim_id, SUM(lci.quantity) as total_qty
            FROM listing_claim_item lci
            WHERE lci.claim_id = ANY(%s::uuid[])
            GROUP BY lci.claim_id
            """,
            (claim_ids,))

        totals_rows = cur.fetchall()
        totals_by_claim = {row[0]: int(row[1]) for row in totals_rows}

        # Building response
        result = []
        for claim_id, approved, complete, org_name, branch_name, branch_location, approved_at in claims:
            total_items = totals_by_claim.get(claim_id, 0)

            result.append(PickupDetail(
                claim_id=str(claim_id),
                approved=approved,
                complete=complete,
                org_name=org_name,
                branch_name=branch_name,
                branch_location=branch_location,
                total_items=total_items,
                approved_at=approved_at.isoformat() if approved_at else None
            ))

        return result


# Verify a pickup by scanning QR code done by the store worker when a charity volunteer shows QR code
@app.post("/pickup/verify", response_model=VerifyPickupResponse)
def verify_pickup(payload: VerifyPickupRequest, conn=Depends(get_conn)):
    with conn:
        with conn.cursor() as cur:
            # Find pickup by QR code
            cur.execute(
                """
                SELECT p.pickup_id, p.claim_id, p.complete, c.user_branch_id
                FROM pickup p
                JOIN claim c ON c.claim_id = p.claim_id
                WHERE p.qr_code = %s
                FOR UPDATE
                """,
                (payload.qr_code,)
            )

            pickup_row = cur.fetchone()

            if not pickup_row:
                raise HTTPException(404, "Invalid QR code")

            pickup_id, claim_id, complete, charity_user_branch_id = pickup_row

            if complete:
                raise HTTPException(400, "This pickup has already been completed")

            # Get items and verify branch
            cur.execute(
                """
                SELECT 
                    lci.listing_claim_item_id, 
                    lci.quantity,
                    lli.listing_id,
                    lli.product_id,
                    p.product_name,
                    l.user_branch_id 
                FROM listing_claim_item lci
                JOIN listing_line_item lli ON lli.listing_line_item_id = lci.listing_line_item_id
                JOIN listing l ON l.listing_id = lli.listing_id
                JOIN product p ON p.product_id = lli.product_id
                WHERE lci.claim_id = %s
                """,
                (claim_id,)
            )

            items_rows = cur.fetchall()

            if not items_rows:
                raise HTTPException(404, "No items found for this claim")

            # Verifying store worker's branch matches
            listing_user_branch_id = items_rows[0][5] # gets the 5th position from the select statement (l.user_branch_id)

            if str(listing_user_branch_id) != payload.user_branch_id:
                raise HTTPException(
                    403,
                    "This pickup is for a different branch"
                )

            # Getting charity organisation name
            cur.execute(
                """
                SELECT o.org_name, b.branch_name
                FROM user_branch ub
                JOIN organisation o ON o.org_id = ub.org_id
                JOIN branch b ON b.branch_id = ub.branch_id
                WHERE ub.user_branch_id = %s
                """,
                (charity_user_branch_id,)
            )

            charity_row = cur.fetchone()
            charity_name = f"{charity_row[0]} - {charity_row[1]}" if charity_row else "Unknown"

            # Mark pickup as complete
            cur.execute(
                """
                UPDATE pickup
                SET complete = TRUE
                WHERE pickup_id = %s
                """,
                (pickup_id,)
            )

            # Format items for response
            items = [
                {
                    "product_name": row[4],
                    "quantity": int(row[1])
                }
                for row in items_rows
            ]

            return VerifyPickupResponse(
                pickup_id=str(pickup_id),
                claim_id=str(claim_id),
                success=True,
                message=f"Pickup verified! Please give {charity_name} their items.",
                charity_name=charity_name,
                items=items
            )


# Testing suggested by ChatGPT (ChatGPT, 2025)
# for web frontend
@app.get("/", tags=["meta"])
def root():
    return {"status": "ok", "docs": "/docs"}

# Shutdown event to close connection pool (Chowdhury, 2025)
# TODO: remove print staemtn
@app.on_event("shutdown")
def shutdown_event():
    if connection_pool:
        connection_pool.closeall()
        print("Connection pool closed")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

# REFERENCES
# ChatGPT. (2025, November 7). Retrieved from chatgpt.com: https://chatgpt.com/c/69176485-1458-8331-b053-4df0abe35697
# ChatGPT. (2025, November 11). Retrieved from chatgpt.com: https://chatgpt.com/c/69203ef4-2430-8326-be09-e8e39fed78c5
# NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youtube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s
# Tim, T. W. (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend. Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4
# W3 Schools. (2025, November 16). SQL Server COALESCE() Function. Retrieved from w3schools.com: https://www.w3schools.com/sql/func_sqlserver_coalesce.asp
# Yamamoto, T. (2025, August 22). Preventing Race Conditions with SELECT FOR UPDATE in Web Applications. Retrieved from leapcell.io: https://leapcell.io/blog/preventing-race-conditions-with-select-for-update-in-web-applications

