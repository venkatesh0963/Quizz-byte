# Quizz-byte..

A full-stack, role-based quiz application built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.

## 🚀 Features

### Role-Based Access Control
The application supports two primary user roles:
- **Admin**: Can manage the platform, users, and content.
- **Student**: Can take quizzes, view results, and see the leaderboard.

### 👨‍🎓 Student Features
- **Authentication**: Secure login and registration.
- **Student Dashboard**: Overview of past quiz attempts and performance.
- **Browse Categories**: Select specific topics to take a quiz on.
- **Quiz Engine**: Interactive quiz-taking experience.
- **Result & Analytics**: Detailed result page with score, correct answers, and charts showing performance.
- **Leaderboard**: See how you rank against other students.

### 🛡️ Admin Features
- **Admin Dashboard**: Overview of platform statistics (total users, quizzes, etc.).
- **User Management**: View and manage registered users.
- **Category Management**: Create, edit, and delete quiz categories.
- **Question Management**: Add, edit, and delete questions for specific categories.

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt for password hashing
- **Security**: Helmet, CORS, Express Rate Limit
- **Logging**: Morgan

## 📁 Project Structure

```text
Quizz-byte/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (e.g., Navbar)
│   │   ├── context/        # React Context for global state (e.g., Auth)
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin-specific pages
│   │   │   └── student/    # Student-specific pages
│   │   └── utils/          # Helper functions
│   ├── package.json
│   └── vite.config.js
└── server/                 # Backend Node.js Application
    ├── config/             # Configuration files (e.g., DB connection)
    ├── controllers/        # Request handlers
    ├── middleware/         # Custom middleware (auth, error handling)
    ├── models/             # Mongoose schemas (User, Category, Question, QuizAttempt)
    ├── routes/             # API route definitions
    ├── utils/              # Helper functions
    ├── server.js           # Entry point for the backend
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/venkatesh0963/Quizz-byte.git
   cd Quizz-byte
   ```

2. **Setup the Backend**:
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory and add necessary environment variables (e.g., from `.env.example` if it exists):
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

3. **Setup the Frontend**:
   Open a new terminal window:
   ```bash
   cd client
   npm install
   ```
   - Start the Vite development server:
     ```bash
     npm run dev
     ```

## 📝 License
ISC
