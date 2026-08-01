# ✨ Éclat
---
Éclat is a full-stack jewelry shopping app built with an Expo mobile/web client and an Express.js + PostgreSQL API.

## 💎 Features
---
- Browse jewelry by category, product type, color, audience, price, and search
- Product details with variants, materials, images, and stock
- JWT authentication with secure token storage on native
- Cart, wishlist, addresses, checkout, and order history
- Journal/blog content and an admin order management panel

## 🛠 Tech stack
---
#### Front End
- Expo, React Native
#### Backend End
- Express, JWT, bcrypt
#### Database
- PostgreSQL
#### Tools
- Docker Compose, Biome

## 🚀 Installation
---
- Start the API and database
	- Create `server/.env` with your database connection and JWT settings, then:

```bash
cd server
bun install
bun run db:setup
bun run dev
```
The API runs on `http://localhost:3003` by default.
- Start the Expo client
	- Create `client/.env`
	- For `EXPO_PUBLIC_API_URL` set `http://localhost:3003` when running the client on web from the same computer. Use your LAN IP when opening the app on a physical phone.

```bash
cd client
bun install
bun run start
```

## 🔌 API
---
All API routes are prefixed with `/api/v1`.
- Public: `/health`, `/products`, `/categories`, `/banners`, `/blog-posts`
- Auth: `/auth/signup`, `/auth/login`, `/auth/me`
- Protected: `/cart`, `/wishlist`, `/addresses`, `/orders`
- Admin: `/admin`
