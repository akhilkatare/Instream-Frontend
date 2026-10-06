# Instream — Mobile App

A video-sharing app built with Expo and React Native. Users can upload and watch
videos, follow channels, comment, search, and manage their own channel — backed
by a FastAPI service with JWT auth and Cloudinary media hosting.

> This is the **frontend** repo. The backend (FastAPI + Postgres + Redis) lives
> in a separate repository.

---

## Features

- **Auth** — email registration with OTP verification, login, forgot/reset
  password, and JWT access + refresh tokens with automatic silent refresh.
- **Video feed** — a scrollable feed of videos showing each thumbnail, channel,
  view count, and upload time.
- **Watch** — autoplaying player with native controls, auto-rotate to
  fullscreen on landscape, like, share, collapsible description, and comments.
- **Search** — debounced video search.
- **Upload** — pick a video + thumbnail and publish directly to Cloudinary.
- **Channels** — create and manage your own channel (edit name/description,
  delete), view any public channel, and follow / unfollow.
- **Comments** — add and delete comments with avatars and relative timestamps.
- **Watch history** — automatically recorded on playback, with per-item removal.
- **Profile** — avatar upload, change password, delete account, and a
  light/dark theme toggle.

---

## Tech Stack

| Area              | Choice                                           |
| ----------------- | ------------------------------------------------ |
| Framework         | [Expo](https://expo.dev) + React Native          |
| Language          | TypeScript                                       |
| Navigation        | Expo Router (file-based)                         |
| Server state      | TanStack Query (React Query)                     |
| Client state      | Zustand (auth)                                   |
| Styling           | NativeWind v4
| HTTP              | Axios

---

## Project Structure

```
.
├── app/                   # Expo Router routes (file-based screens)
│   ├── (tabs)/            # Tab navigator
│   ├── channel/[id].tsx   # Public channel view
│   └── watch/[id].tsx     # Watch screen
│
├── src/
│   ├── api/               # Axios client + typed API functions
│   ├── components/        # Shared UI components
│   ├── config/            # Constants, secure store
│   ├── features/          # Feature modules (auth, video, channel, ...)
│   ├── hooks/             # Cross-cutting hooks
│   ├── store/             # Zustand stores
│   ├── theme/             # Colors + useThemeColors
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Helpers
│
├── global.css             # Tailwind directives + theme variables
├── tailwind.config.js     # NativeWind preset, tokens, dark mode
├── babel.config.js        # Babel config
├── metro.config.js        # Metro config
└── app.json               # Expo config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/) (`npx expo`)
- Xcode (iOS Simulator) and/or Android Studio (emulator)
- A running instance of the Instream backend

### 1. Install

```bash
npm install
```

### 2. Configure the API URL

Create a `.env` file in the project root using the keys provided in the
`.env-sample` file, then fill in your values:


### 3. Run

Because the app uses native modules (expo-video, expo-screen-orientation) and a
config-plugin splash screen, use a **development build** rather than Expo Go:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

For day-to-day JS changes after the dev build is installed:

```bash
npx expo start
```

If styles or env changes don't take effect, clear the Metro cache:

```bash
npx expo start -c
```

---

## Auth Flow

- On login, access + refresh tokens are stored in **expo-secure-store**.
- A request interceptor attaches the access token to every call.
- On a `401`, a response interceptor silently calls `/auth/refresh`, stores the
  new pair, and retries the original request. Concurrent 401s share a single
  refresh. If refresh fails, tokens are cleared and the user is logged out.

---

## Scripts

```bash
npx expo start          # Start the dev server
npx expo start -c       # Start with a cleared cache
npx expo run:ios        # Build & run the iOS dev client
```

## Screen Shots
<img width="1206" height="2622" alt="7" src="https://github.com/user-attachments/assets/c3e89626-340f-4f13-91ad-07aae369d11e" />
<img width="1206" height="2622" alt="6" src="https://github.com/user-attachments/assets/841c13f8-bca4-41f5-b4cc-e615236d04ed" />
<img width="1206" height="2622" alt="5" src="https://github.com/user-attachments/assets/87159ef2-5e46-46d6-bd55-41f25e417b36" />
<img width="1206" height="2622" alt="4" src="https://github.com/user-attachments/assets/6795bcb4-e044-45ed-ab06-19b0a1637913" />
<img width="1206" height="2622" alt="3" src="https://github.com/user-attachments/assets/0d0a6feb-d409-4995-81a9-50d5cc190908" />
<img width="1206" height="2622" alt="2" src="https://github.com/user-attachments/assets/c5d4a157-b111-4622-9280-c4f1811f89a6" />
<img width="1206" height="2622" alt="1" src="https://github.com/user-attachments/assets/b200f885-642d-485b-aae0-a0043b1d8665" />
npx expo run:android    # Build & run the Android dev client
```
