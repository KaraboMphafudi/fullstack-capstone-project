# GiftLink Application - User Stories

## Project Overview
GiftLink is a full-stack web application for sharing household items. This document outlines the user stories that drive the development and deployment of the application.

## User Roles
1. **Guest User**: Can view available gifts
2. **Registered User**: Can view, search, and interact with gifts
3. **Administrator**: Can manage gifts and users

## User Stories

### 1. View Available Gifts
**As a** user,  
**I want to** view a list of available gifts on the homepage,  
**So that** I can see what items are available.

**Acceptance Criteria:**
- Gifts are displayed with name, description, price, and category
- Gifts are fetched from the backend API
- Loading state is shown while fetching

### 2. Search for Gifts
**As a** user,  
**I want to** search for gifts by category,  
**So that** I can find specific items I'm interested in.

**Acceptance Criteria:**
- Search bar is available on the main page
- Results filter by category
- Results update dynamically

### 3. Register for an Account
**As a** user,  
**I want to** register for an account,  
**So that** I can access personalized features.

**Acceptance Criteria:**
- Registration form with name, email, and password
- Form validation
- Successful registration redirects to login

### 4. Log In to Account
**As a** user,  
**I want to** log in to my account,  
**So that** I can access my profile and saved items.

**Acceptance Criteria:**
- Login form with email and password
- Authentication with JWT tokens
- User session persists across pages

### 5. View Gift Details
**As a** user,  
**I want to** click on a gift to view its details,  
**So that** I can learn more about the item.

**Acceptance Criteria:**
- Details page shows full gift information
- Related gifts are displayed
- Navigation back to main page

### 6. Containerize the Application
**As a** developer,  
**I want to** containerize the application using Docker,  
**So that** it can be deployed consistently across environments.

**Acceptance Criteria:**
- Dockerfiles created for backend and frontend
- Images build successfully
- Containers run locally

### 7. Deploy to Kubernetes
**As a** developer,  
**I want to** deploy the application to Kubernetes,  
**So that** it can scale and be managed efficiently.

**Acceptance Criteria:**
- Kubernetes deployment files created
- MongoDB deployment running
- Backend service running
- Frontend service running

### 8. CI/CD Pipeline with GitHub Actions
**As a** developer,  
**I want to** have a CI/CD pipeline,  
**So that** code is automatically linted and tested.

**Acceptance Criteria:**
- GitHub Actions workflow configured
- Linting runs on every push
- Build runs on every push

## Technical Stack

### Frontend
- React.js
- React Router
- Bootstrap for styling

### Backend
- Node.js with Express
- MongoDB
- JWT Authentication

### DevOps
- Docker
- Kubernetes
- GitHub Actions
- IBM Code Engine

## Deployment URLs

### Local Development
- Frontend: http://localhost:9000
- Backend: http://localhost:3060

### Containerized
- Docker Image: us.icr.io/sn-labs-karaboekfm/giftwebsite:latest

### Kubernetes
- Deployment: giftapp
- Service: giftapp-service
- MongoDB: mongodb

## Completed Tasks

✅ Frontend development
✅ Backend API development
✅ MongoDB integration
✅ Docker containerization
✅ Kubernetes deployment files
✅ GitHub Actions CI/CD
✅ Code Engine project setup
✅ Application testing

## Authors
- Karabo Mphafudi

## License
Apache 2.0
