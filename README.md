# Asset Tracking App — Technical Assignment

A full-stack web application for tracking physical assets on a map.

## Overview

This project implements a asset management workflow for an asset team that needs to:

* view assets on a map and in a list
* filter assets by type and status
* find assets within a geographic area
* create, edit, and delete assets

The app is built as a **single-page workflow** so that filters, the asset list, and the map stay visible together. Selecting an asset from either the list or the map keeps the user in the same context rather than navigating to a separate detail page.

---

# Tech Stack

## Frontend

* **React**
* **TypeScript**
* **Bootsptrap**
* **React Leaflet**
* **React Hook Form / custom**
* **React Redux Toolkit**

## Backend

* **Node.js**
* **Express**
* **TypeScript**
* **PostgreSQL**

## Tooling / DX

* **Docker / Docker Compose**
* **Swagger / OpenAPI**
* **pg**

---

# Features Implemented

## Backend

### B1 — Asset API

Implemented an HTTP API for:

* listing assets
* filtering assets
* finding assets in a geographic area
* retrieving a single asset
* creating assets
* updating assets
* deleting assets

### B2 — Filtering

Implemented filtering by:

* `type`
* `status`
* geospatial filter (`coordinates and radius`)

### B3 — Storage

Used **PostgreSQL** for persistence.

### B4 — Seeding

The database is seeded from the provided `seed.json` dataset on startup.

---

## Frontend

### F1 — List view with filters

Implemented a list view with filters for:

* asset type
* asset status
* asset distance from coordinates

Filters though url syncing:

* page and page size
* asset type
* asset status
* asset distance from coordinates

**Additional behavior:**

* filter validation with inline error feedback
* filter state synchronized with the URL to support **deep-linking**
* asset list updates from current URL/query state
* favicon update

### F2 — Map view

Implemented a map view with:

* markers for assets
* marker color coding by asset status
* asset selection directly from the map

Selecting an asset opens its **detail/edit modal** within the same page rather than navigating to a separate detail route. This was an intentional choice to keep the list, map, and editing workflow in one place.

### F3 — Create/Edit asset flow

Implemented create and edit forms with validation and error feedback.

Behavior:

* invalid form input blocks submission on the client
* edit and create flows share the same validation rules

### F4 — Usable UI

The UI is intentionally lightweight rather than polished, but aims to be clear and usable for the assignment scope.

---

# API Design

## Asset shape

```json
{
  "id": "uuid",
  "name": "Main Street Hydrant 12",
  "type": "hydrant",
  "status": "warning",
  "lat": 40.6401,
  "lng": 22.9444,
  "installed_at": "2022-03-18T00:00:00.000Z",
  "last_inspected_at": "2025-05-12T00:00:00.000Z",
  "notes": "Needs follow-up inspection"
}
```

## Example endpoints

### List / filter assets

```http
GET /api/assets
```

Supported query parameters:

* `type=pipe|hydrant|sensor|valve`
* `status=ok|warning|critical`

* `lat`
* `lng`
* `radius`

### Get a single asset

```http
GET /api/assets/:id
```

### Create an asset

```http
POST /api/assets
```

### Update an asset

```http
PUT /api/assets/:id
```

### Delete an asset

```http
DELETE /api/assets/:id
```

---

# Geospatial Filtering

I chose **radius** as the initial geospatial filter.

## Why this approach

**If radius:**

* matches “find nearby assets” use cases well
* keeps the user-facing mental model simple
* good fit for a lightweight asset lookup workflow

## Current implementation

The API accepts:

* `Lat`
* `Lng`
* `radius`
* `type`
* `status`

and applies them in the backend query so only assets inside the requested circle are returned.

---

# Validation & Error Handling

## Implemented validation

### Frontend

* required field validation
* enum validation for supported `type` / `status` values
* invalid submissions are blocked before the request is sent
* inline error messages for invalid form/filter input

### Backend / database

* persistence is backed by PostgreSQL
* required fields are enforced at the database level via schema constraints
* API-level validation is kept at minimum. In real-world app validation should happen in both ends, but for a take-home showing eagerness on the one end is enough. The front-end was selected, as having optical feedback makes it easier for the developer and the reviewer to evaluate the correctness of implementation 

## Known gaps / trade-offs

To keep the assignment time-bounded, I did **not** fully productionize validation in every layer.

Notably:

* latitude/longitude range validation is not fully enforced server-side yet (e.g. latitude within `[-90, 90]`, longitude within `[-180, 180]`)
* some malformed geospatial query combinations could be validated more strictly server-side

If I were extending this further, tightening backend validation around coordinate correctness would be one of the first improvements.

---

# UX / State Management Notes

A few implementation choices were intentional:

## 1) Single-page workflow

I kept the app as a single-page layout with:

* filters
* asset list
* map
* create/edit modal

This keeps map context visible while inspecting or editing assets.

## 2) URL-synced filters

Filter state is synchronized with the URL so the current view can be shared or revisited directly.

## 3) List and map stay connected

The list and map are designed to work as two views over the same asset dataset, so selecting an asset in one context helps locate and inspect it in the other.

---

# Swagger / API Documentation

The backend includes Swagger/OpenAPI documentation for easier exploration and testing of the API during development.

**Swagger URL:**
`[for easy navcigation, opening the server URL redirects to docs address: http://localhost:3000/api/docs]`

---

# Running the Project

## Option 1 — Docker (recommended)

```bash
docker compose up --build
```

or

```bash
docker compose -f docker-compose.yml up --build
```

To start the database in a container and develop in the local node environment, please, use:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Option 2 — Run locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

Run from the root:

```bash
docker compose -f docker-compose.dev.yml up --build
```

* required environment variables are provided with the submission
* If the database is empty, seeding runs automatically when the server starts

---

# Environment Variables

The .env files are provided to help the reviewer run the app

## Backend - production

> .env.prod
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=assets
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

## Backend - development

> .env.dev
```bash
PORT=3000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=assets
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

---

# Seed Data

The app uses the provided `seed.json` file (~150 assets).

On startup, the backend:

* seeds the database if the assets table is empty

---

# Testing

I intentionally prioritized delivering the full end-to-end workflow over building out a broader automated test suite within the assignment timebox.

If I were extending the project, I would start by adding tests for:

* asset filtering by `type` / `status`
* geospatial filtering behavior
* create / update validation paths
* URL-synced frontend filter behavior

---

# Trade-offs / What I’d Improve Next

Given more time, the next improvements I would make are:

1. **Stricter backend validation**

   * enforce latitude/longitude ranges server-side
   * tighten validation for malformed geospatial queries server-side

2. **More complete automated tests**

   * API filtering tests
   * geospatial query tests
   * frontend integration tests for filter/URL synchronization

3. **Map interaction polish**

   * improve the asset location selection workflow in create/edit flows
   * refine map/list synchronization UX where needed


5. **Production hardening**

   * standardized API error shape
   * stronger observability/logging
   * database migrations / deployment workflow polish

---

# Demo

> Recording the following:

* a short screen recording in the README showing:

  * filtering
  * map interaction
  * create/edit flow
  * delete flow

---

# Notes

This submission intentionally focuses on:

* a clean end-to-end workflow
* a usable map/list editing experience
* sensible API and geospatial filtering choices
* developer ergonomics (Docker + Swagger + seed data)

rather than full production hardening across every concern.
