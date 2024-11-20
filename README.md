

# Groupomania


---

## **Table of Contents**
- [Introduction](#introduction)
- [Environment Setup](#environment-setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [File Structure](#file-structure)
- [How to Run](#how-to-run)
- [GitHub Repository](#github-repository)

---

## **Introduction**
This project is a full-stack application built with **React** (Frontend) and **Node.js** with **Sequelize** (Backend). It includes features like user authentication, content management, posts, and account management. This guide explains how to set up the project environment on your local machine.

---

## **Environment Setup**

### **Frontend Setup**
1. Install Node.js:
   Download and install Node.js from the [official site](https://nodejs.org/).

2. Navigate to the Frontend Directory:
   ```
   cd front
   ```

3. Install Dependencies:
   Run the following command to install all required dependencies:
   ```
   npm install
   ```
   To install individual dependencies, use:
   ```
   npm install react react-dom react-scripts axios
   ```

4. Create `.env` File:
   Create a `.env` file in the `front` directory with the following content:
   ```
   PORT=3000
   ```

---

### **Backend Setup**
1. Install Node.js:
   Ensure Node.js is installed on your system.

2. Navigate to the Backend Directory:
   ```
   cd back
   ```

3. Install Dependencies:
   Run the following command to install all required dependencies:
   ```
   npm install
   ```
   To install individual dependencies, use the following commands:
   ```
   npm install express
   npm install sequelize
   npm install mysql2
   npm install jsonwebtoken
   npm install bcryptjs
   npm install dotenv
   npm install multer
   ```

4. Create `.env` File:
   Use the `env-sample` file in the `back` directory as a template. Create an `.env` file with the following parameters:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. Folder Creation:
   Create folders to store backend assets:
   ```
   mkdir back/images
   mkdir back/avatars
   ```

---

## **Environment Variables**
### **Frontend**:
```
PORT=3000
```

### **Backend**:
```
DB_HOST=Hostname of your database server
DB_USER=Username for database access
DB_PASSWORD=Password for database access
DB_NAME=Name of the database
JWT_SECRET=Secret key for JWT authentication
PORT=Port number for backend server
```

---

## **File Structure**

### **Frontend**:
```
front/
  ├── src/
      ├── components/
```

### **Backend**:
```
back/
  ├── images/         # Folder to store uploaded images
  ├── avatars/        # Folder to store avatar images
  ├── routes/         # API routes
  ├── controllers/    # Business logic
  ├── models/         # Sequelize models
```

---

## **How to Run**

1. Start Backend:
   Navigate to the `back` directory:
   ```
   cd back
   ```
   Start the backend server:
   ```
   npm start
   ```

2. Start Frontend:
   Navigate to the `front` directory:
   ```
   cd front
   ```
   Start the frontend development server:
   ```
   npm start
   ```

3. Verify Application:
   The application should now be running at `http://localhost:3000`.

---

## **GitHub Repository**
[Project Repository]
