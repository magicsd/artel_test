# Frontend Monorepo

This is a modern frontend monorepo built with Nx, React, Tailwind CSS, and shadcn/ui.

## Structure

- `apps/`: Contains the applications:
  - `platform`: The main SPA platform.
  - `telegram`: A Telegram Mini App.
  - `marketing`: The marketing website.
- `packages/`: Contains the shared packages:
  - `ui`: A shared UI library with shadcn/ui components and Tailwind CSS config.
  - `shared`: Shared types, constants, and utilities.
  - `config`: Shared configurations for ESLint, Prettier, etc.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run an application**:
   ```bash
   npx nx serve <app-name>
   ```
   For example, to run the `platform` app:
   ```bash
   npx nx serve platform
   ```

3. **Run Storybook**:
   ```bash
   cd packages/ui && npm run storybook
   ```

4. **Run tests**:
   ```bash
   npx nx test <project-name>
   ```
   For example, to run tests for the `ui` package:
   ```bash
   npx nx test ui
   ```

## Features

- **Nx Monorepo**: For efficient code sharing and management.
- **React**: For building user interfaces.
- **Tailwind CSS**: For styling.
- **shadcn/ui**: For a set of accessible and customizable UI components.
- **i18next**: For internationalization.
- **Vitest & Testing Library**: For testing.
- **Storybook**: For UI component development and documentation.
- **ESLint & Prettier**: For code quality and formatting.
- **Husky & lint-staged**: For pre-commit hooks.
