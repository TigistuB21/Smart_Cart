# Project Blueprint: Smart Cart Ethiopia (Portfolio Edition)

> **Architectural Pivot**: This repository has been refactored into a **Portfolio Showcase Edition**. Unnecessary operational overhead (scraping daemons, OCR pipelines, notification triggers, and external search engines) has been replaced with a rich, realistic seeded dataset. The architecture focuses strictly on core full-stack engineering, clean NestJS API contracts, responsive Next.js 14 Web dashboards, React Native Expo mobile barcode scanning, and algorithmic basket cost optimization.

---

## 1. Executive Summary

### 1.1 Purpose
**Smart Cart Ethiopia** is a modern multi-platform grocery price comparison and basket-optimization application tailored for the Ethiopian retail market. It aggregates, normalizes, and compares prices across major supermarkets (e.g., Shoa Supermarket, Bambis, FreshMart) and traditional market centers (e.g., Merkato) in Addis Ababa.

### 1.2 Core Value Proposition
1. **Price Transparency**: Instantaneous side-by-side product price comparison across local supermarkets and traditional open-air markets.
2. **Bilingual Catalog**: Native support for English and Amharic product titles (e.g., *White Teff / ነጭ ጤፍ*, *Shiro Powder / ሺሮ*).
3. **Smart Basket Optimizer**: An algorithmic engine that compares the total cost of a user's entire grocery shopping list across competing stores and highlights potential savings.
4. **Mobile Barcode Scanner**: Smartphone camera scanning of product UPC barcodes to instantly display live pricing and market options.

---

## 2. Monorepo Architecture

Smart Cart Ethiopia uses **Turborepo** with **pnpm workspaces** to manage code sharing across applications and shared packages:

```
Smart_Cart/
├── apps/
│   ├── api/          # NestJS REST API (Express platform, TypeScript)
│   ├── web/          # Next.js 14 App Router (React, Tailwind CSS, TypeScript)
│   └── mobile/       # React Native / Expo Mobile App (Expo Barcode Scanner)
└── packages/
    └── db/           # Shared Prisma ORM client (@smart-cart/db) & PostgreSQL schema
```

### Component Roles & Stack:
* **`apps/api` (NestJS REST API)**:
  * Manages `/products`, `/lists`, `/stores`, and `/auth` endpoints.
  * Calculates basket totals and split-basket optimization.
* **`apps/web` (Next.js 14 Web App)**:
  * Interactive price dashboard, product catalog search, price history charts, and shopping list planner.
* **`apps/mobile` (React Native Expo App)**:
  * Camera UPC barcode scanning, on-the-go price lookups, and mobile list management.
* **`packages/db` (Prisma ORM & PostgreSQL)**:
  * Core data layer containing models for `User`, `Store`, `Product`, `Price`, `ShoppingList`, `ShoppingListItem`, and `Favorite`.
  * Pre-populated with realistic Ethiopian grocery pricing via `prisma/seed.ts`.

---

## 3. Seeded Market Data Architecture

To ensure immediate local setup and offline-friendly demos without reliance on fragile third-party scrapers, the system features a comprehensive seed dataset:

### Featured Simulated Retail Locations (Addis Ababa):
* **Shoa Supermarket (Bole)**: Modern supermarket experience.
* **Merkato Central Market**: Traditional open-market competitive pricing.
* **Bambis Supermarket (Kazanchis)**: Specialty & imported retail store.
* **FreshMart (Sarbet)**: Neighborhood supermarket chain.

### Core Ethiopian Product Staples (Bilingual ETB Pricing):
1. **White Teff / ነጭ ጤፍ** (Kg)
2. **Ethiopian Coffee Beans / የኢትዮጵያ የቆላ ቡና** (Kg)
3. **Barilla Spaghetti / ባሪላ ፓስታ** (500g Pack)
4. **Sunflower Cooking Oil 5L / የሱፍ የምግብ ዘይት 5L** (5L Bottle)
5. **Red Onions / ቀይ ሽንኩርት** (Kg)
6. **White Sugar / ስኳር** (2Kg Pack)
7. **Ethiopian Berbere Spice Blend / የሃበሻ በርበሬ** (500g Pack)
8. **Pasteurized Fresh Milk 1L / ትኩስ ወተት 1L** (1L Bottle)
9. **Traditional Shiro Powder / የተፈጨ ሺሮ** (Kg)
10. **Abyssinia Mineral Water / አቢሲንያ የሜታ ውሀ** (6x1.5L Pack)

---

## 4. Smart Basket Optimizer Algorithm

The core algorithmic highlight of the project is the **Basket Comparison & Optimization Engine**:

```
 Shopping List Items
 [2x Teff, 3x Milk, 2x Pasta, 1x Shiro]
                │
                ▼
      ┌──────────────────┐
      │  NestJS Backend  │
      └─────────┬────────┘
                │
     ┌──────────┴──────────┐
     ▼                     ▼
[Single-Store Basket]  [Split-Basket Option]
  - Merkato: 715 ETB     - Buy Teff & Shiro at Merkato (440 ETB)
  - Shoa:    850 ETB     - Buy Milk & Pasta at Shoa (370 ETB)
  - Bambis:  905 ETB     - Combined Total: 810 ETB
```

1. **Single-Store Total**: Calculates `SUM(item.quantity * store_price)` for each store in the database and ranks stores from cheapest to most expensive.
2. **Split-Basket Optimization (V2 Algorithm)**: Evaluates whether purchasing specific items at an alternative store yields higher net savings after adjusting for store proximity and travel convenience.

---

## 5. API Endpoints (`apps/api`)

* `GET /products/scan/:upc` - Scans barcode and returns product details + store prices.
* `GET /products/:id/prices` - Returns side-by-side store price comparisons for a product.
* `POST /lists` - Creates a new shopping list.
* `POST /lists/:id/items` - Adds or updates items and quantities in a shopping list.
* `GET /lists/:id/compare` - Runs the Smart Basket Optimizer against all store pricing models.

---

## 6. Development & Run Commands

```bash
# Install dependencies
pnpm install

# Run database migrations and seed Ethiopian grocery dataset
cd packages/db
pnpm db:generate
pnpm db:seed

# Start all applications concurrently in dev mode
pnpm dev
```
