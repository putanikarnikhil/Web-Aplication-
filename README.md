﻿# Web Application Project
# 🌍 Wanderlust

Wanderlust is a full-featured travel listing web application where users can explore, create, and review travel destinations. Built with **Node.js**, **Express**, **MongoDB**, **EJS**, and integrated with **Cloudinary** for image storage, it also supports secure user authentication using **Passport.js**.

---

## 🚀 Features

- 🗺️ Browse and search travel destinations
- ✍️ Add, edit, and delete your own listings
- 📷 Upload multiple images with Cloudinary
- 💬 Add and manage reviews
- 🔐 User authentication with Passport (Login/Register)
- ⚠️ Flash messages for feedback
- 🗃️ MongoDB session store for persistence
- 📍 Dynamic maps using MapTiler & Leaflet
- ✅ Mobile responsive and user-friendly UI

---

## 🧰 Tech Stack

| Tech           | Use                              |
|----------------|----------------------------------|
| **Express.js** | Server-side framework            |
| **MongoDB**    | NoSQL Database                   |
| **Mongoose**   | MongoDB ODM                      |
| **EJS**        | Templating engine                |
| **Passport.js**| Authentication                   |
| **Cloudinary** | Image storage                    |
| **MapTiler**   | Interactive maps                 |
| **Bootstrap 5**| Responsive front-end framework   |
| **dotenv**     | Environment configuration        |
| **connect-mongo** | MongoDB-based session storage |


 Project Structure
bash
Copy
Edit
wanderlust/
│
├── models/           # Mongoose schemas (User, Listing, Review)
├── routes/           # Express routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/            # EJS views
│   └── listings/
│   └── reviews/
│   └── partials/
│   └── users/
│   └── home.ejs
│   └── error.ejs
├── public/           # Static files (CSS, JS, images)
├── utils/            # Error handling utilities
├── app.js            # Main server file
├── .env              # Environment variables (not committed)
├── .gitignore        # Files to ignore in Git
└── README.md         # Project documentation

 User Roles
Guests: Browse listings, view details.

Authenticated Users: Create/edit/delete listings and reviews.

 Deployment
Wanderlust can be deployed easily on platforms like Render, Railway, or Vercel (frontend-only).

Ensure your environment variables are set in the hosting platform’s dashboard.

🧑‍💻 Author
Nikhil Putanikar
💼 LinkedIn-https://www.linkedin.com/in/nikhil-putanikar-5135a9261/
