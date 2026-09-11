# Thymeleaf Validator

Thymeleaf Validator is a full-stack application designed to write, validate, analyze, and render Thymeleaf templates in real-time.

## Features
- **Real-Time Editor**: Syntax-highlighted template editing using CodeMirror 6 with accurate line numbers and modern scrolling.
- **Live Preview & Render**: Immediate HTML rendering to visualize how templates resolve with mock variables.
- **Code Analysis**: Built-in metrics and checks (accessibility, broken links, typography, and Thymeleaf structure).
- **Responsive Viewports**: Preview your generated templates in Desktop, Tablet, and Mobile sizes.
- **i18n**: Fully translated UI in English and Spanish.

## Project Structure

This project is divided into two main applications:
- **`frontend/`**: A React application built with Vite, Tailwind CSS, and CodeMirror.
- **`backend/`**: A Java 25 & Spring Boot 3.5.x backend that provides the Thymeleaf engine and REST APIs.

## Running with Docker Compose

You can spin up both the frontend and backend simultaneously using Docker Compose.

```bash
# Build and start the containers
docker-compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## Manual Setup

If you prefer to run the applications locally without Docker:

### Backend
Make sure you have **Java 25** and **Maven** installed.
```bash
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
Make sure you have **Node.js** (v18+) installed.
```bash
cd frontend
npm install
npm run dev
```

## Testing

Both applications have extensive test suites.

- **Backend**: `cd backend && mvn test`
- **Frontend**: `cd frontend && npm run test`
