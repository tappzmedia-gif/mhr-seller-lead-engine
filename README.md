# My House Realty Seller Lead Engine™

A premium, white-label seller-lead capture and operations platform built for Puerto Rico real estate — fully adaptable for any market.

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** component library
- **Framer Motion** animations
- **Wouter** client-side routing (25+ routes)
- **Vite** dev server & bundler
- **Zustand** state management
- All mock data — no backend required (drop in your own API)

## Features

### Public-Facing
- Landing page with hero CTA and seller lead capture form
- Property catalog (`/catalogo`) with 8 listings
- Individual property detail pages (`/catalogo/:slug`)
- Dynamic contact/inquiry forms

### Admin CRM (25+ Routes)
| Module | Routes |
|---|---|
| Lead Center | Kanban pipeline, list view, status badges |
| Analytics | Trend charts with 6-period filter |
| Follow-Ups | Scheduled tasks & reminders |
| Evaluations | Property valuations & comparables |
| Offers | Offer tracking & management |
| Communications | Email/SMS log |
| Clients | Client profiles & history |
| Calendar | Bookings, meetings, availability |
| Proposals | Proposal builder & tracking |
| Invoices & Billing | Billing history & invoicing |
| Documents | Document management |
| Campaigns | Marketing campaign builder |
| Automations | Workflow automation rules |
| Team & HR | Team management, HR, learning |
| Listings | Active/inactive listing manager |
| Integrations | Third-party service connections |
| Templates | Email/SMS template library |
| AI Chatbot | Built-in AI assistant |
| Notifications | Notification center |
| Activity Log | Full audit trail |
| Settings | Branding tokens, preferences |

## White-Label Ready

All brand tokens (colors, logo, company name, tagline) are controlled via **Settings → Branding**. Clone this repo, update the branding tokens, and redeploy for each new client.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The app runs on `http://localhost:5173` by default.

## Project Structure

```
src/
├── App.tsx              # All routes defined here
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── layout/          # AdminLayout, PublicLayout, etc.
│   └── shared/          # Reusable feature components
├── pages/
│   ├── public/          # Landing, Catalog, CatalogDetail
│   └── admin/           # All 25+ admin pages
├── lib/
│   ├── mock-data.ts     # Leads, contacts, analytics data
│   └── listing-data.ts  # Property listing data
└── store/
    ├── index.ts         # Lead & app state (Zustand)
    └── listings-store.ts # Property catalog store
```

## License

Commercial use permitted. Resale as white-label template allowed.
