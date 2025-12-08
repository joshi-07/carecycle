# CareCycle

🩺 **CareCycle — Medicine Donation & Reuse Network**

A full-stack web app that connects people with unused valid medicines to verified NGOs for redistribution — reducing pharmaceutical waste and promoting sustainable healthcare. Built with React, Node.js, Express, and MongoDB for the Sustainable Health & Connectivity Hackathon.

## 🚀 Deployment

### Backend (Render)
- **Service:** Web Service
- **Runtime:** Node.js
- **Build Command:** `npm install` 
- **Start Command:** `npm start`
- **Environment Variables:**
  - `MONGODB_URI`: Your MongoDB Atlas connection string
  - `FRONTEND_URL`: `https://carecycle-frontend.onrender.com` (after frontend deployment)

### Frontend (Render)
- **Service:** Static Site
- **Build Command:** `npm run build`
- **Publish Directory:** `build`
- **Environment Variables:**
  - `REACT_APP_API_BASE_URL`: `https://carecycle-2.onrender.com/api` (after backend deployment)

### Environment Files
- **Backend `.env`**: Contains `MONGODB_URI` and `FRONTEND_URL`
- **Frontend `.env`**: Contains `REACT_APP_API_BASE_URL`

### Database
- Use MongoDB Atlas for production
- Create a cluster and get the connection string
- Update `MONGODB_URI` in backend environment variables

## 🛠️ Local Development

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `backend/.env` and update `MONGODB_URI`

4. Start the application:
   ```bash
   # Backend (from backend directory)
   npm run dev

   # Frontend (from frontend directory)
   npm start
   ```

## 📁 Project Structure

```
carecycle/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/
└── README.md
```
