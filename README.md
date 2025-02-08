# Project Setup Guide

This guide will help you set up and run the application on your local machine. The project consists of three folders:
- `frontend` (React application)
- `backend` (Go API server)
- `mongoDb` (MongoDB setup with Node.js)

## Prerequisites
Make sure you have the following installed on your system:
- [Go](https://go.dev/dl/) (Latest stable version)
- [Node.js](https://nodejs.org/) (For MongoDB setup)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/) (or npm)

## Clone the Repository
```sh
git clone <your-repository-url>
cd <your-project-folder>
```

## Setting up MongoDB
1. Navigate to the `mongoDb` folder:
   ```sh
   cd mongoDb
   ```
2. Install dependencies:
   ```sh
   yarn install  # or npm install
   ```
3. Start the MongoDB service locally.
4. Make sure MongoDB is running on the default port (`27017`).

## Setting up the Backend
1. Navigate to the `backend` folder:
   ```sh
   cd ../backend
   ```
2. Install dependencies:
   ```sh
   go mod tidy
   ```
3. Create a `.env` file and configure environment variables (update values as needed):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/your_database_name
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the backend server:
   ```sh
   go run main.go
   ```
   The backend will run on `http://localhost:5000/`.

## Setting up the Frontend
1. Navigate to the `frontend` folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   yarn install  # or npm install
   ```
3. Create a `.env` file for frontend settings:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the frontend server:
   ```sh
   yarn dev  # or npm run dev
   ```
   The frontend will run on `http://localhost:5173/` (or the default Vite port).

## Running the Application
Once all services are running, open your browser and visit:
```sh
http://localhost:5173/
```
Your application should now be up and running!

## Troubleshooting
- **Backend not connecting to MongoDB?** Check if MongoDB is running and that the `MONGO_URI` in `.env` is correct.
- **Frontend not fetching data?** Ensure the backend is running and CORS is correctly configured.
- **Port conflicts?** Change the default ports in the `.env` files if needed.

## Contributing
Feel free to open a pull request if you find any issues or improvements!

---
Happy coding! 🚀

