# React + Vite

## Database setup

The API uses MySQL. Copy `.env.example` to `.env`, set the MySQL credentials, and run:

```bash
npm run db:setup
npm run server
```

`db:setup` creates the `educheck` database and all tables, then seeds the Math subject, its five topics, the admin account, and the questions from `src/data/questions.json`. It is safe to run again; existing questions are skipped.

The default admin account is `admin@educheck.com` with password `admin123`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
