# 🗳️ Online Voting System

A full-stack Online Voting System that enables secure, transparent, and role-based voting.  
Users can vote in polls, while admins can create, manage, and analyze results with visual dashboards.

---

## 🚀 Features

### 👤 User (Voter)
- Register & Login (JWT Authentication)
- View active polls
- Vote on polls (only once per poll)
- View personal voting results
- Real-time result visualization (charts)

### 👨‍💼 Admin
- Create polls with multiple options (and images)
- Manage polls (update/delete before start)
- View all poll results
- Access admin dashboard with charts
- See only **ended polls** results for accuracy

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- Chart libraries (for visualization)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose

### Authentication & Security
- JWT (JSON Web Tokens)
- Role-based access control
- Protected routes & middleware

---

## 📂 Project Structure
VotingSystemProject/
│
├── Backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── models/
│ │ ├── middlewares/
│ │ ├── utils/
│ │ └── index.js
│
├── Frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── api/
│ │ ├── context/
│ │ ├── routes/
│ │ └── App.jsx


---

## 🔐 Authentication Flow

1. User logs in → receives JWT token  
2. Token stored in cookies/local storage  
3. Protected routes verify token using middleware  
4. Role-based access:
   - `user` → can vote
   - `admin` → can manage polls

---

## 📊 Key Functionalities

### 🗳️ Voting System
- One user = one vote per poll
- Duplicate votes prevented using database indexing
- Vote linked to:
  - userId
  - pollId
  - optionId

---

### 📈 Results System

#### User Results
GET /polls/results/user
- Returns only polls where the user has voted

#### Admin Results
GET /polls/results/all

- Returns all polls (only ended ones)
- Includes vote counts & chart data

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/voting-system.git
cd voting-system

Backend Setup
cd Backend
npm install

Create .env file:

PORT=8080
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173


Run backend:
npm run dev

Frontend Setup
cd Frontend
npm install
npm run dev

API Endpoints
Polls


POST /polls/create → Create poll (Admin)


GET /polls/active → Get active polls


GET /polls/all → Get all polls


GET /polls/:id → Get poll by ID


GET /polls/:id/results → Poll results



Votes


POST /votes/vote → Submit vote


GET /votes/status/:pollId → Check if user voted



🔒 Security Features


JWT Authentication


Role-based authorization


One vote per user restriction


Protected API routes


Verified user middleware



⚠️ Challenges Faced


Implementing role-based routing (Admin vs User)


Preventing duplicate voting


Syncing frontend & backend APIs


Debugging middleware and auth issues

👩‍💻 Author
Ishika Yadav

📄 License
