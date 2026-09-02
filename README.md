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
| **Unit Testing** | Jest + jest-preset-angular — 100% statements, branches, functions and lines |
| **Contact Form** | Formspree (HTTP API) |
| **Internationalization** | Custom i18n service (EN / ES) |
| **CI/CD** | GitHub Actions → GitHub Pages |

---

## 🤖 ManIA — Contextual Virtual Assistant

ManIA is the portfolio's built-in assistant (`mania-chat` widget). It answers visitor questions about Manuel Alba's professional career — experience, stack, projects, education and contact — entirely in the browser.

### Architecture

- **100% client-side engine** — no paid APIs, no backend, no network calls required. `ManiaChatService` resolves every answer locally from `MANUEL_CV_DATA` (`src/app/core/data/cv-data.ts`), a fully bilingual structured CV (every text is `{ es, en }`).
- **Probabilistic response engine** — answers are assembled from intent-specific templates plus randomized relevant facts, so the same question never reads identically twice.
- **Intent detection without rigid regex** — tokenization with accent normalization + flexible stem matching against the CV vocabulary (aliases, stack, companies, technologies).
- **Strict off-topic guardrail** — queries unrelated to Manuel's career ("jokes", "recipes", "weather", …) always return a formal scope response, in the active language.
- **Bilingual follow-up context** — short continuity queries ("¿y actualmente?", "what else?", "cuéntame más") are recognized when a conversation is already active and answered with facts not shown before (legacy refactors, Jest testing, architecture, Angular certification).
- **Simulated latency** — a 1s response delay drives the typing indicator; an optional LLM API path (behind `MANIA_API_KEY`) degrades gracefully to the local engine.

### UX Details

- **Hold-to-Reset** — the trash button requires a 1.5s press (mouse or touch) with an animated SVG progress ring (`stroke-dashoffset`); releasing early cancels safely, and quick clicks show a "Hold to reset / Mantén pulsado para reiniciar" hint.
- **Auto-scroll** — the message canvas always scrolls to the latest message or typing indicator via a Signals-driven `effect`.
- **Custom dark scrollbar** — thin gradient cyan/blue thumb, consistent across browsers and scroll containers.

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

> 💬 Try the assistant: open the chat bubble (bottom-left corner) and ask in English or Spanish about Angular experience, Jest testing, the stack, projects, education or contact details.

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
