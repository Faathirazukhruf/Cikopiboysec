# 🛡️ Cikopiboysec - AI Security Research Workspace

> **Defensive Security for the Agentic AI Era.**

Cikopiboysec is a unified **AI Bug Bounty Operating System** designed for security researchers. Instead of juggling disjointed notes, postman collections, and terminal outputs, Cikopiboysec centers all your security research around the **Target**, providing high traceability and a clean audit trail from initial discovery to final reporting.

![Landing Page Preview](https://via.placeholder.com/1000x500.png?text=AI+Security+Research+OS)

## ✨ Core Modules

The platform is structured into 8 professional workflows:

1. 🎯 **Target Registry**: The CRM for bug bounties. Store metadata about targets, URLs, auth types, AI models, and scope.
2. 🔍 **Endpoint Discovery**: A dashboard to map out public endpoints, sitemaps, robots.txt, JS asset references, and API inventories.
3. 🧪 **Prompt Behavior Lab**: Workspace for testing AI robustness against complex inputs (jailbreaks, context overrides, role confusion). Includes an API Executor for direct prompt testing and OpenAI seed integration.
4. 🔐 **Auth Flow Inspector**: Log and analyze authentication mechanisms (JWT lifecycles, OAuth misconfigurations).
5. 🧩 **Tools Mapper**: Track JSON-based tool capability calls to find RCE/SSRF vectors in AI parameters.
6. 📈 **Findings Management**: Structured vulnerability tracking with severity aggregations.
7. 🗄️ **Evidence Vault**: Central storage for immutable HTTP request/response pairs, payloads, and screenshots.
8. 📑 **Report Generator**: Automated markdown-based report builder compiling findings and evidence into professional formats.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4 (Neobrutalism/Glassmorphism UI), Lucide-React
- **State Management**: Zustand
- **Backend/ORM**: Prisma 7
- **Database**: PostgreSQL (Dockerized)

---

## 🚀 Getting Started

Follow these instructions to spin up the workspace locally on your machine. All data is stored locally in your Docker container, ensuring your zero-days and payloads remain 100% private.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Faathirazukhruf/Cikopiboysec.git
cd Cikopiboysec
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Duplicate the example environment file:
```bash
cp .env.example .env
```
*(The default `.env` is already configured to work with the local Docker database out of the box).*

### 4. Start the Database (Docker)
Ensure Docker is running, then spin up the local PostgreSQL database:
```bash
docker compose up -d
```

### 5. Run Database Migrations
Push the Prisma schema to create all necessary tables:
```bash
npx prisma db push
```

### 6. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` depending on your terminal output) with your browser to enter the workspace.

---

## 📖 Research Workflow Guide

1. **Target Registration**: Add your target application in the `Targets` menu to create a research universe.
2. **Reconnaissance**: Use `Discovery` and `Auth Flow` to map the attack surface and understand authentication lifecycles.
3. **Execution**: Use the `Prompt Lab` to attempt jailbreaks and the `Tools Map` to trace AI tool-calling parameters.
4. **Vaulting**: Save any successful payloads and HTTP responses in the `Evidence Vault`.
5. **Escalation**: Link your evidence to a `Finding` and assign a severity score.
6. **Reporting**: Use the `Reports` module to automatically generate a Markdown write-up ready for submission to HackerOne or Bugcrowd.

---

*Built for the modern AI Red Teamer.*
