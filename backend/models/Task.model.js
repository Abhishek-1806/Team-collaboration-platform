
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
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
      validate: {
        isDate: true,
        isAfter: new Date().toISOString(), // Ensure due date is in the future
      },
    },
    status: {
      type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
      allowNull: false,
      defaultValue: "Pending",
    },
    assignedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4, // Ensure valid UUID format
      },
    },
    assignedTo: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4, // Ensure valid UUID format
      },
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["assignedTo"] },
      { fields: ["assignedBy"] },
    ],
  }
);

export default Task;
