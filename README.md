# RecyLink - Waste Collection & Reward System (MERN MVP)

A comprehensive waste collection and reward system built with the MERN stack.

## Project Structure

```
recylink-mern-mvp/
├── client/          # React frontend (Vite + Tailwind CSS)
├── server/          # Node.js backend (Express + MongoDB)
├── package.json     # Root package.json for monorepo scripts
└── README.md
```

## Features

- **User Authentication**: JWT-based authentication with role-based access
- **Waste Reporting**: Users can report waste issues with location and images
- **Verification System**: Community-driven verification with point rewards
- **Admin Dashboard**: Admin tools for managing reports and collections
- **Point System**: Internal reward system for user engagement

## 🚀 Quick Start

For a complete setup guide, see **[GETTING_STARTED.md](./GETTING_STARTED.md)** - a comprehensive guide for learners.

### Quick Setup

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   ```bash
   node setup-env.js
   ```

3. **Configure MongoDB** in `server/.env`

4. **Start development servers**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

### Test Credentials
- **Admin**: `admin@recylink.com` / `password123`
- **Regular User**: `test@example.com` / `password123`

## Troubleshooting

### Website Flickering Issue
If you experience flickering between `/auth` and home page:

1. **Check server status**: Make sure the backend server is running on port 5000
2. **Check MongoDB**: Ensure MongoDB is running and accessible
3. **Clear browser cache**: Clear your browser's cache and cookies
4. **Check console**: Open browser dev tools and check for any errors

### Common Issues

**Server won't start:**
- Check if port 5000 is available
- Verify MongoDB connection string in `server/.env`
- Make sure all dependencies are installed: `npm run install-all`

**Client won't start:**
- Check if port 5173 is available
- Verify `client/.env` exists with correct API URL

**Authentication issues:**
- Check browser console for errors
- Verify JWT secret in `server/.env`
- Try creating a new user or use the admin credentials

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Reports
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get user's reports (or all for admin)
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id/verify` - Verify a report

### Admin
- `PUT /api/admin/reports/:id/collect` - Mark report as collected

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Database**: MongoDB with Mongoose ODM

## Why RecyLink matters

RecyLink is more than a reporting app — it's a community feedback and rewards platform that turns everyday civic participation into measurable impact. It helps people find, report, and resolve local waste issues while motivating ongoing participation through a points and rewards system. By combining location-verified reports, community verification, and optional on-chain proofs (Sui), RecyLink improves transparency and accountability.

Key benefits:
- Faster issue detection: Citizens report problems as they see them (with photos and location).
- Better prioritization: Authorities and businesses can triage verified reports and allocate resources efficiently.
- Community engagement: Points, leaderboards, and badges encourage repeat contributions.
- Transparent records: Optional blockchain receipts (Sui) can provide immutable proof of action.

## Who benefits

- Individuals: Earn points, build reputation, and see their local area improve.
- Neighborhood groups & NGOs: Coordinate volunteer cleanups and show donors measurable impact.
- Municipalities & waste services: Get verified problem reports with photos and locations; improve response time and public trust.
- Businesses: Sponsor cleanups, partner on recycling programs, or reward customers for participation.

## Business model (ways to monetize responsibly)

RecyLink can be run as a social-impact platform with several sustainable revenue options:

1. Sponsored partnerships — partner with local governments, recycling companies, and NGOs to provide premium reporting dashboards and APIs that integrate directly with operational systems.
2. Verified data & insights — offer aggregated, anonymized analytics about waste hotspots, trends, and community engagement to municipalities and environmental organizations (data packages, not personal data).
3. Reward marketplace — connect businesses to the platform so they can sponsor points or offer discounts as rewards; businesses pay a fee to list offers.
4. Premium features — offer a paid tier for organizations (priority support, SLA for report ingestion, custom integrations, white-label options).
5. Grants & impact funding — NGOs and municipalities often fund civic or environmental tools; pursue grants for pilot programs.

Important: privacy and data protection must be preserved. Do not sell personal data — offer aggregated insights and explicit, opt-in reward flows.

## Sui Blockchain integration (how and why)

We added an optional Sui integration scaffold to demonstrate how on-chain proofs can augment the platform. Sui is a modern Layer-1 blockchain that can be used for:

- Public identity linkage: store (public) wallet addresses on user profiles to associate on-chain credentials or badges.
- Proof-of-participation NFTs: mint small NFTs as badges or certificates for top contributors (testnet first).
- Immutable receipts: write a small on-chain receipt when a report reaches 'Collected' to provide an auditable trail.

Implementation approach (recommended incremental path):
1. Connect-only: let users link their Sui wallet and store the public address on their profile (no private keys stored server-side).
2. Proofs: mint simple NFTs on Sui testnet for verified milestones (e.g., 10 reports verified).
3. Receipts: store a minimal on-chain receipt (tx hash) for completed/collected reports.

Packages & tooling for production-ready Sui integration:
- `@mysten/sui.js` — official Sui SDK
- Sui wallet adapters (community or official) for React

Security note: always use wallet adapters to keep private keys in the user's wallet. Do not store private keys on the server or in the browser.

## Partners & Pilots

Potential partners include city councils, community organizations, recycling companies, and local businesses. A pilot program could offer:
- Free deployment for a neighborhood or ward for 3 months
- A dashboard for municipal teams to receive verified reports
- Co-branded reward campaigns with local businesses

## Next steps / roadmap suggestions

1. Add real Sui wallet adapter integration (connect + display public address)
2. Pilot with a local municipality or NGO and collect initial usage metrics
3. Implement the reward marketplace and sponsorship flows
4. Add server-side leaderboard caching and pagination for scale
5. Add tests and CI to ensure stability

## Contributing
All contributions are welcome — please open issues or PRs. See `GETTING_STARTED.md` for setup help and developer notes.
