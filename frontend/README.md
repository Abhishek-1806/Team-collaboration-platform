# Team Collaboration Platform - Frontend

A modern task management and team collaboration platform built with React and Vite. This platform enables teams to efficiently manage tasks, track progress, and collaborate seamlessly.

## Key Features

- **User Authentication**
  - Secure login/signup system
  - Role-based access control (Admin/User)
  - Password management

- **Task Management**
  - Create, read, update, and delete tasks
  - File attachments support
  - Priority levels (Low, Medium, High)
  - Status tracking (Pending, In Progress, Completed)
  - Task assignment and reassignment

- **Dashboard & Analytics**
  - Task status overview
  - Progress tracking
  - Team performance metrics
  - Visual data representation using Chart.js

- **Team Management**
  - User roles and permissions
  - Team member directory
  - Profile management
  
- **Responsive Design**
  - Mobile-first approach
  - Adaptive sidebar
  - Cross-device compatibility

## Tech Stack & Versions

- **React** (v18.3.1) - Frontend Framework
- **Vite** (v6.0.5) - Build Tool
- **Tailwind CSS** (v4.0.0) - Styling
- **React Router DOM** (v7.1.3) - Routing
- **Axios** (v1.7.9) - HTTP Client
- **Chart.js** (v4.4.7) & **React-Chartjs-2** (v5.3.0) - Data Visualization
- **React Icons** (v5.4.0) - Icons

## Getting Started

1. **Clone & Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/Abhishek-1806/Team-collaboration-platform.git
   
   # Navigate to frontend directory
   cd team-collaboration-platform/frontend
   
   # Install dependencies
   npm install
   ```

2. **Configure Proxy Settings**
   Create or modify `vite.config.js` in the root directory:
   ```javascript
    import { defineConfig } from 'vite'
    import tailwindcss from '@tailwindcss/vite'
    export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    server: {
        proxy: {
        '/api': 'Your backend URL e.g http://localhost:8000',
        },
    },
    })
    ```

3. **Add Stylesheet** Modify the `index.html` file.
    
    ```html
    <!-- Add this stylesheet in the head tag  -->
    <link href="/dist/styles.css" rel="stylesheet">
    ```

4. **Start Development**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Project Structure
    frontend/
    ├── src/
    │   ├── components/                    # Reusable UI 
    │   ├── pages/              # Page components
    │   ├── assets/             # Static assets
    │   ├── App.jsx             # Main app component
    |   ├── App.css             # App styles
    │   ├── main.jsx            # Entry point
    |   └── App.css             # App styles
    ├── public/                 # Static files
    ├── vite.config.js          # Vite configuration
    └── package.json            # Project dependencies