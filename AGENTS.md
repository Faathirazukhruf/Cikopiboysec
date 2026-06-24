<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Cikopiboysec - AI Security Research Workspace

## 📌 Project Context
**Cikopiboysec** is an **AI Bug Bounty Operating System** designed specifically for **Defensive Security Research**. It provides a unified workspace for security researchers to map endpoints, test prompt robustness, inspect authentication flows, and generate vulnerability reports for AI-driven applications.

Instead of jumping between disjointed tools and notes, this platform centers all research around the **Target** entity, ensuring high traceability and a clean audit trail from discovery to final reporting.

## 🏗️ Core Modules
The system is divided into Several Core Modules:
1. **Target Registry**: The CRM for bug bounties. Stores metadata about targets, URLs, auth types, AI models in use, dan scope.
2. **Endpoint Discovery**: A dashboard to map out public endpoints, sitemaps, robots.txt, JS asset references, and API inventories.
3. **Prompt Behavior Lab**: Workspace for testing AI robustness against complex inputs (jailbreaks, context overrides, role confusion).
4. **Auth Flow Inspector**: Logs and analyzes authentication mechanisms (JWT lifecycles, OAuth misconfigurations).
5. **Tools Mapper**: Tracks JSON-based tool capability calls (Tool Calling) to find RCE/SSRF vectors in AI parameters.
6. **Findings Management**: Structured vulnerability tracking with severity aggregations. Bridging evidence with reports.
7. **Evidence Vault**: Central storage for immutable HTTP request/response pairs, payloads, and screenshots.
8. **Report Generator**: Automated markdown-based report builder compiling findings and evidence into professional formats.

## 🛠️ Technology Stack
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Running locally via Docker for dev)
- **ORM**: Prisma 7 (using `@prisma/adapter-pg` driver adapter, utilizing `adapter-pg` to connect to DB)
- **Styling**: Tailwind CSS v4 (using `@theme` directives), Lucide-React for icons
- **State Management**: Zustand
- **Architecture**: Relational Database structure centered heavily around the `Target` model.

## ⚠️ AI Developer Guidelines (CRITICAL RULES)
If you are an AI agent writing code for this project, you **MUST** adhere to the following rules without exception:

1. **🔒 Secure by Design**: Always write secure code. Validate all inputs on both client and server. Anticipate common vulnerabilities (XSS, SQLi, SSRF, CSRF) and mitigate them immediately. Never expose sensitive environment variables to the client.
2. **📱 100% Mobile Responsive**: All UI components and pages must be fully responsive across all devices (mobile, tablet, desktop). Use Tailwind's responsive breakpoints (`sm:`, `md:`, `lg:`) effectively. Never build desktop-only views. Ensure tables and data-heavy components scroll horizontally on mobile.
3. **🧩 Reusable & Modular Code**: Keep components small, focused, and reusable. Avoid massive monolithic files. Extract repeated logic into hooks, contexts, or utility functions.
4. **🧹 Clean & Tidy**: Maintain a strict and clean folder structure. Follow existing naming conventions. Remove unused imports, format code properly, and leave concise comments explaining complex logic.
5. **🛡️ Graceful Error Handling**: Ensure the UI never crashes if the database is disconnected or an API fails. Always use fallback states, empty states, and loading skeletons. Validate API responses thoroughly.
6. **🎨 Premium Aesthetics**: This tool must feel like a premium, state-of-the-art security platform. Use dark mode, glassmorphism, subtle micro-animations, and structured layouts. Avoid generic, cheap-looking designs.
