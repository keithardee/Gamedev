# Gamedev

This guide sets up your project in the existing `Gamedev` root folder, with a separated frontend and backend:

- `frontend` -> React (JavaScript)
- `backend` -> Node.js + Express

## 1. Prerequisites

Install these first:

- Node.js LTS (includes npm): https://nodejs.org/
- Git (optional): https://git-scm.com/

Check versions in PowerShell:

```powershell
node -v
npm -v
```

## 2. Use Your Existing Root Folder

You already have:

```text
Gamedev/
```

Open terminal in this folder:

```powershell
cd "c:\Users\Keane\Desktop\Git Uploads\Gamedev"
```

Everything below will be created inside this root.

## 3. Create Frontend (React JavaScript)

Create a React app using Vite in a folder named `frontend`:

```powershell
npm create vite@latest frontend -- --template react
```

Install dependencies:

```powershell
cd frontend
npm install
```

Run frontend dev server:

```powershell
npm run dev
```

By default, Vite usually runs at:

```text
http://localhost:5173
```

Go back to root:

```powershell
cd ..
```

## 4. Create Backend Folder

Create backend project folder and initialize Node:

```powershell
mkdir backend
cd backend
npm init -y
```

Install Express and CORS:

```powershell
npm install express cors
```

Create `backend/server.js` with:

```js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
	res.json({ message: "Backend is running" });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
```

Run backend:

```powershell
node server.js
```

Test backend endpoint in browser:

```text
http://localhost:5000/api/health
```

## 5. Final Folder Structure

After setup, your root folder should look like this:

```text
Gamedev/
	README.md
	frontend/
		package.json
		src/
		...
	backend/
		package.json
		server.js
		...
```

## 6. Run Frontend and Backend Together

Open two terminals:

Terminal 1:

```powershell
cd "c:\Users\Keane\Desktop\Git Uploads\Gamedev\frontend"
npm run dev
```

Terminal 2:

```powershell
cd "c:\Users\Keane\Desktop\Git Uploads\Gamedev\backend"
node server.js
```

## 7. Optional Next Step (Connect Frontend to Backend)

In React, call your backend API at:

```text
http://localhost:5000/api/health
```

Later, you can add environment variables and proxy settings for cleaner API URLs.