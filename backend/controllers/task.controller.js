import Task from "../models/Task.model.js";
import User from "../models/User.model.js";

import { v2 as cloudinary} from "cloudinary";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { logActivity , logError } from "../lib/utils/logger.js";
import fs from "fs";
import { sendNotification } from "../lib/utils/notification.js";

// Create a Task
export const createTask = async (req, res) => {
    const { title, description, priority, dueDate, assignedBy, assignedTo } = req.body;
  
    try {        
        let fileUrl = null;
        if(req.file) {
            fileUrl = req.file.path;
            fileUrl = await uploadOnCloudinary(req.file.path);
            setTimeout(() => {}, 3000);
            if(req.file && fileUrl) {
                fs.unlinkSync(req.file.path);
            }
        }

        if (req.user.role === "User") {
        // Ensure the "assignedTo" field is set to the user's own ID
        const task = await Task.create({
          title,
          description,
          priority,
          dueDate,
          assignedBy: req.user.id,
          assignedTo: req.user.id, // Assign task to the user themselves
          fileUrl: fileUrl || null,
        });

        logActivity("Task Created", req.user.id, task.id, `Title: ${task.title}`);

        const userEmail = req.user.email;
        const subject = "Task Created Successfully"
        const message = `Task "${title}" has been created successfully and assigned to you, The Due date for the task is "${dueDate}".`;

        await sendNotification(userEmail, subject, message);
  
        return res.status(201).json({ message: "Task created successfully for yourself", task });
      }
  
        if (req.user.role === "Admin") {
        // Admins can assign tasks to others
        const userToAssign = await User.findByPk(assignedTo);
  
        // if (!userToAssign) {
        //   return res.status(404).json({ error: "User to assign task not found" });
        // }
  
        const task = await Task.create({
          title,
          description,
          priority,
          dueDate,
          assignedBy: req.user.id,
          assignedTo: assignedTo || req.user.id,
          fileUrl: fileUrl || null,
        });

        logActivity("Task Created", req.user.id, task.id, `Title: ${task.title}`);

        const adminEmail = req.user.email;
        const adminSubject = "Task Assignment Successful";
        const adminMessage = assignedTo
          ?`You have successfully assigned the task "${title}" to "${userToAssign.username}" (ID: "${userToAssign.id}"), and the Due date is "${dueDate}"`
          :`Task "${title}" has been assigned to you by default.`;
        
        await sendNotification(adminEmail, adminSubject, adminMessage);

        if(assignedTo){
          const assignedUserEmail = userToAssign.email;
          const assignedUserSubject = "New Task Assigned to You";
          const assignedUserMessage = `A new task "${title}" has been assigned to you by "${req.user.username}" (ID: "${req.user.id}"), and the Due date for the task is "${dueDate}".`;
          
          await sendNotification(assignedUserEmail, assignedUserSubject, assignedUserMessage);
        }
  
        return res.status(201).json({ message: "Task created and assigned successfully", task });
      }
  
      return res.status(403).json({ error: "Access denied: Invalid user role" });
    } catch (error) {
      console.error("Error creating task:", error.message);
      logError("Task Creation Failed", req.user.id, null, `Error: ${error.message}`);
      return res.status(500).json({ error: "Failed to create task" });
    }
  };

  

// Get All Tasks
export const getAllTasks = async (req, res) => {
    try {
      let tasks;
  
      if (req.user.role === "Admin") {
        // Admins can see all tasks
        tasks = await Task.findAll({
          include: [{ model: User, attributes: ["id", "username", "email"] }],
        });
      } else {
        // Regular users can only see their own tasks
        tasks = await Task.findAll({
          where: { assignedTo: req.user.id }, // Filter by the user's ID
          include: [{ model: User, attributes: ["id", "username", "email"] }],
        });
      }
  
      res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  };

  

// Get a Single Task
export const getTask = async (req, res) => {
  const { id } = req.params; 

  try {
    let task;
    
    if(req.user.role === "Admin") {
        task = await Task.findByPk(id, {
            include: [{model: User, attributes: ["id", "username", "email"]}]
        });
    } else {
        task = await Task.findOne({
            where: {id, assignedTo: req.user.id},
            include: [{model: User, attributes: ["id", "username", "email"]}],
        });
    }
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Error fetching task:", error.message);
    res.status(500).json({ error: "Failed to fetch task" });
  }
};

// Update Task
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, dueDate, status, assignedTo } = req.body;
  
    try {
      const task = await Task.findByPk(id);
      const userToAssign = await User.findByPk(assignedTo);
  
      if (!task) {
        logError("Task Updation Failed", req.user.id, id, "Task not found");
        return res.status(404).json({ error: "Task not found" });
      }

      let fileUrl = task.fileUrl;
      let hasFileUploaded = false;

      if(req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if(cloudinaryResponse) {
            fileUrl = cloudinaryResponse;
            fs.unlinkSync(req.file.path);
            hasFileUploaded = true;
        }
      }

      let statusChanged = false;
      if(status && status != task.status) {
        statusChanged = true;
      }
  
      // Update fields only if they are provided in the request body
      task.title = title || task.title;
      task.description = description || task.description;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.status = status || task.status;
      task.assignedTo = assignedTo || task.assignedTo;
      task.fileUrl = fileUrl;
      
      await task.save();
      
      if(statusChanged){
        logActivity("Task Status Updated", req.user.id, id, `Status changed to: ${task.status}`);
      }

      if(hasFileUploaded){
        logActivity("Task File Updated", req.user.id, id, `Uploaded File URL: ${task.fileUrl}`);
      }
      logActivity("Task Updated", req.user.id, id, `Updated Task title: ${task.title}`);

      const adminEmail = req.user.email;
      const adminSubject = "Task Assignment Successful";
      const adminMessage = assignedTo
        ? `You have successfully Updated and assigned the task "${title}" to "${userToAssign.username}" (ID: "${userToAssign.id}").`
        : `Task "${title}" has been updated and assigned to you by default.`;

      await sendNotification(adminEmail, adminSubject, adminMessage);


      if(userToAssign){
        const assignedUserEmail = userToAssign.email;
        const assignedUserSubject = "Task Updated Successfully";
        const assignedUsermessage = `Task "${title}" has been updated by "${req.user.username}" ("${req.user.id}"), and the Due date is "${dueDate}"`;

        sendNotification(assignedUserEmail, assignedUserSubject, assignedUsermessage);
      }
        
      res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
      console.error("Error updating task:", error.message);
      logError("Task Update Failed", req.user.id, id, `Error: ${error.message}`);
      res.status(500).json({ error: "Failed to update task" });
    }
  };
  


// Delete Task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    
    const task = await Task.findByPk(id);

    if (!task) {
      logError("Task Deletion Failed", req.user.id, id, "Task not found");
      return res.status(404).json({ error: "Task not found" });
    }

    if(task.assignedBy !== req.user.id) {
      return res.status(403).json({error: "Access Denied: You cannot delete this task"});      
    }

    if(task.fileUrl){
      let deleteKey = task.fileUrl.split('/');
      deleteKey = deleteKey[7].split('.');      
      await cloudinary.uploader.destroy(deleteKey[0]);
    }
    await task.destroy();

    logActivity("Task Deleted", req.user.id, id, `Task with id ${id} is Deleted`);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    logError("Task Deletion Failes", req.user.id, id, `Error: ${error.message}`);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
