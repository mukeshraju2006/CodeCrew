<div align="center">

```
  ██████╗ ██████╗ ██████╗ ███████╗ ██████╗██████╗ ███████╗██╗    ██╗
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██╔════╝██║    ██║
 ██║     ██║   ██║██║  ██║█████╗  ██║     ██████╔╝█████╗  ██║ █╗ ██║
 ██║     ██║   ██║██║  ██║██╔══╝  ██║     ██╔══██╗██╔══╝  ██║███╗██║
 ╚██████╗╚██████╔╝██████╔╝███████╗╚██████╗██║  ██║███████╗╚███╔███╔╝
  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝
```

### 🚀 The Developer Collaboration Platform

*Find your team. Ship your ideas. Build the future.*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-7c3aed?style=for-the-badge)](https://my-react-app-ec4t.vercel.app/)
[![Backend Repo](https://img.shields.io/badge/⚙️_Backend-GitHub-ec4899?style=for-the-badge)](https://github.com/divyanshgiri-sudo/NullChapter_Backend)

</div>

---

## ✨ What is CodeCrew?

**CodeCrew** is a full-stack developer collaboration platform where developers can post projects, find skilled teammates, send join requests, manage teams, and chat in real time — all in one place.

> *No LinkedIn spam. No cold DMs. Just developers who want to ship real things.*

---

## 🔥 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based login & register with httpOnly cookies |
| 🖼️ **Profile Pics** | Upload profile pictures via Cloudinary |
| 📋 **Post Projects** | Create collaboration posts with tech stack, team size, type |
| 🔍 **Explore** | Discover open projects with search & filters |
| 📨 **Join Requests** | Apply to projects, track request status |
| 👥 **Team Management** | View team members, roles, skills |
| 💬 **Real-time Chat** | Socket.IO powered team chat per project |
| 📱 **Responsive** | Works on all devices |

---

## 🛠️ Tech Stack

### Frontend
```
⚡ React 18          — UI library
🎨 Tailwind CSS      — Styling
🎭 Framer Motion     — Animations
🔄 React Router v6   — Navigation
📡 Axios             — API calls
🔌 Socket.IO Client  — Real-time chat
☁️ Deployed on Vercel
```

### Backend
```
🟢 Node.js + Express  — Server & REST API
🍃 MongoDB + Mongoose — Database
🔑 JWT                — Authentication
🔒 Bcrypt             — Password hashing
📁 Multer             — File uploads
☁️ Cloudinary         — Image storage
⚡ Socket.IO          — Real-time WebSockets
☁️ Deployed on Render
```

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│                     │  HTTPS  │                      │
│   React Frontend    │◄───────►│   Express Backend    │
│   (Vercel)          │   API   │   (Render)           │
│                     │         │                      │
└─────────────────────┘         └──────────┬───────────┘
         │                                 │
         │         WebSocket               │
         └────────────Socket.IO────────────┤
                                           │
                                  ┌────────▼────────┐
                                  │                 │
                                  │    MongoDB      │
                                  │   + Cloudinary  │
                                  │                 │
                                  └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- Cloudinary account

### Clone the repo
```bash
git clone https://github.com/mukeshraju2006/CodeCrew.git
cd CodeCrew
```

### Setup Frontend
```bash
cd my-react-app
npm install
```

Create `.env` in frontend root — refer to `.env.example`:
```bash
npm run dev
```

### Setup Backend
```bash
cd NullChapter_Backend
npm install
```

Create `.env` in backend root — refer to `.env.example`:
```bash
npm run dev
```

---

## 📁 Environment Variables

Both frontend and backend require environment variables to run.
Check the `.env.example` files in each folder for the required keys.

> ⚠️ Never commit your `.env` files — they are gitignored.

---

## 📸 Pages

```
/ .............. Landing Page
/register ...... Register
/login ......... Login
/dashboard ..... Dashboard
/explore ....... Explore Projects
/create ........ Create Project
/projects/:id .. Project Details
/profile ....... My Profile
/myposts ....... My Posts
/my-requests ... My Requests
/my-teams ...... My Teams
/team/:id ...... Team Details
/team/:id/chat . Team Chat 💬
```

---

## 🌊 How It Works

```
1. Register with profile pic → saved to Cloudinary
2. Post a project or explore existing ones
3. Send a join request with your contribution pitch
4. Project owner reviews your profile & accepts/rejects
5. Get added to the team → access team chat
6. Build together in real time 🚀
```

---

## 👨‍💻 Team

<table>
  <tr>
    <td align="center">
      <b>Mukesh Raju</b><br/>
      <sub>Frontend Developer</sub><br/>
      <a href="https://github.com/mukeshraju2006">@mukeshraju2006</a>
    </td>
    <td align="center">
      <b>Divyansh Giri</b><br/>
      <sub>Backend Developer</sub><br/>
      <a href="https://github.com/divyanshgiri-sudo">@divyanshgiri-sudo</a>
    </td>
  </tr>
</table>

---

<div align="center">

**Built by Mukesh & Divyansh**

*If you liked this project, give it a ⭐ on GitHub!*

[![Live Demo](https://img.shields.io/badge/🚀_Try_It_Live-CodeCrew-7c3aed?style=for-the-badge)](https://my-react-app-ec4t.vercel.app/)

</div>
