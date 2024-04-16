# Movie Connections

## Overview

Website for creating and playing connections-style puzzles for movies! You can access it [here](https://movie-connections.fly.dev/)!

## Tech Stack

This website is built with Next.js, React, Typescript, TailwindCSS, DaisyUI, Framer Motion, Firestore, and fly.io.

## Repo structure

```
📦app
 ┣ 📂api
 ┃ ┗ 📂tmdb
 ┃ ┃ ┗ 📜route.ts
 ┣ 📂components
 ┃ ┣ 📜browse.tsx
 ┃ ┣ 📜footer.tsx
 ┃ ┗ 📜header.tsx
 ┣ 📂create
 ┃ ┣ 📜displayCreate.tsx
 ┃ ┣ 📜lib.tsx
 ┃ ┗ 📜page.tsx
 ┣ 📂firebase
 ┃ ┣ 📜config.tsx
 ┃ ┣ 📜lib.ts
 ┃ ┗ 📜types.tsx
 ┣ 📂puzzles
 ┃ ┗ 📂[id]
 ┃ ┃ ┣ 📜displayPuzzle.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┣ 📜favicon.ico
 ┣ 📜globals.css
 ┣ 📜layout.tsx
 ┣ 📜not-found.tsx
 ┗ 📜page.tsx
```
