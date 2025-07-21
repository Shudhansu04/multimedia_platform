# Multimedia Platform - Backend

This is the backend for a full-stack **Multimedia Sharing Platform**, built with **Node.js**, **Express**, and **MongoDB**. It includes features like video uploads, tweets, playlists, likes, subscriptions, authentication, and more.

---

##  Live API

> 🔗 [https://multimedia-platform.onrender.com](https://multimedia-platform.onrender.com)

---

##  API Documentation (Swagger)

> 🔗 [https://multimedia-platform.onrender.com/api-docs](https://multimedia-platform.onrender.com/api-docs)

Browse and test all available endpoints with Swagger UI.

---

##  Features

-  **JWT Authentication** (Access + Refresh tokens)
-  **User Management**
  - Signup / Login / Logout / Refresh Token
  - Update Profile, Avatar, Cover Image
-  **Video Handling**
  - Upload videos with thumbnails
  - Publish / Unpublish / Delete
  - Fetch videos by user or all
-  **Comments & Likes**
-  **Tweet-style Posts** (Create, update, delete, list)
-  **Playlists**
-  **Subscriptions**
-  **Watch History**
-  **Multer & Cloudinary** for media storage
-  **Swagger** for complete API documentation

---

##  Tech Stack

| Layer         | Tech/Tool                      |
|---------------|--------------------------------|
| Backend       | Node.js, Express.js            |
| Database      | MongoDB, Mongoose              |
| Auth          | JWT, bcrypt                    |
| File Upload   | Multer, Cloudinary             |
| Docs          | Swagger UI, swagger-jsdoc      |
| Dev Utilities | dotenv, morgan, nodemon        |

---

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or cloud)
- Cloudinary account

---

## ENV SAMPLE FILE 

PORT=8000
MONGODB_URI=mongodb://localhost:27017/multimedia
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=*

---

## Folder Structure

.
├── controllers/       # Route logic
├── middlewares/       # Auth, error handling, file upload
├── models/            # Mongoose schemas
├── routes/            # All API route definitions
├── utils/             # Helper functions
├── .env.example       # Sample env file
├── index.js          # Entry point
└── README.md


 
