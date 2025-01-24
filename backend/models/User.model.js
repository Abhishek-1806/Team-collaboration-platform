// backend/models/User.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Task from "./Task.model.js";


const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'User'),
    defaultValue: 'User',
  }
}, 
{
    timestamps: true,
});


User.hasMany(Task, { foreignKey: "assignedTo" });
Task.belongsTo(User, { foreignKey: "assignedTo" });

export default User;
