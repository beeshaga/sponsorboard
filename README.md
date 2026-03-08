# SponsorBoard UK

A job board for UK Skilled Worker visa holders, showing companies licensed to sponsor visas with direct links to their careers pages.

Built with **Vite + React**, designed to deploy on **Vercel** in one click.

## Features

- 170+ curated UK visa sponsors across all regions
- Search by company, city, region, or industry
- Filter by industry, UK region, and sort options
- Bookmark companies you're interested in
- List and grid view modes
- Infinite scroll for performance
- Keyboard shortcuts (/ to search, Esc to clear)
- Mobile responsive
- Direct links to every company's careers page

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com/new
3. Import your GitHub repository
4. Click Deploy — Vercel auto-detects Vite

## Updating the Data

Edit `src/data/sponsors.js` and push to GitHub. Vercel auto-deploys.

For the full Home Office list:
https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers

## Project Structure

```
src/
├── components/     # UI components
├── data/
│   └── sponsors.js # THE DATA — edit this to update
├── App.jsx         # Main app
├── main.jsx        # Entry
└── styles.css      # Global styles
```
