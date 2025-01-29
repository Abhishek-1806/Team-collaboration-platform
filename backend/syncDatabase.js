import sequelize from "./config/database.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

(async () => {
  try {
    await sequelize.sync({ alter: true }); // Use alter: true to update schema
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error.message);
  }
})();
