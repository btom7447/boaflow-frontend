This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🚀 FEATURES (Nice-to-haves)
### Lead Management

 Lead detail page (/leads/[id]) — full job description, company info, activity log
 Comments on leads — team can discuss leads inline
 Lead assignment — assign leads to specific sales reps
 Lead pipeline stages — drag-and-drop kanban board
 Saved filters — bookmark common lead queries
 Advanced search — full-text search across job descriptions

### Pipeline Enhancements

 Async mode toggle in UI with concurrency slider
 Schedule pipeline runs — cron-based automation (daily at 9am)
 Pipeline run details page — full logs, error details, retry failed companies
 Progress bar during pipeline run — show real-time progress
 Partial results — show leads as they're classified, don't wait for completion

### Analytics & Reporting

 Dashboard home page — charts showing leads over time, conversion rates
 Lead source breakdown — which companies produce the best leads
 Conversion funnel — new → contacted → interested → converted
 Time-to-close metrics — how long from discovery to conversion
 ROI calculator — show value generated from leads

### Settings & Admin

 Activity log — audit trail of all changes (who edited what role config)
 Team management — departments, permissions, role hierarchies
 Custom fields — let users add their own metadata to leads
 Email templates — configure outreach email templates
 API keys — let users generate API keys for custom integrations


## 🔮 FUTURE / ADVANCED

 AI pitch generator — suggest personalized outreach for each lead
 Lead scoring model — train custom ML model on your conversion data
 Chrome extension — scrape jobs directly from career pages while browsing
 LinkedIn integration — enrich leads with LinkedIn profiles
 CRM sync — two-way sync with Salesforce, HubSpot, Pipedrive
 Mobile app — React Native app for lead review on the go
 White-label — rebrand for resale to other agencies
 Multi-tenancy — run multiple clients in one instance


## 🎨 UI/UX RECOMMENDATIONS (Quick wins)

 Confirmation modals for all destructive actions (delete, deactivate)
 Undo button after bulk operations
 Contextual help — "?" icons with tooltips explaining features
 Onboarding tour — first-time user walkthrough
 Dark/light mode toggle — (optional, dark is good for now)
 Compact/comfortable view — toggle table density
 Column customization — show/hide columns, reorder them
 Infinite scroll instead of pagination for leads (optional preference)
 Sticky table headers — keep headers visible while scrolling


## 📊 PERFORMANCE OPTIMIZATIONS

 Virtualized tables for 1000+ leads — only render visible rows
 Debounced search — wait 300ms before firing search queries
 Optimistic updates — update UI immediately, sync in background
 Redis caching on backend — cache lead counts, role configs
 CDN for static assets — Cloudflare for faster load times
 Image optimization — if you add company logos later

Filter View for Tables (default is alphabetical)