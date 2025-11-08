# E-Commerce Application

## Prerequisites
- Java JDK 21+
- Node.js 18+ & npm
- Git
- OpenVPN

## Setup Instructions

### 1. Clone Repository
```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Backend Setup
```bash
cd backend
mvnw clean install
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Database Configuration
Create `backend/src/main/resources/application-local.properties`:
```properties
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Tech Stack
- Backend: Spring Boot 3.5.7, Java 21, Oracle 11g
- Frontend: React 19, JavaScript