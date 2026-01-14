# InfoCenter AI - University Chatbot System

This project is a university chatbot system consisting of a React frontend and a Spring Boot backend.

## Installation and Run

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18+ recommended) & **npm**
- **Java JDK** (v17 or higher)
- **PostgreSQL** database server

### 1. Database Setup

1. Open your PostgreSQL client (e.g., pgAdmin or terminal).
2. Create a new database named `infocenter_db`.
3. Locate the `database commands.txt` file in the root directory.
4. Run the SQL commands from this file to initialize the tables and schema. 
   *(Note: The backend is configured to update the schema automatically (`spring.jpa.hibernate.ddl-auto=update`), but running the script ensures all constraints are set up correctly.)*

### 2. Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd universitychatbot
   ```

2. Configure the database connection if necessary:
   - Open `src/main/resources/application.properties`.
   - Update the following lines to match your local PostgreSQL credentials:
     ```properties
     spring.datasource.username=your_username  # Default currently: postgres
     spring.datasource.password=your_password  # Default currently: !Alexandra2805
     ```

3. Run the application using the Maven wrapper:
   - **Windows**:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **Linux/Mac**:
     ```bash
     ./mvnw spring-boot:run
     ```

4. The backend server will start on `http://localhost:8080`.

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd infocenter-ai
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application will be available at the URL shown in the terminal (usually `http://localhost:5173`).

---

## Folder Structure

- **infocenter-ai/**: Frontend source code (React, Vite).
- **universitychatbot/**: Backend source code (Spring Boot).
- **...txt files**: Documentation and database specifications.
