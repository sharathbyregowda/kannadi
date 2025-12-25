# Simple Finance 💰

A modern, privacy-focused personal finance tracker built to help you master the **50/30/20 rule**.

![Simple Finance Dashboard](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000)
*(Replace with actual dashboard screenshot)*

- **Premium Onboarding Flow**: A revitalized, multi-step onboarding process with clear progress tracking and logic-driven step ordering.
- **Dashboard**: High-level financial health check.
    - **Redesigned Financial Journey**: Horizontal card-based layout featuring radial progress indicators for current vs. target percentages.
    - **Insight-Driven Summaries**: Monthly and Yearly summaries transformed into visual "Insight Cards" with color-coded sentiment badges and category icons.
    - **Unified Projections View**: A side-by-side dashboard for forecasts and milestones, removing tabs for better scannability.
    - **Savings Summary**: Instant view of your net savings and rates.
- **Reports & Analysis**: Deep dives into your data with visual progress bars and trend analysis.
- **Transactions Workspace**: Manage Income and Expenses with a detailed ledger.
- **Settings & Configuration**:
    - **Currency Support**: Choose your preferred currency symbol.
    - **Custom Categories**: Manage your own spending categories with emoji support.
    - **Robust Data Portability**: Securely Backup and Restore your data with backward compatibility support.

## 🚀 Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (Modern Variables & Flexbox/Grid)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/simple-finance.git
    cd simple-finance
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project is configured for **GitHub Pages**.

1.  Update `vite.config.ts` with your repository name:
    ```typescript
    base: '/simple-finance/', // Replace with your repo name
    ```

2.  Deploy with a single command:
    ```bash
    npm run deploy
    ```

## 📸 Screenshots

### Expense Ledger
*Rapidly add and edit expenses with a spreadsheet-like interface.*
![Expense Ledger](./screenshots/ledger.png)

### Data Management
*Securely backup and restore your data.*
![Backup UI](./screenshots/backup.png)

## 📄 License

MIT License - feel free to use this for your own financial journey!
