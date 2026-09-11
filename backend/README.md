# Thymeleaf Validator Backend

Backend API for validating and rendering Thymeleaf templates.

## Technologies
- Java 25
- Spring Boot 3.2.4
- Maven
- Lombok

## Getting Started

### Prerequisites
- JDK 25
- Maven 3.9+

### Running Locally
```bash
mvn spring-boot:run
```

### Running Tests
```bash
mvn test
```

### Building with Docker
```bash
docker build -t thymeleaf-validator-backend .
```

## API Endpoints
- `POST /api/analyze`: Analyzes a template to find variables and syntax errors.
- `POST /api/render`: Renders a template with provided data.
