import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
//   assignTask,
} from "../controllers/task.controller.js";
import {upload} from "../middlewares/upload.js";

const router = express.Router();

router.post("/create", protectRoute, upload.single("fileUrl"), createTask); // Create Task
router.get("/", protectRoute, getAllTasks); // Get All Tasks
router.get("/:id", protectRoute, getTask); // Get Single Task
router.put("/update/:id", protectRoute, upload.single("fileUrl"), updateTask); // Update Task
router.delete("/delete/:id", protectRoute, deleteTask); // Delete Task

export default router;
