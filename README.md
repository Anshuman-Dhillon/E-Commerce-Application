# E-Commerce Application

A full-stack 3D model marketplace where creators can upload and sell 3D models, and buyers can browse, purchase, and download digital assets.

![E-Commerce Application Screenshot](./screenshot.png)

## 📹 Demo Video
[Watch the demo on YouTube](https://www.youtube.com/your-video-link)

It started out as an group academic project for one of my courses, but then I extended it further to turn it into a proper full-stack application. Connected to AWS S3 for cloud storage (the 3D models and thumbnails) and Oracle SQL Developer for data storage.

Credits to my teammates for their initial work on this, and poly.pizza for the 3D models.

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

This will connect to the university's oracle database. Make sure you use your CS username and password (same as what you'd use when opening Oracle SQL Developer). OpenVPN must be ON for the connection to be established.

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

## Default Test Credentials
- Test Card: 4242 4242 4242 4242
- Any future expiry date and 3-digit CVV

## Tech Stack
- Backend: Spring Boot 3.5.7, Java 21, Oracle 11g
- Frontend: React 19, JavaScript
