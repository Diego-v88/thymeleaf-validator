# Thymeleaf Validator

Thymeleaf Validator es una aplicación web full-stack diseñada para analizar, interactuar y visualizar templates creados con la sintaxis de **Thymeleaf**, facilitando así la prueba de vistas sin necesidad de inicializar todo el ecosistema de una aplicación grande.

## Arquitectura y Técnicas de Diseño
El proyecto divide claramente las responsabilidades utilizando las mejores prácticas de la industria:
- **Backend (Spring Boot + Maven)**: Basado en una Arquitectura Hexagonal. Aísla completamente la lógica de validación/detección (`application/service`) y el dominio purista (`domain/model`, `domain/port`) de la forma real en la que el usuario interactúa (Interfaces REST en `infrastructure/rest`) y el procesador de templates (Adaptador `ThymeleafEngineAdapter`). Esto permite alta cohesividad e inmutabilidad, haciendo uso exhaustivo de `records` de Java.
- **Frontend (React + Vite)**: Aplicación monorepo cliente. Utiliza CSS moderno con esquemas oscuros (`dark mode by default`), y separa el árbol de componentes (Editor, Formulario Inyectado Dinámicamente, y Visualizador) para un manejo eficiente de estados de React.

## Estructura
```text
thymeleaf-validator/
├── backend/                  
│   ├── src/main/java/com/thymeleafvalidator/
│   │   ├── domain/           (Models inmutables y Puertos/Interfaces)
│   │   ├── application/      (Casos de uso: Analizador y Renderizador)
│   │   ├── infrastructure/   (Adaptadores de Entrada: Controllers REST y Manejo de Errores)
│   │   │                     (Adaptadores de Salida: ThymeleafEngine Adapter)
│   ├── pom.xml
├── frontend/                 
│   ├── src/
│   │   ├── components/       (Componentes UI reutilizables)
│   │   ├── services/         (Facade API Client)
│   │   ├── App.jsx           (Orquestador Principal)
```

## Ejecución del Proyecto

### Backend
1. Navega a la carpeta `/backend`:
   ```bash
   cd backend
   ```
2. Inicia la aplicación Spring Boot (Se desplegará en el puerto 8080):
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Si el puerto 8080 en tu máquina está ocupado, modifica `application.properties`)*

### Frontend
1. Abre una nueva terminal y navega a `/frontend`.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
4. Ingresa a `http://localhost:5173` en tu navegador.

## Tests (Resultados de Ejecución)
El backend cuenta con pruebas de los Casos de Uso (`TemplateAnalyzerServiceTest`) probando detección de variables y cierre de etiquetas, y tests de integración simulando requests HTTP a los Controladores (con `MockMvc`).

**Resultado de la ejecución local (`mvn test`):**
```text
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.467 s -- in com.thymeleafvalidator.infrastructure.rest.TemplateControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time:  17.265 s
```
