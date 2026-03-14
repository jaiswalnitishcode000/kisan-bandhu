from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DATABASE
conn = sqlite3.connect("kisan_bandhu.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS farmers(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT,
 village TEXT,
 crop TEXT,
 quantity INTEGER,
 price INTEGER
)
""")

conn.commit()


@app.get("/")
def home():
    return {"message": "Kisan Bandhu Backend Running 🚀"}


class Farmer(BaseModel):
    name: str
    village: str
    crop: str
    quantity: int
    price: int


@app.post("/add-farmer")
def add_farmer(farmer: Farmer):

    cursor.execute(
        "INSERT INTO farmers(name,village,crop,quantity,price) VALUES(?,?,?,?,?)",
        (farmer.name, farmer.village, farmer.crop, farmer.quantity, farmer.price)
    )

    conn.commit()

    return {"status": "success"}


@app.get("/farmers")
def get_farmers():

    cursor.execute("SELECT * FROM farmers")

    rows = cursor.fetchall()

    farmers = []

    for row in rows:
        farmers.append({
            "id": row[0],
            "name": row[1],
            "village": row[2],
            "crop": row[3],
            "quantity": row[4],
            "price": row[5]
        })

    return farmers