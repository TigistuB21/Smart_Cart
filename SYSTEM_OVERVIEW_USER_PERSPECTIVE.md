# Smart Cart Ethiopia: System Overview & User Perspective Architecture (Portfolio Edition)

> **Purpose of this Document**: This document provides a detailed breakdown of the **Smart Cart Ethiopia** platform from an end-user perspective, coupled with technical system mappings. It is designed to give any AI assistant or developer full context on how the application functions, user interaction flows, data models, API endpoints, and system architecture in this streamlined **Portfolio Edition**.

---

## 1. System Summary & Core Objective

**Smart Cart Ethiopia** is a multi-platform grocery price comparison and shopping list optimization application tailored for the Ethiopian market (Mobile, Web, and Backend Services). 

### Key Goal
To eliminate price opacity in supermarket and market shopping by providing consumers with real-time price comparisons across local stores (Shoa, Merkato, Bambis, FreshMart) in Addis Ababa:
1. Compare individual product prices across competing stores in Ethiopian Birr (ETB).
2. Scan physical product barcodes in stores using a smartphone camera.
3. Support bilingual product listings (**English** and **Amharic**, e.g., *White Teff / ነጭ ጤፍ*, *Shiro Powder / ሺሮ*).
4. Calculate the **total cost of an entire grocery shopping list** across multiple stores via the **Smart Basket Optimizer** (`POST /lists/optimize`).

---

## 2. Monorepo Technical Architecture

Smart Cart Ethiopia is organized as a **Turborepo** monorepo using **pnpm workspaces** (`pnpm-workspace.yaml`).

```
Smart_Cart/
├── apps/
│   ├── api/          # NestJS REST API (Express platform, TypeScript)
│   ├── web/          # Next.js 14 Web Application (App Router, React, TypeScript)
│   └── mobile/       # React Native / Expo Mobile App (Barcode scanner)
├── packages/
│   └── db/           # Shared Prisma ORM client (@smart-cart/db) & Postgres schema
└── development_plan.md # Master blueprint document
```

---

## 3. Detailed User Workflows & System Mapping

### Workflow A: Product Search & Mobile Barcode Scanning

```
[User scans barcode / searches item] 
       │
       ▼
[Mobile (Expo) / Web (Next.js)] 
       │ HTTP GET /products/scan/:upc OR GET /products/search?q=...
       ▼
[NestJS API (apps/api)] ────────► [Prisma ORM (packages/db)] ──► [PostgreSQL Database]
       │                                                                │
       └◄──────── Live ETB prices across Shoa, Merkato, Bambis, etc. ───┘
```

1. **User Action**:
   - The user opens the **Smart Cart Mobile App** in Addis Ababa.
   - The user scans a product UPC barcode (e.g., `011110416001` - White Teff / ነጭ ጤፍ).
   - Alternatively, the user searches `"Teff"` or `"ጤፍ"` in the web/mobile search bar.

2. **System Response**:
   - Mobile app calls `GET /products/scan/011110416001` or `GET /products/search?q=ጤፍ`.
   - NestJS `ProductsController` queries PostgreSQL via Prisma (`@smart-cart/db`).
   - Response payload returned:
     ```json
     {
       "status": "success",
       "query": "ጤፍ",
       "count": 1,
       "data": [
         {
           "id": "e1111111-1111-4111-8111-111111111111",
           "upc": "011110416001",
           "name": "White Teff",
           "nameAmharic": "ነጭ ጤፍ",
           "unit": "Kg",
           "prices": [
             { "storeName": "Merkato Central Market", "price": 110.00 },
             { "storeName": "FreshMart (Sarbet)", "price": 130.00 },
             { "storeName": "Shoa Supermarket (Bole)", "price": 135.00 },
             { "storeName": "Bambis Supermarket", "price": 140.00 }
           ],
           "cheapestPrice": 110.00,
           "cheapestStore": "Merkato Central Market"
         }
       ]
     }
     ```

---

### Workflow B: Shopping List Management & Smart Basket Optimization

1. **User Action**:
   - User submits a basket of items to optimize: 2x White Teff, 3x Fresh Milk, 2x Barilla Spaghetti, 1x Shiro Powder.
   - User submits `POST /lists/optimize`.

2. **System Response**:
   - `ListsController` computes:
     * **Single-Store Options**:
       - Merkato Central Market: **715.00 ETB**
       - FreshMart (Sarbet): **814.00 ETB**
       - Shoa Supermarket (Bole): **840.00 ETB**
       - Bambis Supermarket: **905.00 ETB**
     * **Optimal Split-Basket**:
       - Cherry-picked items across stores: **665.00 ETB**
       - Potential Savings: **50.00 ETB (7.0% savings)**

---

## 4. Key Database Schema Entities (`packages/db/prisma/schema.prisma`)

* **`User`**: User accounts & profiles.
* **`Store`**: Retail chain info, city (`Addis Ababa`), address, and optional lat/long coordinates.
* **`Product`**: Product record with `upc`, English `name`, bilingual `nameAmharic`, `unit`, `brandId`, `categoryId`, and `imageUrl`.
* **`Price`**: Unique composite relation `[storeId, productId]` storing price decimal in ETB.
* **`PriceHistory`**: Time-series log `[time, storeId, productId]` tracking price changes.
* **`ShoppingList` & `ShoppingListItem`**: User shopping lists with product quantities.

---

## 5. API Interface Mapping (`apps/api`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products` | Fetch all products with store prices sorted lowest-to-highest. |
| `GET` | `/products/search?q=` | Case-insensitive search across English `name` and Amharic `nameAmharic`. |
| `GET` | `/products/scan/:upc` | Fetch product details & live ETB prices across stores by UPC barcode. |
| `GET` | `/products/:id` | Fetch product details & live ETB prices by Product UUID. |
| `POST` | `/lists/optimize` | **Smart Basket Optimizer**: Calculates Single-Store totals vs. Optimal Split-Basket cherry-picking. |
| `POST` | `/lists` | Create a new shopping list. |
| `POST` | `/lists/:id/items` | Add or update an item quantity in a shopping list. |
| `GET` | `/lists/:id/compare` | Execute Smart Basket Optimizer against a stored shopping list ID. |
