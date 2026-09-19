# 🎯 InterviewIQ — AI-Powered Mock Interview & Career Prep Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI_LLM-blueviolet?style=for-the-badge)](https://openrouter.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **InterviewIQ** is an enterprise-grade, full-stack AI interview preparation platform designed to help job seekers, developers, and students simulate real-world technical and HR interviews. Featuring realistic male/female AI avatar video playback, voice-to-text input, intelligent automated grading, insightful analytics dashboards, and exportable PDF report cards.

---

## ✨ Key Features

- **🤖 Realistic AI Interviewer Avatars**: Choose between Male and Female AI interviewer personas with synchronized video playback.
- **🎙️ Speech-to-Text & Voice Answers**: Real-time microphone capture converting speech directly into answers for true simulation.
- **⏱️ Live Timer & Pressure Simulation**: Configurable timers per question replicating real exam and company hiring environments.
- **📊 Interactive Analytics Dashboard**: Powered by **Recharts**, tracking your interview scores over time, performance history, and subject breakdown.
- **📄 Downloadable PDF Reports**: Detailed evaluation report cards highlighting technical accuracy, strengths, areas for improvement, and one-click PDF export.
- **💳 Credit Store & Pricing Tiers**: Token-based interview credit system allowing users to purchase or earn mock sessions.
- **🔐 Secure Multi-Auth**: Firebase Google OAuth and JWT-based email/password authentication with secure HTTP-only cookies.
- **🎨 Modern Dark UI / UX**: High-performance, responsive UI built on **Tailwind CSS v4** and fluid **Framer Motion** animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Motion
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router DOM v7
- **Data Visualization**: Recharts
- **Icons & Extras**: React Icons (`react-icons`), Canvas Confetti

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB Atlas with Mongoose ODM
- **AI Intelligence**: OpenRouter AI API (Google Gemini / DeepSeek / Meta LLaMA)
- **File Uploads**: Multer
- **Security**: JSON Web Tokens (JWT), BcryptJS, Cookie-Parser, CORS

---

## 📁 Project Structure

```text
interviewIQ/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, and avatar simulation videos
│   │   │   ├── images/         # Illustration and UI graphics
│   │   │   └── video/          # Male and female AI interviewer videos
│   │   ├── components/         # Reusable UI & interview step components
│   │   ├── pages/              # Main routes (Home, Dashboard, Interview, Report, etc.)
│   │   ├── redux/              # Global state management (userSlice, store)
│   │   ├── utils/              # Firebase auth helpers
│   │   ├── App.jsx             # Route definitions & base layout
│   │   └── main.jsx            # Application entry point
│   ├── .env.example            # Client environment template
│   ├── .gitignore              # Client gitignore
│   ├── package.json            # Client dependencies
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Backend API (Node.js + Express + MongoDB)
│   ├── config/                 # DB connection and JWT helper configurations
│   ├── controllers/            # Auth, interview, and user controllers
│   ├── middlewares/            # Auth verification & file upload middlewares
│   ├── models/                 # Mongoose schemas (User, Interview)
│   ├── routes/                 # Express API route declarations
│   ├── services/               # OpenRouter AI integration service
│   ├── uploads/                # Directory for resume uploads (.gitkeep preserved)
│   ├── .env.example            # Server environment template
│   ├── .gitignore              # Server gitignore
│   ├── index.js                # Express app entry point
│   └── package.json            # Server dependencies
│
├── .gitignore                  # Monorepo root gitignore (secrets & build outputs ignored)
├── package.json                # Root package for workspace scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

Follow these instructions to run InterviewIQ locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance
- [OpenRouter](https://openrouter.ai/) API key for AI question generation and evaluation
- [Firebase](https://firebase.google.com/) Project for Google OAuth

---

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/InterviewIQ.git
   cd InterviewIQ
   ```

2. **Install all dependencies** (Root, Client, and Server):
   ```bash
   npm run install:all
   ```
   *Alternatively, install manually in each folder:*
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

---

### Environment Variables

#### 1. Server Configuration
Create a `.env` file in the `server` directory based on `server/.env.example`:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/InterviewIQ?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

#### 2. Client Configuration
Create a `.env` file in the `client` directory based on `client/.env.example`:
```env
VITE_FIREBASE_APIKEY=your_firebase_api_key_here
VITE_SERVER_URL=http://localhost:8000
```

---

### Running the Application

Start both the backend server and frontend development client:

**Method 1: Using root scripts**
```bash
# Terminal 1 - Start Server
npm run dev:server

# Terminal 2 - Start Client
npm run dev:client
```

**Method 2: Starting individually**
```bash
# In /server
npm run dev

# In /client
npm run dev
```

- **Client will run at**: `http://localhost:5173`
- **Backend API will run at**: `http://localhost:8000`

---

## 📡 API Overview

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account | No |
| `POST` | `/api/auth/login` | Login with email & password | No |
| `POST` | `/api/auth/google` | Google OAuth authentication | No |
| `GET` | `/api/auth/logout` | Logout & clear auth cookies | Yes |
| `GET` | `/api/user/current-user` | Fetch currently authenticated user | Yes |
| `POST` | `/api/interview/generate` | Generate AI interview questions | Yes |
| `POST` | `/api/interview/submit` | Submit answers & evaluate performance | Yes |
| `GET` | `/api/interview/history` | Retrieve user's previous interview records | Yes |
| `GET` | `/api/interview/report/:id` | Fetch specific interview analysis & report | Yes |

---

## 🔒 Security Best Practices

- Environment files (`.env`, `*.env`) are strictly excluded via `.gitignore`.
- Password hashing is enforced using `bcryptjs`.
- Session tokens are stored in `HTTP-only` and `SameSite` secure cookies.
- OpenRouter API keys and database credentials are kept exclusively on the server side.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by **Ashish Pratap Singh**  
*Feel free to star ⭐ the repository if you found it useful!*
