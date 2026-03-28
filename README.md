# Catire Time v1.5.0

A modern, cat-themed news aggregator built with React, TypeScript, and TailwindCSS. Stay informed with the latest news while enjoying adorable feline companions throughout your browsing experience.

<img src="./public/images/app_title_background_cat.svg" alt="Logo" width="200" />

https://www.catiretime.com/

## ✨ Features

- **Comprehensive News Coverage**: World news, lifestyle, science, technology, business, sports, politics, and more
- **Advanced Search**: Find articles with powerful filtering and sorting capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Cat-Themed UI**: Enjoy cute cat loading animations, facts, and imagery
- **User Accounts**: Personalize your news experience
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## 🚀 Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Deployment**: GitHub Pages

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/catire-time.git
cd catire-time
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run cy:open` - Open Cypress E2E test runner (interactive)
- `npm run cy:run` - Run Cypress E2E tests headless
- `npm run deploy` - Deploy to GitHub Pages

## 📁 Project Structure

```
src/
├── api/           # API service functions
├── components/    # Reusable UI components
│   ├── account/   # Account relayed components
│   ├── common/    # Shared components (loading, navigation, etc.)
│   ├── layout/    # Layout components (header, footer, nav)
│   ├── news/      # News-specific components
│   └── search/    # Search and filtering components
├── pages/         # Page components
├── store/         # Redux store and slices
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── constants/     # Application constants
```

## 🧪 Testing

### Unit Tests (Vitest)

Unit and component tests are written with [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). They cover mappers, utilities, services, and component behavior.

```bash
npm run test          # single run
npm run test:watch    # re-run on file changes
```

Test files live in `src/__tests__/` mirroring the source structure:

```
src/__tests__/
├── helpers/       # renderWithProviders (Redux + Router + i18n wrapper)
├── mappers/       # DTO → domain type mapping
├── service/       # articleService, authService, userArticleService, formService, localStorageService
├── utils/         # date, search, sort, text, validation, storage utilities
└── components/
    └── news/
        ├── cards/             # ArticleTitleCard, NewsHeroCard, NewsCard
        └── section/
            └── newsSections/  # HomeNewsSection, CategoryNewsSection, BaseNewsSection
```

### E2E Tests (Cypress)

End-to-end tests use [Cypress](https://www.cypress.io/) to test full user flows in the browser. All API calls are stubbed with fixtures so tests run without a backend.

```bash
npm run cy:open       # interactive Cypress runner (requires dev server running)
npm run cy:run        # headless run in terminal
```

Before running Cypress, start the dev server in a separate terminal:

```bash
npm run dev
```

E2E test files live in `cypress/e2e/`:

| Spec file | Flows covered |
|---|---|
| `home.cy.ts` | Home page load, app title, category bar, article rendering, footer |
| `navigation.cy.ts` | Category navigation, active link highlight, footer links, back button |
| `search.cy.ts` | Search bar expand, query submission, results display, empty search |
| `theme.cy.ts` | Dark mode toggle, light/dark round-trip, persistence across reload |
| `article.cy.ts` | NewsCard expand/collapse, paragraph display, view count increment, detail page |
| `auth.cy.ts` | Login form + validation, register form + password mismatch, logout, session |
| `subscribe.cy.ts` | Newsletter form validation, submit button state, success message |
| `static-pages.cy.ts` | About, Contact, Disclaimer content, 404 page |

**Key architecture decisions:**
- `cy.stubApi()` — Custom command that intercepts every API endpoint with fixture data
- `cy.login()` — Seeds localStorage with auth tokens to simulate a logged-in user
- `cy.waitForApp()` — Waits for initial article + top ten API calls to resolve
- Fixtures in `cypress/fixtures/` provide deterministic API responses

## 🎯 News Categories

- 🗺️ World
- 💼 Business
- 🧬 Science
- 💻 Technology
- ⚽ Sports
- 🏛️ Politics
- 🎭 Lifestyle
- 📚 Other

## 🐈 Cat Features

- **Loading Animations**: Cute cat GIFs during content loading
- **Cat Facts**: Interesting feline trivia in the sidebar
- **Themed Assets**: Cat-inspired icons and illustrations throughout
- **Whimsical Design**: Lighthearted approach to serious news

## Disclaimer

This project works with satirical and AI-generated content created purely for entertainment. The articles and stories are fictionalized and should not be interpreted as factual news or real events. For accurate information, always refer to reputable news sources.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🌐 Live Demo

Visit [https://www.catiretime.com/](https://www.catiretime.com/) to see Catire Time in action!
