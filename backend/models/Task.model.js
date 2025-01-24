import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM("Low", "Medium", "High"),
    allowNull: false,
    defaultValue: "Medium",
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
    allowNull: false,
    defaultValue: "Pending",
  },
  assignedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.INTEGER, // User ID
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true, // File is optional
  },
});

export default Task;
