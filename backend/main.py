from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import httpx

app = FastAPI()

# ✅ CORS - Frontend se connect hone ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DATABASE CONNECTION
conn = sqlite3.connect("kisan_bandhu.db", check_same_thread=False)
cursor = conn.cursor()

# ✅ USERS TABLE - Signup/Login ke liye
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'farmer'
)
""")

# ✅ FARMERS (CROP LISTINGS) TABLE - email add kiya filter ke liye
cursor.execute("""
CREATE TABLE IF NOT EXISTS farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_email TEXT NOT NULL,
    name TEXT,
    village TEXT,
    crop TEXT,
    crop_type TEXT DEFAULT 'grain',
    quantity INTEGER,
    price INTEGER,
    status TEXT DEFAULT 'open'
)
""")

# ✅ BIDS TABLE - Buyer bids ke liye
cursor.execute("""
CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (listing_id) REFERENCES farmers(id)
)
""")

conn.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🏠 HOME
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
@app.get("/")
def home():
    return {"message": "Kisan Bandhu Backend Running 🚀"}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 👤 AUTH - Signup & Login
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class SignupModel(BaseModel):
    name: str
    email: str
    password: str
    role: str = "farmer"

class LoginModel(BaseModel):
    email: str
    password: str


@app.post("/signup")
def signup(data: SignupModel):
    # Check karo email already exist karta hai ya nahi
    cursor.execute("SELECT id FROM users WHERE email = ?", (data.email,))
    existing = cursor.fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    cursor.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        (data.name, data.email, data.password, data.role)
    )
    conn.commit()

    return {
        "status": "success",
        "user": {
            "name": data.name,
            "email": data.email,
            "role": data.role
        }
    }


@app.post("/login")
def login(data: LoginModel):
    # Hard-coded admin check
    if data.email == "teamants@gmail.com" and data.password == "teamants":
        return {
            "status": "success",
            "user": {
                "name": "Admin",
                "email": data.email,
                "role": "admin"
            }
        }

    cursor.execute(
        "SELECT name, email, role FROM users WHERE email = ? AND password = ?",
        (data.email, data.password)
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "status": "success",
        "user": {
            "name": row[0],
            "email": row[1],
            "role": row[2]
        }
    }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🌾 CROP LISTINGS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class FarmerModel(BaseModel):
    farmer_email: str
    name: str
    village: str
    crop: str
    crop_type: str = "grain"
    quantity: int
    price: int


def get_bids_for_listing(listing_id):
    cursor.execute(
        "SELECT buyer_name, amount, status FROM bids WHERE listing_id = ?",
        (listing_id,)
    )
    rows = cursor.fetchall()
    return [{"buyerName": r[0], "amount": r[1], "status": r[2]} for r in rows]


@app.post("/add-farmer")
def add_farmer(farmer: FarmerModel):
    cursor.execute(
        "INSERT INTO farmers (farmer_email, name, village, crop, crop_type, quantity, price) VALUES (?,?,?,?,?,?,?)",
        (farmer.farmer_email, farmer.name, farmer.village, farmer.crop,
         farmer.crop_type, farmer.quantity, farmer.price)
    )
    conn.commit()
    return {"status": "success"}


@app.get("/farmers")
def get_all_farmers():
    """Marketplace ke liye - saari listings"""
    cursor.execute("SELECT * FROM farmers WHERE status = 'open'")
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "farmer_email": row[1],
            "name": row[2],
            "village": row[3],
            "crop": row[4],
            "crop_type": row[5],
            "quantity": row[6],
            "price": row[7],
            "status": row[8],
            "bids": get_bids_for_listing(row[0])
        })
    return result


@app.get("/my-listings/{email}")
def get_my_listings(email: str):
    """Farmer Dashboard - sirf apni listings"""
    cursor.execute("SELECT * FROM farmers WHERE farmer_email = ?", (email,))
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "farmer_email": row[1],
            "name": row[2],
            "village": row[3],
            "crop": row[4],
            "crop_type": row[5],
            "quantity": row[6],
            "price": row[7],
            "status": row[8],
            "bids": get_bids_for_listing(row[0])
        })
    return result


@app.delete("/listing/{listing_id}")
def delete_listing(listing_id: int):
    cursor.execute("DELETE FROM farmers WHERE id = ?", (listing_id,))
    conn.commit()
    return {"status": "deleted"}


@app.put("/listing/{listing_id}/sell")
def mark_as_sold(listing_id: int):
    cursor.execute("UPDATE farmers SET status = 'sold' WHERE id = ?", (listing_id,))
    conn.commit()
    return {"status": "marked as sold"}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 💰 BIDS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class BidModel(BaseModel):
    listing_id: int
    buyer_email: str
    buyer_name: str
    amount: int


@app.post("/bid")
def place_bid(bid: BidModel):
    # Check listing exist karta hai
    cursor.execute("SELECT id, status FROM farmers WHERE id = ?", (bid.listing_id,))
    listing = cursor.fetchone()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing[1] != "open":
        raise HTTPException(status_code=400, detail="Listing is already closed")

    cursor.execute(
        "INSERT INTO bids (listing_id, buyer_email, buyer_name, amount) VALUES (?,?,?,?)",
        (bid.listing_id, bid.buyer_email, bid.buyer_name, bid.amount)
    )
    conn.commit()
    return {"status": "bid placed"}


@app.put("/bid/{listing_id}/accept")
def accept_best_bid(listing_id: int):
    """Farmer highest bid accept kare"""
    cursor.execute(
        "UPDATE bids SET status = 'accepted' WHERE listing_id = ? AND amount = (SELECT MAX(amount) FROM bids WHERE listing_id = ?)",
        (listing_id, listing_id)
    )
    cursor.execute("UPDATE farmers SET status = 'sold' WHERE id = ?", (listing_id,))
    conn.commit()
    return {"status": "best bid accepted"}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 👥 ADMIN
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
@app.get("/admin/users")
def get_all_users():
    cursor.execute("SELECT name, email, role FROM users")
    rows = cursor.fetchall()
    return [{"name": r[0], "email": r[1], "role": r[2]} for r in rows]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🗺️ MAP - Farmers location
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Village → lat/lng cache (avoid repeated API calls)
geo_cache = {}

async def geocode_village(village: str):
    """Village name se lat/lng fetch karo (OpenStreetMap Nominatim)"""
    if village in geo_cache:
        return geo_cache[village]
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": f"{village}, India", "format": "json", "limit": 1},
                headers={"User-Agent": "KisanBandhu/1.0"},
                timeout=5.0
            )
            data = res.json()
            if data:
                lat = float(data[0]["lat"])
                lng = float(data[0]["lon"])
                geo_cache[village] = (lat, lng)
                return (lat, lng)
    except:
        pass
    return None


@app.get("/farmers/map")
async def get_farmers_map():
    """Map ke liye farmers + buyers with lat/lng"""
    # Farmers
    cursor.execute("SELECT DISTINCT name, village, crop, farmer_email FROM farmers WHERE status = 'open'")
    farmer_rows = cursor.fetchall()

    # Buyers (jo bids lagaye hain)
    cursor.execute("""
        SELECT DISTINCT u.name, u.email
        FROM users u
        WHERE u.role = 'buyer'
    """)
    buyer_rows = cursor.fetchall()

    result = []

    # Farmers geocode karo
    for row in farmer_rows:
        name, village, crop, email = row
        coords = await geocode_village(village)
        if coords:
            result.append({
                "type": "farmer",
                "name": name,
                "city": village,
                "lat": coords[0],
                "lng": coords[1],
                "crop": crop
            })

    # Buyers ke liye users table se city nahi hai
    # Unhe skip karo ya default location do
    # (future mein city add kar sakte hain signup pe)

    return result