# KOSH 💰🛡️
> **The Agentic Financial Coach for the Gig Economy.**

![Next.js 15](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38b2ac)

## 🚨 The Problem
Traditional banking is designed for the 9-to-5 employee with a predictable monthly salary. **Gig workers, freelancers, and drivers** (The "Unpredictable Earners") face a different reality:
1.  **Income Volatility:** Money comes daily or sporadically, not monthly.
2.  **The Tax Trap:** Gross income is spent immediately, leaving $0 for tax season liabilities.
3.  **Generic Advice:** Standard budgeting apps don't understand that a $500 expense today might mean missing rent tomorrow.

## 💡 The Solution: KOSH-Lite
KOSH (Hindi for *Treasure/Fund*) is not just a tracker—it is an **Agentic Financial Guardian**. It proactively manages cash flow, enforces discipline through automation, and provides multimodal AI coaching.

### 🌟 Key Features

#### 1. 🛡️ The "Tax Trap" Agent (Agentic Workflow)
Instead of relying on user willpower, the KOSH Agent intercepts income the moment it is registered via the **"Just Got Paid"** button.
* **Auto-Lock:** Instantly calculates and locks **15%** of income into a secure **Tax Vault**.
* **Guardrails:** If a user tries to withdraw these funds before Tax Season (April), the Agent **blocks the transaction** to protect the user from future liability.

#### 2. 🧠 Context-Aware AI Coach (Google Gemini)
Powered by **Google Gemini 2.5 Flash**, the AI doesn't just chat; it knows you.
* **Contextual Memory:** It remembers your past savings successes and uses them to motivate you.
* **Receipt Analysis (Multimodal):** Upload a photo of a bill or receipt, and the AI categorizes it as "Needs" vs. "Wants."
* **Voice Mode (Accessibility):** Full Voice-to-Text and Text-to-Speech support for drivers who need hands-free advice.

#### 3. 💸 Flexible Micro-Savings
Create savings plans that match gig cash flow: **Daily** or **Weekly** contributions (e.g., "$5/day for a new bike").

#### 4. 📊 Financial Health Score
A gamified 0-100 score that updates based on your consistency, encouraging positive behavioral change.

---

## 💼 Business Plan & Viability

KOSH is designed as a sustainable Fintech SaaS with a clear path to monetization.

### Revenue Streams
1.  **Freemium Subscription (B2C):**
    * **Free Tier:** Manual wallet, Basic Savings Plans, Rule-based alerts.
    * **Pro Tier ($5/mo):** Agentic Tax Vault, Multimodal AI Coach (Receipt Scanning), Voice Mode.
2.  **The Float (Fintech Model):**
    * Aggregated user wallet balances held in high-yield partner accounts generate interest revenue (standard model for apps like Starbucks/Venmo).
3.  **Affiliate Marketplace:**
    * The AI Coach recommends specific financial products tailored to gig workers (e.g., Micro-insurance, Two-wheeler loans, Tax filing software), earning referral commissions.

### 🚀 Go-To-Market (GTM) Strategy
1.  **Platform Partnerships (B2B2C):**
    * Partner with gig platforms (Uber, Swiggy, Upwork) to integrate KOSH directly into their driver/freelancer dashboards as a financial wellness perk.
2.  **Community Infiltration:**
    * Target specific "Hustle" communities (Reddit r/freelance, Facebook Driver Groups) with the "30-Day $5 Savings Challenge."
3.  **Influencer Marketing:**
    * Collaborate with "Side Hustle" educators and financial influencers who specifically target the unbanked/underbanked demographic.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router & Server Actions)
* **Language:** TypeScript
* **Database:** MongoDB (Mongoose)
* **AI Model:** Google Gemini 2.5 Flash (via `@google/genai` SDK)
* **UI:** ShadCN UI + Tailwind CSS
* **Auth:** NextAuth.js (v4)
* **Effects:** `canvas-confetti` for gamification
* **Voice:** Native Web Speech API

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kaushik0010/MumbaiHacks-KOSH.git
cd MumbaiHacks-KOSH
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Environment Variables
Create a .env file in the root directory:
```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_random_secret_string

# Google AI (Get key from aistudio.google.com)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
pnpm dev
```
Open http://localhost:3000 with your browser.

---

## 🧪 How to Demo (The Happy Path)
1. **Register:** Create a new account.

2. **The "Wow" Moment (Agentic):** Click "Just Got Paid" and add $100.

    - Notice: The Wallet increases by $85, and the Tax Vault automatically captures $15.

3. **The Guardrail:** Try to click the Lock Icon on the Tax Vault to withdraw.

    - Result: The Agent blocks you (Red Toast Notification) because it is not Tax Season.

4. **Create a Plan:** Go to "Start Saving" -> Create a Daily Plan for $5. (Enjoy the Confetti! 🎉)

5. **Multimodal AI:** Open the AI Hub (bottom right).

    - Upload a receipt image.

    - Use the Mic button to ask: "Does this receipt fit my budget?"

    - Listen to KOSH speak back the analysis.

---

## 🔮 Future Roadmap
- **🔥 Gamified Streaks:** Visual "Day Streaks" and dynamic badges (e.g., "Weekend Warrior") to improve retention and daily logins.
- **Plaid Integration:** For real automated bank transfers.

- **🤝 Community Groups:** Peer-to-peer savings circles (Chit funds).

---

## 🏆 Hackathon Notes
- **Browser Support:** Voice features require Google Chrome or Microsoft Edge.

- **Tax Context:** The Tax Vault unlocks in April, coinciding with the start of the Assessment Year in the Indian Financial System. 

- **Media upload:** Use media provided in test-assets.

---

Made with ❤️ and ☕ for the Hackathon.