# 🏗️ Project Architecture & Structure Guide

Welcome to the codebase! If you have just forked this repository or are contributing for the first time, this guide will help you easily navigate the project without needing to blindly search for files.

## 🚀 Tech Stack Overview
This portfolio is built with modern web technologies:
- **Framework**: [Next.js](https://nextjs.org/) (Using the App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content Management**: [Sanity CMS](https://www.sanity.io/) (Headless CMS integrated directly)

---

## 📂 Root Directory Breakdown

At the root level, you'll find the configuration files that power the development environment.

- `.env.example` / `.env.local`: Environment variables (e.g., Sanity API keys).
- `next.config.js`: Configuration for Next.js (domains, rewrites, redirects).
- `tailwind.config.js` & `postcss.config.js`: Tailwind CSS styling rules and theme extensions.
- `sanity.config.ts` & `sanity.cli.ts`: Root configuration for the Sanity Studio and CLI.
- `package.json` & `bun.lock`: Dependencies and project scripts.
- `tsconfig.json` & `next-env.d.ts`: TypeScript compiler configuration and types.
- `CONTRIBUTING.md`: Guidelines for contributing to the repository.

---

## 🧠 The `src/` Directory

The entire application logic and UI reside within the `src/` directory. It is heavily modularized for readability and scalability.

### 1. `src/app/` (Next.js App Router)
This folder defines the routing for the application. Every folder inside `app/` that contains a `page.tsx` represents a public route on the website.

- `api/`: Backend API routes (e.g., fetching GitHub stats).
- `about/`: The `/about` page.
- `blog/`: The `/blog` page and dynamic `[post]` routing.
- `projects/`: The `/projects` directory and dynamic `[project]` routing.
- `studio/`: The `/studio` route, which securely embeds the Sanity CMS Studio directly into the app.
- `layout.tsx`: The global root layout that wraps all pages (Navbar, Footer, Theme providers).
- `page.tsx`: The main landing page `/`.

### 2. `src/components/` (UI Architecture)
Reusable React components are categorized based on their scope and reusability.

- `global/`: Components used across the entire site (e.g., `Navbar.tsx`, `Footer.tsx`, `Theme.tsx`, `Loader.tsx`).
- `pages/`: Page-specific sections or blocks that are too large to keep in `page.tsx` (e.g., `GithubStats.tsx`, `Heroes.tsx`, `ContributionGraph.tsx`).
- `shared/`: Generic, highly reusable components used anywhere (e.g., `CodeBlock.tsx`, `EmptyState.tsx`, `PortableImage.tsx`).
- `widgets/`: Specialized modular UI elements.

### 3. `src/sanity/` (Content Management)
Contains everything needed to manage data via Sanity CMS.

- `lib/`: Helper functions to fetch data (Queries) and configure the Sanity client (`sanity.client.ts`).
- `schemas/`: Defines the structure of the data you can create in the Sanity Studio. If you want to add a new field to a blog post, you edit `schemas/post.ts`.

### 4. `src/assets/`
Static assets imported directly into TypeScript files.
- `font/`: Local fonts (`inter.woff2`, `incognito`, `gitlab-mono`) and their Next.js font loading configurations (`font.ts`).
- `icons/`: Custom SVG icons stored as React components (e.g., `SunIcon.tsx`, `MoonIcon.tsx`).

### 5. `src/utils/` & `src/hooks/`
- `utils/`: Helper functions for dates, read time calculations, text formatting, etc.
- `hooks/`: Custom React hooks (e.g., `useDevicePerformance.ts`).

### 6. `src/animation/` & `src/styles/`
- `animation/`: Framer Motion or custom animation wrapper components (`Slide.tsx`, `TextReveal.tsx`).
- `styles/`: Global CSS variables (`globals.css`) and syntax highlighting themes (`prism.css`).

---

## 🖼️ The `public/` Directory

The `public/` directory is for static assets that are served directly to the browser at the root URL (e.g., `/images/logo.png`).

- `images/`: All raster and vector graphics used across the site (logos, placeholders, background noise).
- `videos/`: Local video assets.
- `audio/`: Local audio assets (e.g., easter egg sound files).

---

## 🛠️ How to Navigate When Forking

1. **Changing Styles/Colors**: Open `tailwind.config.js` and `src/styles/globals.css`.
2. **Adding a New Page**: Create a new folder in `src/app/` (e.g., `src/app/contact/page.tsx`).
3. **Modifying the Database/CMS**: Edit the schemas in `src/sanity/schemas/` and query them in `src/sanity/lib/sanity.query.ts`.
4. **Updating the Navigation**: Edit `src/components/global/Navbar.tsx`.
5. **Replacing Images**: Add your images to `public/images/` and reference them as `/images/your-file.png`.

*Happy Browsing!*
