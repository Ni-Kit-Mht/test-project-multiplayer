# React + TypeScript + Vite
Dependency to run the code is in dependency.txt

After you unzip the test-project-multiplayer
```commands for arch linux
cd test-project-multiplayer
npm install react-hot-toast react-icons
npm install firebase
npm install -g firebase-tools
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @auth0/auth0-react
npm install gh-pages --save-dev
npm run build
npm run dev
```

You might want to configure the `vite.config.ts` file to host it in github pages.
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Match your GitHub repository name
})
```
Add these lines in your package.json file
```json
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://your-user-name.github.io/your-repo-name/"
```
Final commands to deploy to github
```
git init
git add .
git branch -m main
git remote add origin https://github.com/your-username/your-repo-name.git
git commit -m "Prepare for GitHub Pages deployment"
git push origin main

npm run deploy
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
