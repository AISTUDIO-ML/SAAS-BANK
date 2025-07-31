# 🧠 SAAS BANK

# 🧠 AI DATA STUDIO

AI DATA STUDIO is a decentralized SaaS platform that enables real-time and time-locked crypto-based subscriptions using **Superfluid** and **Sablier**. Built with a **React frontend** and **Node.js backend**, it supports deployment on **Azure** and **AWS**.

---

## 📁 Project Structure


ai-data-studio/ ├── backend/        # Node.js API for stream management and access control ├── frontend/       # React admin dashboard for subscription monitoring ├── .github/        # CI/CD workflows for Azure and AWS

---

## 🚀 Features

- 🔗 Crypto subscriptions with **Superfluid** (real-time) and **Sablier** (time-locked)
- 🧾 USDT-based billing on Ethereum-compatible chains
- 🧠 AI-powered access control and stream monitoring
- 📊 Admin dashboard to manage users and subscriptions
- ☁️ CI/CD pipelines for Azure (backend) and AWS (frontend)

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React, Tailwind CSS            |
| Backend     | Node.js, Express, Ethers.js    |
| Blockchain  | Superfluid, Sablier, The Graph |
| Deployment  | Azure App Service, AWS S3      |
| CI/CD       | GitHub Actions                 |

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/ai-data-studio.git
cd ai-data-studio

2. Environment Variables
Create .env files in both backend/ and frontend/:
backend/.env
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://polygon-rpc.com
SUPERFLUID_HOST=0x...
SABLIER_ADDRESS=0x...

frontend/.env
REACT_APP_API_URL=https://your-backend-url.com

⸻
🧪 Local Development
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm start

⸻
🚀 Deployment
Azure (Backend)
• Configure Azure App Service
• Add AZURE_PUBLISH_PROFILE to GitHub Secrets
• Push to main branch to trigger deployment
AWS (Frontend)
• Configure S3 bucket and CloudFront
• Add AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY to GitHub Secrets
• Push to main branch to trigger deployment
⸻
📊 Admin Dashboard
• View all users and their subscription status
• Pause or cancel streams
• Monitor real-time flow rates and events
⸻
📡 Monitoring
• Uses The Graph to poll Superfluid stream status
• Optional: Gelato Automate for webhook-based stream event triggers
⸻
📄 License
MIT License © 2025 Honeypotz Inc.
⸻
🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

---
