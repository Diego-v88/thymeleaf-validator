# Thymeleaf Validator Frontend

React-based IDE interface for inspecting and validating Thymeleaf templates.

## Technologies
- React 18
- Vite
- CodeMirror 6 (`@uiw/react-codemirror`, `@codemirror/lang-html`, `@codemirror/theme-one-dark`)
- Vitest & Testing Library

## Key Features
- **CodeMirror 6 Engine**: Frame-perfect line number gutter scrolling across Chrome, Safari, and Firefox.
- **Full-Height Workspace Layout**: Maximize code editor space with split panel and full-screen modes.
- **Tabbed Right Workbench**: Toggle between extracted variables input forms and visual/source HTML render preview.
- **Collapsible Issues Panel**: Interactive badge drawer showing syntax errors and variable validation issues.
- **HTML Export**: Instant download of rendered templates.

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Running Locally
```bash
npm install
npm run dev
```

### Running Tests
```bash
npm test -- --run
```

### Building with Docker
```bash
docker build -t thymeleaf-validator-frontend .
```
