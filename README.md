# 🚀 SnippetVault — Developer Snippet Vault & AI Publisher

SnippetVault is a full-stack web application that helps developers store, organize, manage, and retrieve code snippets in one place. It integrates Google's Gemini AI to generate meaningful summaries and relevant tags, making code easier to understand and organize.

The application combines secure authentication, personal snippet management, syntax highlighting, and a modern user interface to improve the developer experience.

## 🌐 Live Demo

* **Frontend:** https://snippetvault-sand.vercel.app/
* **Backend:** https://snippetvault-ljrm.onrender.com
* **GitHub Repository:** https://github.com/sanju653/SnippetVault

## 🌟 Features

### 🔐 1. Authentication & Security

* **User Registration:** Create an account using a name, email, and password.
* **User Login:** Authenticate using registered credentials.
* **Google OAuth 2.0:** Sign in using a Google account.
* **GitHub OAuth 2.0:** Sign in using a GitHub account.
* **JWT Authentication:** Secure API requests using JSON Web Tokens.
* **Access Tokens:** Authenticate users when accessing protected resources.
* **Refresh Tokens:** Obtain a new access token without requiring the user to log in again.
* **Password Hashing:** Protect passwords using BCrypt.
* **Protected Routes:** Restrict access to authenticated users.
* **Logout:** Clear the authentication state and handle logout.
* **User-Specific Data:** Associate snippets with their respective users.

### 📝 2. Snippet Management

* **Create Snippets:** Save snippets with a title, programming language, and code content.
* **View Snippets:** Browse saved snippets.
* **Snippet Details:** Open an individual snippet to view its content and metadata.
* **Edit Snippets:** Update existing snippet information and code.
* **Delete Snippets:** Remove unwanted snippets with a confirmation dialog.
* **Programming Language Selection:** Associate snippets with their respective programming languages.
* **Snippet Metadata:** Display information such as creation and update timestamps.
* **Personal Snippet Library:** Manage your saved snippets.

### 🤖 3. AI-Powered Features

SnippetVault integrates Google's Gemini AI to help developers understand and organize their code.

* **AI-Generated Summaries:** Generate plain-English summaries of code snippets.
* **Automatic Tag Generation:** Generate relevant tags to categorize snippets.
* **Improved Organization:** Use summaries and tags to make snippets easier to understand and organize.
* **On-Demand AI Generation:** Generate AI content for an individual snippet through a dedicated backend endpoint.

### 💻 4. Code Presentation

* **Syntax Highlighting:** Display code with language-aware formatting for improved readability.
* **Multiple Programming Languages:** Associate snippets with languages such as Java, JavaScript, Python, and other supported languages.
* **Readable Code Display:** Present code in a dedicated code-viewing interface.
* **Snippet Details Page:** Display the title, language, code, summary, tags, and available metadata.

### 📊 5. Dashboard

* View the dashboard after authentication.
* Navigate through the application's main sections.
* Access snippet creation and browsing pages.
* View snippet cards and related information.
* Use the sidebar and navigation bar to navigate through the application.

### 🎨 6. User Interface

* Modern dashboard layout.
* Dark sidebar with active navigation states.
* Navigation bar for application access.
* Reusable snippet card components.
* Dedicated pages for creating, viewing, editing, and deleting snippets.
* Login and registration pages.
* Delete confirmation modal.
* React Router-based navigation.
* Bootstrap styling and Bootstrap Icons.

### 🌐 7. Deployment

* **Frontend:** Deployed on Vercel.
* **Backend:** Deployed on Render.
* **Database:** MySQL hosted on Aiven.
* **Cross-Origin Resource Sharing (CORS):** Configured to allow communication between the frontend and backend.
* **Environment Variables:** Used to configure sensitive credentials and deployment-specific settings.

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                                            |
| --------------- | -------------------------------------------------- |
| React           | Building the user interface                        |
| Vite            | Frontend development server and build tool         |
| JavaScript      | Frontend application logic                         |
| HTML5           | Application structure                              |
| CSS3            | Styling and layout                                 |
| Bootstrap       | UI styling                                         |
| Bootstrap Icons | Interface icons                                    |
| React Router    | Client-side routing                                |
| Axios           | HTTP requests to the backend                       |
| Zustand         | Global authentication state management             |
| Zustand Persist | Persisting authentication state in browser storage |

### Backend

| Technology           | Purpose                                  |
| -------------------- | ---------------------------------------- |
| Java                 | Backend programming language             |
| Spring Boot          | Backend application framework            |
| Spring Web           | REST API development                     |
| Spring Security      | Application security                     |
| Spring Data JPA      | Database operations                      |
| Hibernate            | Object-relational mapping                |
| Spring OAuth2 Client | Google and GitHub authentication         |
| JWT                  | Token-based authentication               |
| BCrypt               | Password hashing                         |
| Maven                | Dependency management and project builds |

### Database

| Technology | Purpose               |
| ---------- | --------------------- |
| MySQL      | Relational database   |
| Aiven      | Managed MySQL hosting |

### AI Integration

| Technology        | Purpose                                 |
| ----------------- | --------------------------------------- |
| Google Gemini API | AI-generated snippet summaries and tags |

### Deployment & Development Tools

| Tool               | Purpose              |
| ------------------ | -------------------- |
| Git                | Version control      |
| GitHub             | Source code hosting  |
| IntelliJ IDEA      | Backend development  |
| Visual Studio Code | Frontend development |
| Postman            | API testing          |
| Render             | Backend deployment   |
| Vercel             | Frontend deployment  |
| DBeaver            | Database management  |

---

## 🏗️ Application Architecture

SnippetVault follows a frontend-backend architecture.

```text
                       Developer
                           |
                           v
                  +-------------------+
                  |   React Frontend  |
                  |                   |
                  | Vite              |
                  | Bootstrap         |
                  | React Router      |
                  | Axios             |
                  | Zustand           |
                  +---------+---------+
                            |
                       HTTP / REST
                            |
                            v
                  +-------------------+
                  |  Spring Boot API  |
                  |                   |
                  | Spring Security   |
                  | JWT Authentication|
                  | REST Controllers  |
                  | Business Logic    |
                  | Spring Data JPA   |
                  +---------+---------+
                            |
                  +---------+---------+
                  |                   |
                  v                   v
          +---------------+   +---------------+
          | MySQL Database|   |  Gemini API   |
          |               |   |               |
          | Users         |   | AI Summaries  |
          | Snippets      |   | AI Tags       |
          +---------------+   +---------------+
```

### How It Works

1. The user interacts with the React frontend.
2. Axios sends HTTP requests to the Spring Boot backend.
3. Spring Security and JWT handle authentication and authorization.
4. The backend processes requests and communicates with MySQL through Spring Data JPA.
5. The Gemini API generates summaries and tags when AI generation is requested.
6. The backend returns responses to the frontend.
7. React updates the interface with the retrieved or generated information.

---

## 📂 Project Structure

The project contains separate frontend and backend applications.

```text
SnippetVault/
|
+-- snippet_vault/                  # Spring Boot Backend
|   |
|   +-- src/
|   |   |
|   |   +-- main/
|   |       |
|   |       +-- java/
|   |       |   |
|   |       |   +-- com/snippet/snippet_vault/
|   |       |       |
|   |       |       +-- config/
|   |       |       +-- controller/
|   |       |       +-- dto/
|   |       |       +-- entity/
|   |       |       +-- exception/
|   |       |       +-- repository/
|   |       |       +-- security/
|   |       |       +-- service/
|   |       |       +-- SnippetVaultApplication.java
|   |       |
|   |       +-- resources/
|   |           +-- application.properties
|   |
|   +-- pom.xml
|
+-- snippet_fronted/                # React + Vite Frontend
|   |
|   +-- src/
|   |   |
|   |   +-- components/
|   |   |   +-- Sidebar.jsx
|   |   |   +-- Navbar.jsx
|   |   |   +-- Snippetcard.jsx
|   |   |   +-- ...
|   |   |
|   |   +-- pages/
|   |   |   +-- Dashboard.jsx
|   |   |   +-- CreateSnippet.jsx
|   |   |   +-- AllSnippets.jsx
|   |   |   +-- SnippetDetails.jsx
|   |   |   +-- EditSnippet.jsx
|   |   |   +-- Login.jsx
|   |   |   +-- Register.jsx
|   |   |   +-- ...
|   |   |
|   |   +-- services/
|   |   +-- store/
|   |   |   +-- authStore.js
|   |   |
|   |   +-- App.jsx
|   |
|   +-- package.json
|
+-- README.md
```

*Note: This is an illustrative structure. Actual package names and file locations may differ slightly from the final implementation.*

---

## 🔑 Authentication Flow

SnippetVault uses JWT-based authentication for protected API requests.

### Login Flow

1. The user enters their email and password.
2. The frontend sends the credentials to the backend.
3. The backend validates the credentials.
4. The backend generates access and refresh tokens.
5. The frontend stores the authentication state using Zustand Persist.
6. Axios attaches the access token to authenticated API requests.

### Refresh Token Flow

1. A protected API request receives an unauthorized response because the access token has expired.
2. The Axios response interceptor detects the authentication failure.
3. The frontend attempts to obtain a new access token using the refresh token.
4. If successful, the original request can be retried with the new access token.
5. If refreshing fails, the application can clear the authentication state and require the user to sign in again.

### OAuth2 Flow

Users can authenticate through Google or GitHub.

Spring Security handles the OAuth2 authentication process and integrates the authenticated user with the application's authentication flow.

---

## 🔌 API Endpoints

The backend exposes REST endpoints for authentication and snippet management.

### Authentication APIs

**Base path:** `/api/auth`

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/auth/register` | Register a new user                  |
| POST   | `/api/auth/login`    | Authenticate with email and password |
| POST   | `/api/auth/refresh`  | Refresh the access token             |
| POST   | `/api/auth/logout`   | Handle logout                        |

### Snippet APIs

**Base path:** `/api/snippets`

| Method | Endpoint                         | Description                       |
| ------ | -------------------------------- | --------------------------------- |
| GET    | `/api/snippets`                  | Retrieve snippets                 |
| POST   | `/api/snippets`                  | Create a snippet                  |
| GET    | `/api/snippets/{id}`             | Retrieve a specific snippet       |
| PUT    | `/api/snippets/{id}`             | Update a snippet                  |
| DELETE | `/api/snippets/{id}`             | Delete a snippet                  |
| POST   | `/api/snippets/{id}/generate-ai` | Generate AI content for a snippet |

**Note:** Verify these endpoints against your actual controllers before publishing. The table describes the expected routes and does not replace the implementation.

---

## 🗄️ Database Design

SnippetVault uses MySQL to store application data.

### Users

The user entity stores account information.

Typical fields include:

* `id` — Unique user identifier.
* `name` — User's name.
* `email` — Unique email address.
* `password` — Hashed password for password-based authentication.
* `role` — User role.
* `createdAt` — Account creation timestamp.

### Snippets

The snippet entity stores code snippets and associated metadata.

Typical fields include:

* `id` — Unique snippet identifier.
* `title` — Snippet title.
* `codeContent` — Code stored in the snippet.
* `language` — Programming language.
* `summary` — Snippet summary.
* `tags` — Tags associated with the snippet.
* `createdAt` — Snippet creation timestamp.
* `updatedAt` — Last update timestamp.
* `user` — Relationship to the snippet owner.

Each snippet should be associated with its owner, allowing the backend to enforce appropriate access controls when retrieving, modifying, or deleting data.

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

Install the following:

* Java Development Kit (JDK).
* Maven.
* Node.js and npm.
* MySQL database or access to a configured MySQL instance.
* Git.

Credentials for the external services you want to use, including Google OAuth2, GitHub OAuth2, and Gemini AI, may also be required.

### 1. Clone the Repository

```bash
git clone https://github.com/sanju653/SnippetVault.git
cd SnippetVault
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd snippet_vault
```

Configure the database connection and required secrets through environment variables or your local Spring Boot configuration.

Example configuration:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}

spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}

spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}
```

Configure the Gemini API key using the property expected by your AI service.

**Important:** These are illustrative examples. Use the property names expected by your existing application configuration and service classes.

### 3. Run the Backend

From the backend directory, run:

```bash
mvn spring-boot:run
```

The backend will start on the configured port, typically `8080` during local development.

### 4. Configure the Frontend

Open a second terminal and navigate to the frontend directory from the project root:

```bash
cd snippet_fronted
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the frontend root directory.

Example:

```env
VITE_API_URL=http://localhost:8080/api
```

Make sure this value matches the base URL expected by your Axios configuration.

### 5. Start the Frontend

Run:

```bash
npm run dev
```

Open the local address printed by Vite in the terminal, typically:

```text
http://localhost:5173
```

The application should now be accessible locally, provided the backend, database, and required configuration are available.

---

## 🌍 Production Deployment

SnippetVault uses separate deployment platforms for its frontend, backend, and database.

| Component | Platform    |
| --------- | ----------- |
| Frontend  | Vercel      |
| Backend   | Render      |
| Database  | Aiven MySQL |

### Deployment Configuration

1. Deploy the frontend to Vercel.
2. Deploy the Spring Boot backend to Render.
3. Configure the MySQL connection using the database provider's credentials.
4. Set the required environment variables in the backend deployment.
5. Configure the frontend API URL to point to the deployed backend.
6. Configure CORS to allow requests from the deployed frontend domain.
7. Configure Google and GitHub OAuth2 redirect URIs for the deployed backend.
8. Configure the Gemini API key and JWT secret securely.

### Live Links

* **Frontend:** https://snippetvault-sand.vercel.app/
* **Backend:** https://snippetvault-ljrm.onrender.com
* **Source Code:** https://github.com/sanju653/SnippetVault

---

## 🔒 Security Practices

* Passwords are hashed using BCrypt rather than stored as plain text.
* Protected endpoints require appropriate authentication.
* JWT tokens authenticate API requests.
* Snippet ownership should be verified before allowing access, updates, or deletion.
* Sensitive configuration values should be supplied through environment variables.
* OAuth2 credentials and API keys should never be committed to a public repository.
* CORS should allow only the frontend origins required by the application.
* Database credentials should not be exposed in frontend code.
* Token storage and refresh behavior should be configured carefully to reduce security risks.

---


## 🎯 Project Objective

The objective of SnippetVault is to build a practical full-stack application that combines secure authentication, REST API development, database management, frontend state management, and AI integration.

The project demonstrates how modern web technologies can work together to create a developer-focused application.

---

## 👩‍💻 Author

**Developed as a Full Stack Development Internship Project**

**Technologies:** Java, Spring Boot, React, MySQL, JWT, OAuth2, and Google Gemini AI.

---
