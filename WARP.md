# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Framework: Next.js (App Router) with React 19 and TypeScript
- Styling: Tailwind CSS v4 (globals.css defines color tokens and dark mode)
- UI: shadcn/ui over Radix primitives (components/ui/*)
- State: Zustand with sessionStorage persistence (onboarding store)
- Backend integration: local REST API at http://localhost:4000 for auth and profiles
- Persistence: Firebase Firestore for basic user record and onboarding flag

Common commands
- Install dependencies
  - npm install
- Development server (Turbopack)
  - npm run dev
- Production build (Turbopack)
  - npm run build
- Start production server
  - npm run start
- Lint (ESLint flat config)
  - Entire repo: npm run lint -- .
  - Source only: npm run lint -- src
- Type check (noEmit)
  - npx tsc -p tsconfig.json --noEmit
- Tests
  - No test framework or tests are currently configured in this repo.

Architecture and code structure
- App Router and routes
  - src/app contains route groups for the main app flows:
    - (onboarding): welcome, about-you, cofounder-preference, cofounder-profile, matchmaking-data, profile-setup
    - (dashboad): dashboard
  - Navigation uses next/navigation. See wrappers and lib functions for guarded redirects.
- State management (Zustand)
  - src/store/onboardingStore.ts keeps the multi-step onboarding data.
  - Persisted to sessionStorage under the key onboarding-storage; provides updateField and reset helpers for step UIs.
- Backend and data flow
  - Auth
    - src/lib/auth.ts
      - handleSignUp: POST http://localhost:4000/auth/register; on success, creates a minimal user in Firestore and toggles UI back to login.
      - handleLogin: validates the user exists in Firestore, then POST http://localhost:4000/auth/login; stores accessToken in localStorage; routes to /dashboard if isOnboarded, else /welcome.
      - isAccessTokenValid: minimal JWT exp check used for guards.
  - Profile creation
    - src/lib/profile.ts
      - createProfile: POST http://localhost:4000/profiles with Bearer accessToken; on 2xx, marks the Firestore user as onboarded, resets onboarding store, and routes to /dashboard.
  - Firebase integration
    - src/lib/firebase.ts
      - saveUserToFirebase: creates a users doc with isOnboarded=false and createdAt server timestamp.
      - getUserFromFirebase: fetches a user by email, maps Firestore Timestamp to Date, caches userId/email in localStorage, returns FirebaseUser.
      - markUserOnboarded: sets isOnboarded=true for the given userId.
- UI composition
  - Atomic structure under src/components:
    - atoms, molecules, pages, ui (shadcn wrappers), wrappers (e.g., access-token wrapper)
  - Example wrappers/access-token-wrapper/TokenChecker uses a periodic JWT exp check to redirect unauthenticated users to /login.
- Styling and theming
  - src/app/globals.css imports Tailwind and tw-animate-css; defines CSS variables for light/dark themes and applies base styles via Tailwind layers.
- Types and utilities
  - src/types/firebase.ts and src/types/userprofile.ts define the FirebaseUser and OnboardingData shapes.
  - src/lib/constants.ts centralizes select options for onboarding (locations, industries, etc.).
  - src/lib/utils.ts provides cn() to compose classNames with tailwind-merge.
- Path aliases and tooling
  - tsconfig.json sets paths: "@/*" -> "./src/*".
  - eslint.config.mjs extends next/core-web-vitals and next/typescript; ignores .next, node_modules, out, build, next-env.d.ts.

Notes for working in this repo
- The local backend at http://localhost:4000 must be running for auth and profile APIs used throughout onboarding and login flows.
- Client state persistence: onboarding state is stored in sessionStorage (not localStorage). Auth token and Firebase userId/email are stored in localStorage by lib/auth.ts and lib/firebase.ts.
- Next.js version is 15 with Turbopack enabled in scripts. If troubleshooting build/dev performance, remove the --turbopack flag temporarily to compare behavior.
