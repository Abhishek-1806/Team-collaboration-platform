import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import sequelize from "./config/database.js";

import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";

// Load Environment Variables
dotenv.config();

const app = express();

// Middlewares to parse json request bodies and enable cors
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
// app.use(cors());
app.use(cors({
  origin: '*',  // Allow frontend on port 3000
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));


// Sync Database
const syncDatabase = async () => {
  try {
    await sequelize.sync({force: false});
    console.log('Database synced syccessfully');
    
  } catch (error) {
    console.error('Error syncing the Database', error);
    
  }
};

syncDatabase();

app.get("/", (req, res) => {
  res.send("Backend is working! 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Set up the server to listen on the defined port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// export default app;