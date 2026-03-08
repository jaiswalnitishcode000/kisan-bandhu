from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

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

cursor.execute("""
CREATE TABLE IF NOT EXISTS farmers(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
village TEXT,
crop TEXT
)
""")

conn.commit()


@app.get("/")
def home():
    return {"message": "Kisan Bandhu Backend Running 🚀"}


@app.post("/add-farmer/{name}/{village}/{crop}/{quantity}/{price}")
def add_farmer(name: str, village: str, crop: str, quantity: int, price: int):

    cursor.execute(
        "INSERT INTO farmers(name, village, crop) VALUES(?,?,?)",
        (name, village, crop)
    )

    conn.commit()

    return {"message": "Farmer Added Successfully"}


@app.get("/farmers")
def get_farmers():

    cursor.execute("SELECT * FROM farmers")

    data = cursor.fetchall()

    return {"farmers": data}