# Helping Hands - Charity Discovery and Donation Platform (MERN)

> **Tagline:** "Small Help. Big Change."  
> A full-stack, transparent charity discovery and donation platform built with MongoDB, Express, React, Node.js, and Tailwind CSS.

---

## 🌟 Features

- **Full MERN Stack Architecture**: React.js frontend communicating via Axios REST API with Express.js Node backend and MongoDB Mongoose database.
- **100% Transparency & Real-Time Metrics**: Dynamic funding percentage calculations (`raisedAmount / targetAmount * 100`), donor counters, remaining target amounts, and project lifecycle updates.
- **Card-Based Cause Discovery**: High-converting campaign cards with emerald visual language, cover imagery, category badges, dynamic progress bars, and hover effects.
- **Nearly Funded ("Almost There") Section**: Highlights campaigns between 75% and 99% funded to encourage goal completion.
- **Interactive Explore & Search**: Search bar with real-time title/description filtering, category tabs, and sorting (Recently Added, Most Funded, Ending Soon, Nearly Funded).
- **Verified Trust Profiles**: Dedicated public profiles for audited NGOs displaying accreditation numbers, location, contact info, impact stats, active causes, and completed causes.
- **Simulated Donation Checkout & Receipt**: Select preset (₹100, ₹250, ₹500, ₹1000, ₹2500) or custom amounts, optional anonymous donor setting, instant campaign metric updates, and printable itemized tax-exemption receipt.
- **Authentication-Ready Admin Dashboard**: Complete management portal (`/admin`) for tracking stats, reviewing trusts, approving/completing campaigns, and auditing donor transactions.

---

## 🚀 Project Structure

```
helping-hands/
│
├── client/                     # React Vite Frontend App
│   ├── src/
│   │   ├── components/         # Reusable Navbar, Footer, CampaignCard, Skeletons
│   │   ├── pages/              # Public & Admin pages (Home, Explore, Details, Donate, Admin)
│   │   ├── services/           # Axios API bindings (api.js)
│   │   ├── utils/              # INR Currency formatters & date calculators
│   │   ├── App.jsx             # React Router v6 setup
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind directives
│   └── package.json
│
├── server/                     # Node.js + Express REST API Backend
│   ├── config/                 # Mongoose DB connection (db.js)
│   ├── controllers/            # Trust, Campaign, Donation, Admin controllers
│   ├── models/                 # Mongoose Schemas (Trust, Campaign, Donation, CampaignUpdate)
│   ├── routes/                 # Express API routes
│   ├── seed/                   # Database seeder (10 trusts, 20 campaigns, 35 demo donations)
│   └── server.js               # Main Express Server
│
├── .env                        # Local Environment Config
├── .env.example                # Environment Variable Template
├── README.md                   # Complete Documentation
└── package.json                # Root package for running client & server concurrently
```

---

## 🛠️ Quick Start & Installation

### Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** (v9.x or v10.x)
- **MongoDB** (Local `mongod` service or remote MongoDB Atlas connection URI)

### 1. Clone & Install Dependencies

Run from the root `helping-hands` directory:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

Or using the single root helper command:
```bash
npm run install:all
```

---

### 2. Configure Environment Variables

The project includes pre-configured `.env` files. You can customize `.env` in the root folder:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/helping-hands
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

### 3. Seed Database with Demo Data

Populate the database with **10 realistic Indian trusts**, **20 campaigns**, and **35 demo donations**:

```bash
# Run seeder script
npm run seed
```

Output:
```
Connecting to MongoDB at: mongodb://127.0.0.1:27017/helping-hands
Clearing existing database collections...
Inserting Trusts...
✓ Inserted 10 Trusts.
Inserting Campaigns & Updates...
✓ Inserted 20 Campaigns.
Generating 30+ Demo Donations...
✓ Inserted 35 Demo Donations.

=======================================
🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!
=======================================
```

---

### 4. Run the Full-Stack Application

Launch both the Express Backend (Port 5000) and React Vite Frontend (Port 5173) simultaneously:

```bash
npm run dev
```

- **Frontend App**: Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Express Backend API**: Running on [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

## 📡 REST API Reference

### Trusts
- `GET /api/trusts` — Retrieve all verified charity trusts (supports `?search=` and `?status=`).
- `GET /api/trusts/:id` — Get single trust profile with active & completed campaigns and impact metrics.
- `POST /api/trusts` — Create new charity trust.
- `PUT /api/trusts/:id` — Update trust details / verification status (`Verified`, `Pending`, `Rejected`, `Suspended`).
- `DELETE /api/trusts/:id` — Remove trust and associated campaigns.

### Campaigns
- `GET /api/campaigns` — Fetch campaigns with query parameters:
  - `?category=Education`
  - `?search=school`
  - `?sort=recent | most_funded | ending_soon | nearly_funded`
  - `?nearlyFunded=true` (filters 75% to 99% funded)
- `GET /api/campaigns/:id` — Get full campaign details, timeline updates, and donor statistics.
- `POST /api/campaigns` — Publish new funding cause linked to a trust.
- `PUT /api/campaigns/:id` — Update campaign status (`active`, `completed`).
- `DELETE /api/campaigns/:id` — Remove campaign.

### Donations
- `POST /api/donations` — Process mock donation. Updates campaign `raisedAmount` and `donorCount` atomically.
- `GET /api/donations` — List donation history log.
- `GET /api/donations/:id` — Get itemized donation receipt.

### Admin
- `GET /api/admin/stats` — Aggregated metrics (Total Trusts, Pending Trusts, Active Causes, Completed Causes, Total Amount Raised).

---

## 🎨 Design Philosophy
- **Brand Personality**: Trustworthy, Human, Transparent, Hopeful, Modern, Simple, Professional.
- **Visual Direction**: Primary emerald green (`#10B981` / `#059669`), warm off-white backgrounds (`#F9FAFB`), dark charcoal text (`#111318`), rounded cards, dynamic progress bars, and soft shadows.
- **Responsive Layout**: Wide content grids (3–4 cards per row on 1440px desktop, 2 per row on 1024px tablet, 1 per row on 390px mobile).

---

## 🔒 Security & Best Practices
- Environment variable separation for database credentials.
- Centralized Express error handler and API input validation.
- Clean code architecture ready for JWT or Passport authentication middleware.
- Sanitized donation amount checks preventing negative values.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
