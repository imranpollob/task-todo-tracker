
# Task Todo Tracker Frontend (Next.js)

This is the frontend for the Task Todo Tracker app, built with Next.js, TypeScript, and Tailwind CSS.

## Requirements
- Node.js >= 18
- npm (or yarn/pnpm/bun)

## Installation
1. Install dependencies:
	 ```sh
	 npm install
	 ```
2. Start the development server:
	 ```sh
	 npm run dev
	 ```
	 The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage
- Main page: `src/app/page.tsx`
- UI components: `src/components/ui/`
- Global state/context: `src/contexts/`
- Helper utilities: `src/helpers/`, `src/lib/`
- Styling: Tailwind config in `tailwind.config.ts`, global styles in `src/app/globals.css`

## Developer Commands
- Build for production:
	```sh
	npm run build
	```
- Lint (if configured):
	```sh
	npm run lint
	```

## Project Structure
- `src/app/` — Main app pages and layout
- `src/components/` — React components
- `src/components/ui/` — Atomic UI components
- `src/contexts/` — React context providers
- `src/helpers/`, `src/lib/` — Utility functions

## API Integration
- Communicates with the backend via REST endpoints (see backend API docs)
- Authentication context in `src/contexts/AuthContext.js` (matches backend Laravel Sanctum)

## Deployment
- Deploy on Vercel or any platform supporting Next.js

---
For more details, see the Next.js documentation: https://nextjs.org/docs
