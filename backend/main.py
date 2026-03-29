from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = sqlite3.connect("kisan_bandhu.db", check_same_thread=False)
cursor = conn.cursor()

# ✅ USERS TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'farmer'
)
""")

# ✅ FARMER PROFILES TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    state TEXT,
    district TEXT,
    land_size TEXT,
    has_land INTEGER DEFAULT 1,
    aadhaar TEXT,
    bank_account TEXT,
    bank_ifsc TEXT,
    FOREIGN KEY (email) REFERENCES users(email)
)
""")

# ✅ BUYER PROFILES TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS buyer_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    city TEXT,
    state TEXT,
    business_type TEXT DEFAULT 'individual',
    company_name TEXT,
    gst_number TEXT,
    FOREIGN KEY (email) REFERENCES users(email)
)
""")

# ✅ FARMERS (CROP LISTINGS) TABLE
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

# ✅ BIDS TABLE
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
# 👤 AUTH
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class FarmerProfileData(BaseModel):
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    land_size: Optional[str] = None
    has_land: Optional[bool] = True
    aadhaar: Optional[str] = None
    bank_account: Optional[str] = None
    bank_ifsc: Optional[str] = None

class BuyerProfileData(BaseModel):
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    business_type: Optional[str] = "individual"
    company_name: Optional[str] = None
    gst_number: Optional[str] = None

class SignupModel(BaseModel):
    name: str
    email: str
    password: str
    role: str = "farmer"
    profile: Optional[dict] = None

class LoginModel(BaseModel):
    email: str
    password: str


@app.post("/signup")
def signup(data: SignupModel):
    cursor.execute("SELECT id FROM users WHERE email = ?", (data.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    cursor.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        (data.name, data.email, data.password, data.role)
    )
    conn.commit()

    # ✅ Profile save karo
    if data.profile:
        if data.role == "farmer":
            p = data.profile
            cursor.execute("""
                INSERT OR REPLACE INTO farmer_profiles
                (email, phone, state, district, land_size, has_land, aadhaar, bank_account, bank_ifsc)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data.email,
                p.get("phone"), p.get("state"), p.get("district"),
                p.get("land_size"), 1 if p.get("has_land") else 0,
                p.get("aadhaar"), p.get("bank_account"), p.get("bank_ifsc")
            ))
        elif data.role == "buyer":
            p = data.profile
            cursor.execute("""
                INSERT OR REPLACE INTO buyer_profiles
                (email, phone, city, state, business_type, company_name, gst_number)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                data.email,
                p.get("phone"), p.get("city"), p.get("state"),
                p.get("business_type"), p.get("company_name"), p.get("gst_number")
            ))
        conn.commit()

    return {
        "status": "success",
        "user": {"name": data.name, "email": data.email, "role": data.role}
    }


@app.post("/login")
def login(data: LoginModel):
    if data.email == "teamants@gmail.com" and data.password == "teamants":
        return {"status": "success", "user": {"name": "Admin", "email": data.email, "role": "admin"}}

    cursor.execute(
        "SELECT name, email, role FROM users WHERE email = ? AND password = ?",
        (data.email, data.password)
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"status": "success", "user": {"name": row[0], "email": row[1], "role": row[2]}}


# ✅ Profile fetch API
@app.get("/profile/{email}")
def get_profile(email: str):
    cursor.execute("SELECT role FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = user[0]
    if role == "farmer":
        cursor.execute("SELECT * FROM farmer_profiles WHERE email = ?", (email,))
        row = cursor.fetchone()
        if row:
            return {
                "role": "farmer",
                "phone": row[2], "state": row[3], "district": row[4],
                "land_size": row[5], "has_land": bool(row[6]),
                "aadhaar": row[7], "bank_account": row[8], "bank_ifsc": row[9]
            }
    elif role == "buyer":
        cursor.execute("SELECT * FROM buyer_profiles WHERE email = ?", (email,))
        row = cursor.fetchone()
        if row:
            return {
                "role": "buyer",
                "phone": row[2], "city": row[3], "state": row[4],
                "business_type": row[5], "company_name": row[6], "gst_number": row[7]
            }
    return {"role": role}


# ✅ Profile update API
class ProfileUpdateModel(BaseModel):
    email: str
    role: str
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    land_size: Optional[str] = None
    has_land: Optional[bool] = True
    city: Optional[str] = None
    business_type: Optional[str] = None
    company_name: Optional[str] = None
    gst_number: Optional[str] = None

@app.put("/profile/update")
def update_profile(data: ProfileUpdateModel):
    if data.role == "farmer":
        cursor.execute("""
            INSERT OR REPLACE INTO farmer_profiles
            (email, phone, state, district, land_size, has_land)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (data.email, data.phone, data.state, data.district,
              data.land_size, 1 if data.has_land else 0))
    elif data.role == "buyer":
        cursor.execute("""
            INSERT OR REPLACE INTO buyer_profiles
            (email, phone, city, state, business_type, company_name, gst_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (data.email, data.phone, data.city, data.state,
              data.business_type, data.company_name, data.gst_number))
    conn.commit()
    return {"status": "updated"}


# ✅ Delete account API
@app.delete("/user/{email}")
def delete_user(email: str):
    cursor.execute("DELETE FROM farmer_profiles WHERE email = ?", (email,))
    cursor.execute("DELETE FROM buyer_profiles WHERE email = ?", (email,))
    cursor.execute("DELETE FROM bids WHERE buyer_email = ?", (email,))
    cursor.execute("DELETE FROM farmers WHERE farmer_email = ?", (email,))
    cursor.execute("DELETE FROM users WHERE email = ?", (email,))
    conn.commit()
    return {"status": "deleted"}


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
    cursor.execute("SELECT buyer_name, amount, status FROM bids WHERE listing_id = ?", (listing_id,))
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
    cursor.execute("SELECT * FROM farmers WHERE status = 'open'")
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "id": row[0], "farmer_email": row[1], "name": row[2],
            "village": row[3], "crop": row[4], "crop_type": row[5],
            "quantity": row[6], "price": row[7], "status": row[8],
            "bids": get_bids_for_listing(row[0])
        })
    return result


@app.get("/my-listings/{email}")
def get_my_listings(email: str):
    cursor.execute("SELECT * FROM farmers WHERE farmer_email = ?", (email,))
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "id": row[0], "farmer_email": row[1], "name": row[2],
            "village": row[3], "crop": row[4], "crop_type": row[5],
            "quantity": row[6], "price": row[7], "status": row[8],
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
# 🗺️ MAP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
geo_cache = {}

async def geocode_village(village: str):
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
    cursor.execute("SELECT DISTINCT name, village, crop, farmer_email FROM farmers WHERE status = 'open'")
    farmer_rows = cursor.fetchall()
    result = []
    for row in farmer_rows:
        name, village, crop, email = row
        coords = await geocode_village(village)
        if coords:
            result.append({
                "type": "farmer", "name": name,
                "city": village, "lat": coords[0], "lng": coords[1], "crop": crop
            })
    return result