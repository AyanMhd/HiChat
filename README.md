#  Full Stack Realtime Chat App

A modern, real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js), Socket.io, and TailwindCSS.


## Features

- **Real-time Messaging**: Instant chat with Socket.io.
- **Online Status**: Real-time updates for user online presence.
- **Authentication**: Secure JWT-based authentication & authorization.
- **State Management**: Optimized global state with Zustand.
- **UI/UX**: Responsive design using TailwindCSS + DaisyUI.
- **Media Sharing**: Image uploads powered by Cloudinary.
- **Error Handling**: robust error handling on both client and server.

## Tech Stack

**Frontend:**

- React (Vite)
- TailwindCSS
- DaisyUI
- Zustand
- Socket.io Client

**Backend:**

- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- JSON Web Token (JWT)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Account (or local instance)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/fullstack-chat-app.git
   cd fullstack-chat-app
   ```

2. **Install dependencies**

   It is recommended to install dependencies for the root, backend, and frontend:

   ```bash
   npm install && npm install --prefix backend && npm install --prefix frontend
   ```

### ⚙️ Environment Configuration

Create a `.env` file in the **`backend`** directory and add the following variables:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development

# Cloudinary Setup (Get these from your Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the App

You can run both backend and frontend servers concurrently from the root directory:

```bash
npm start
```

_(Note: Ensure your root `package.json` has a script to run both, otherwise run them in separate terminals)_

**Or run them separately:**

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5001

## Troubleshooting

### Common Issues

**1. Internal Server Error on Login/Signup**

- **Cause:** Often due to DNS issues or MongoDB connection failures.
- **Fix:**
  - Check your internet connection.
  - Verify your `MONGODB_URI` in `.env`.
  - Try changing your DNS or running `ipconfig /flushdns` (Windows).
  - Ensure your IP is whitelisted in MongoDB Atlas.

**2. Port Already in Use**

- If port `5001` or `5173` is busy, kill the process or change the port in `.env` and frontend config.

## 📄 License

This project is licensed under the ISC License.
