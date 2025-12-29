ParentFully Admin Dashboard
A modern admin dashboard built with Next.js and NextUI for managing ParentFully operations. Fully responsive, with dark/light mode support, charts, and account management features.
Next.js | NextUI

You can view the demo here: ''
Features
Dark Mode & Light Mode support
Fully responsive design
Home page with interactive charts
Accounts management page
More pages coming soon…
Screenshots
Dark Mode

Light Mode

Project Structure
├── components
│   ├── accounts            # Components for managing accounts
│   ├── charts              # Chart components
│   ├── breadcrumb          # Breadcrumb component
│   ├── home                # Home page components
│   ├── layout              # Layout components
│   ├── navbar              # Navbar components
│   ├── sidebar             # Sidebar components
│   ├── table               # Table components
│   ├── styles              # Reusable styles/components
│   ├── icons               # Icon components
│   ├── hooks               # Custom hooks
├── pages
│   ├── _app.tsx            # App entry point
│   ├── index.tsx           # Home page
│   ├── accounts.tsx        # Accounts management page
│   └── ...                 # More pages coming soon
└──
Getting Started
Install dependencies:
npm install
Start the development server:
npm run dev
Open your browser and visit http://localhost:3000
Deployment
You can deploy this project directly to Vercel:
