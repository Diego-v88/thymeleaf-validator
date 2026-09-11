# Thymeleaf Validator Backend

This is the backend service for the Thymeleaf Validator application, powered by **Spring Boot 3.5.x** and **Java 25**.

## Getting Started

1. Compile the application:
   ```bash
   mvn clean package -DskipTests
   ```

2. Run the server:
   ```bash
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

3. Run the test suite:
   ```bash
   mvn test
   ```

## API Endpoints
- `POST /api/template/render` - Renders a template given its HTML and mock variables.
- `POST /api/template/analyze` - Parses a template and extracts variables/links/metrics.
