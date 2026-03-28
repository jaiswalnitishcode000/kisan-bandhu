<div align="center">


<br/>

<img src="https://github.com/user-attachments/assets/23160e68-f6db-4612-885e-4b89da934c7a" width="72" height="72" alt="Kisan Bandhu Logo" />

<h1 style="margin-top: 8px;">Kisan Bandhu</h1>

<p><em>Smart Crop Advisory & Farmer Marketplace Platform</em></p>

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=for-the-badge)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Python%20%2B%20FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Maps](https://img.shields.io/badge/Maps-OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)

<br/>

> **Empowering Indian farmers** through technology — eliminating middlemen, ensuring fair pricing, and delivering real-time agricultural intelligence.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Future Roadmap](#future-roadmap)
- [Vision](#vision)
- [Team](#team)
- [License](#license)

---

## Overview

**Kisan Bandhu** is a full-stack digital platform designed to bridge the gap between Indian farmers and the modern marketplace. By combining a direct buyer-seller marketplace with intelligent crop advisory tools, the platform aims to maximize farmer income and reduce dependency on exploitative supply chains.

---

## Problem Statement

Indian farmers consistently face systemic challenges that limit their economic potential:

| Challenge | Impact |
|---|---|
| Middlemen exploitation | Reduced profit margins for farmers |
| No real-time crop advisory | Poor crop planning and yield decisions |
| Unfair and opaque pricing | Inability to negotiate fair market value |
| Limited scheme awareness | Missed government subsidies and benefits |
| Poor market transparency | Uninformed selling decisions |

---

## Solution

Kisan Bandhu addresses these challenges through a unified digital platform:

- **Direct Farmer-to-Buyer Marketplace** — eliminating intermediaries and enabling fair trade
- **Smart Crop Advisory System** — data-driven recommendations for better yield
- **MSP Price Calculator** — real-time Minimum Support Price visibility
- **Subsidy Calculator** — instant access to eligible government subsidies
- **Government Scheme Portal** — centralized awareness of agricultural schemes
- **Transparent Digital Infrastructure** — secure, traceable, and accountable transactions

---

## Features

### Marketplace
A direct listing and purchasing platform where farmers can sell produce directly to buyers without intermediaries.

### Crop Advisory
Intelligent advisory system providing crop selection guidance, sowing schedules, and disease management tips based on season and region.

### MSP Calculator
Real-time Minimum Support Price calculator to help farmers understand the floor value of their produce.

### Subsidy Calculator
Tool to calculate applicable government subsidies based on crop type, land size, and state.

### Government Schemes Portal
Curated, searchable database of central and state government agricultural schemes with eligibility details.

### Authentication System
Secure user registration and login for farmers, buyers, and administrators.

### Responsive Design
Fully mobile-responsive interface designed for accessibility across devices, including low-end smartphones.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React + Vite | UI framework and build tooling |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side routing |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Python + FastAPI | REST API server |
| Uvicorn | ASGI server |
| SQLite | Lightweight relational database |
| Swagger UI | Interactive API documentation |

---

## Project Structure
```
kisan-bandhu/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route-level page components
│       ├── context/           # React context providers
│       ├── hooks/             # Custom React hooks
│       ├── lib/               # Utility functions and helpers
│       ├── assets/            # Static assets (images, icons)
│       ├── App.tsx            # Root application component
│       └── main.tsx           # Application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── main.py                # FastAPI application and route definitions
│   ├── kisan_bandhu.db        # SQLite database file
│   ├── venv/                  # Python virtual environment
│   └── __pycache__/
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- Python >= 3.9
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/jaiswalnitishcode000/kisan-bandhu.git
cd kisan-bandhu
```

### 2. Start the Backend
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn

# Run the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`  
Interactive API docs (Swagger UI): `http://localhost:8000/docs`

### 3. Start the Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Future Roadmap

| Feature | Description |
|---|---|
| Weather API Integration | Real-time weather data for crop planning |
| AI Crop Prediction | Machine learning-based yield and disease prediction |
| Payment Gateway | Secure in-platform digital payments |
| Logistics Tracking | End-to-end order and delivery management |
| Multi-language Support | Hindi, English, and regional language interfaces |
| Farmer Analytics Dashboard | Income trends, sales history, and crop performance |
| Mobile App | React Native application for iOS and Android |

---

## Vision

To digitally transform Indian agriculture by creating a transparent, fair, and technology-driven ecosystem — one where every farmer has equal access to markets, information, and opportunity.

---

## Team

<div align="center">

**Team ANTS**

| Name |
|---|
| Nitish Jaiswal |
| Shashank Mishra |
| Avika Garg |

</div>

---

## License

This project is licensed under the [MIT License](LICENSE).
```
MIT License

Copyright (c) 2024 Team ANTS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=2d6a4f&height=100&section=footer"/>
</div>
