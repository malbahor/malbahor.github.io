<div align="center">

# Portfolio — Manuel Alba Hornillo

**Senior Frontend Engineer Portfolio**

A high-performance Angular application showcasing professional experience, featured projects, and a working contact form — crafted with modern Angular architecture and a data-driven, i18n-first approach.

</div>

---

## 🚀 Project Overview

A modern single-page application built with **Angular 19** that balances clean architecture with tangible performance. The codebase leverages **Standalone Components** and **Signals** for fine-grained reactivity and predictable state, while **RxJS** powers asynchronous flows. All content lives in **per-locale JSON files** (EN/ES) consumed through a dedicated `TranslationService`, keeping components lean and fully data-driven.

---

## 🧰 Tech Stack

| Area | Technology |
| ---- | ---------- |
| **Language** | TypeScript (strict mode) |
| **Framework** | Angular 19+ (Standalone Components, Signals, RxJS) |
| **Styling** | Tailwind CSS 4 |
| **Unit Testing** | Jest + jest-preset-angular |
| **Contact Form** | Formspree (HTTP API) |
| **Internationalization** | Custom i18n service (EN / ES) |
| **CI/CD** | GitHub Actions → GitHub Pages |

---

## ✨ Key Features

- **Responsive Design** — mobile-first layout across all breakpoints.
- **High Test Coverage** — **100% statements, branches, functions, and lines** with Jest.
- **Dynamic Language Switcher** — instant EN/ES toggle with persisted preference.
- **Accessible UI/UX** — semantic markup, keyboard-friendly navigation, and ARIA labels.
- **Fast Loading Times** — optimized bundles, SSR/prerendering enabled, lazy-friendly architecture.
- **Real Contact Form** — validated client-side and submitted to Formspree with loading/error/success feedback.

---

## 🚦 Getting Started & Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/malbahor/malbahor.github.io.git
cd portfolio-malbahor
npm install
```

Run the development server:

```bash
npm start
```

Open `http://localhost:4200/` — the app auto-reloads on source changes.

Run the test suite **with coverage report**:

```bash
npm run test:coverage
```

---

## 🧪 Testing & Quality

Unit tests are executed with **Jest** and `jest-preset-angular`, running in a Node-based jsdom environment (no browser required). A **100% unit test coverage target is achieved**, enforced across components, services, and logic:

```bash
npm test            # Run tests once
npm run test:coverage  # Run tests and print coverage table
```

---

## 🌍 Deployment

Deployment is **automated via CI/CD**. Pushing to the `main` branch triggers the `deploy.yml` workflow, which:

1. Checks out the repository with Node.js 20.
2. Installs dependencies with `npm ci`.
3. Builds the production bundle.
4. Uploads `dist/portfolio-malbahor/browser` as a GitHub Pages artifact.
5. Deploys to GitHub Pages automatically.

---

## 📄 License

MIT
