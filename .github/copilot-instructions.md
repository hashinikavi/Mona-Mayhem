---
name: Mona Mayhem Workspace
description: "Guidelines for GitHub Copilot when working on the Mona Mayhem workshop project. Use when: developing features, building API endpoints, styling components, working with Astro pages and layouts."
---

# Mona Mayhem — Workspace Instructions

## 📋 Project Overview

**Mona Mayhem** is a retro arcade-themed GitHub Contribution Battle Arena built with **Astro 5** and **Node.js adapter**. This is a workshop template designed to teach Copilot-driven development workflows.

### What We're Building

- A web app that fetches and compares GitHub contribution graphs for two users
- Dynamic API endpoints to retrieve GitHub contribution data
- Interactive UI for selecting users and viewing battle results
- Retro arcade visual theming

### Key Tech Stack

- **Framework:** Astro 5.14.4
- **Runtime:** Node.js (via @astrojs/node adapter in standalone mode)
- **Language:** TypeScript
- **Styling:** CSS (with theme toggle capability)

---

## 🚀 Quick Start & Commands

### Development

```bash
npm run dev
```
Starts the Astro dev server on `http://localhost:3000` with hot module reloading (HMR) enabled.

### Build & Deploy

```bash
npm run build
npm run preview
```
- `build`: Compiles the project to static HTML + server routes
- `preview`: Serves the production build locally for testing

### Direct Astro Commands

```bash
npm run astro -- <command>
```
Run Astro CLI directly (e.g., `npm run astro -- add @astrojs/react` to add integrations).

---

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── index.astro          → Main landing page
│   └── api/
│       └── contributions/
│           └── [username].ts → Dynamic API endpoint for GitHub contributions
public/                       → Static assets (favicons, images)
docs/                         → Theme reference and styling documentation
```

### Key Directories

- **`src/pages/`** — Astro routes (files become URLs automatically, `[param].astro` = dynamic routes)
- **`src/pages/api/`** — Server-side API endpoints (JSON responses)
- **`public/`** — Static assets served as-is
- **`docs/`** — Static documentation and theme guides (not part of the app)

---

## 🎨 Astro Best Practices for This Project

### 1. **Page & API Structure**

- **Pages** live in `src/pages/` and automatically become routes
- **API routes** live in `src/pages/api/` and respond with JSON
- Use **dynamic routes** (`[param].ts`) for dynamic content (e.g., `[username].ts`)
- Each file exports a `GET`, `POST`, `PUT`, `DELETE` function for HTTP methods

Example API endpoint:
```typescript
// src/pages/api/contributions/[username].ts
export async function GET({ params }) {
  const { username } = params;
  // Fetch from GitHub API
  return new Response(JSON.stringify({ username, contributions: [...] }));
}
```

### 2. **Frontmatter & Component Logic**

- **Astro pages** use frontmatter (code between `---`) for server-side logic
- Frontmatter runs **only on the server**, never in the browser
- Use frontmatter to fetch data, set page title, prepare variables
- Pass props to components that render in HTML

Example:
```astro
---
// This runs on the server only
const data = await fetchGitHubData();
const pageTitle = "Battle Arena";
---

<html>
  <head><title>{pageTitle}</title></head>
  <body>
    {/* This renders in HTML */}
    <p>{data.user1} vs {data.user2}</p>
  </body>
</html>
```

### 3. **File-Based Routing**

- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/api/contributions/[username].ts` → `/api/contributions/alice` (dynamic)
- `src/pages/[username]/index.astro` → `/:username` (catch-all for user pages)

**Avoid** nesting too deeply; keep routes in `src/pages/` flat and organized by purpose.

### 4. **Styling & CSS**

- Import CSS directly in `.astro` files: `import "./styles.css"`
- **Scoped CSS**: CSS in `<style>` blocks inside `.astro` files is automatically scoped
- Use CSS custom properties for theming (e.g., `--primary-color`, `--bg-color`)
- Theme toggle logic can use `localStorage` with event listeners in `<script>` tags

### 5. **Server-Side Data Fetching**

- Fetch data in frontmatter (not in browser components)
- Use Node.js APIs directly (no browser restrictions)
- Handle errors gracefully with try/catch
- Cache or memoize expensive API calls if possible

### 6. **Layout & Reusable Components**

- Create shared layouts in `src/layouts/` for consistent page structure
- Use `.astro` components (no need for separate component syntax)
- Props are passed like regular function parameters

Example:
```astro
// src/layouts/Base.astro
---
interface Props { title: string }
const { title } = Astro.props;
---

<html>
  <head><title>{title}</title></head>
  <body><slot /></body>
</html>
```

---

## 💻 Development Workflow

1. **Run dev server:** `npm run dev`
2. **Edit files** in `src/pages/` or `src/pages/api/`
3. **Refresh browser** (HMR usually handles this automatically)
4. **Test API endpoints** at `http://localhost:3000/api/contributions/[username]`
5. **Build & preview** with `npm run build && npm run preview` before deploying

### Common Tasks

| Task | How |
|------|-----|
| Add a new page | Create `src/pages/newpage.astro` |
| Add an API endpoint | Create `src/pages/api/endpoint.ts` with `export async function GET(...)` |
| Fetch GitHub data | Use frontmatter in `.astro` or API endpoint `.ts` with `fetch()` |
| Style a page | Add `<style>` block in `.astro` or import CSS |
| Add theme toggle | Use `localStorage` + `<script>` in `.astro` to toggle CSS classes |

---

## ⚠️ Common Pitfalls

- **Frontmatter leaks to client:** Don't log secrets in frontmatter; only export what pages need
- **Missing exports:** API endpoints must export `GET`, `POST`, etc.
- **CSS not scoped:** Use `<style>` blocks in `.astro` for automatic scoping, avoid global CSS unless intentional
- **Fetch in components:** Fetch in frontmatter, pass data as props to components

---

## 🔗 Resources

- [Astro Docs](https://docs.astro.build) — Official guides and API reference
- [Astro File-based Routing](https://docs.astro.build/en/basics/astro-pages/) — How routes work
- [Astro API Routes](https://docs.astro.build/en/guides/endpoints/) — Create API endpoints
- [Node.js Adapter](https://docs.astro.build/en/guides/integrations-guide/node/) — Server-side rendering setup
- [Workshop Guide](../workshop/00-overview.md) — Step-by-step learning path (ignore for production work)

---

## 🎯 When to Use This Guide

Use this guidance when:
- ✅ Adding new pages or routes
- ✅ Creating API endpoints for GitHub data
- ✅ Implementing styling or theming
- ✅ Debugging routing or data fetching issues
- ✅ Setting up component layouts

Do **not** apply these instructions to:
- ❌ Workshop documentation (see `/workshop/`)
- ❌ Configuration changes (ignore unless specifically asked about `astro.config.mjs`)
