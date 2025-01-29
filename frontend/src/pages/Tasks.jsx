import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import TaskCard from "../components/TaskCard.jsx";
import TaskModal from "../components/TaskModal.jsx";
import { useLocation } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null); // Store the logged-in user
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];

  // Get status based on current route
  const getStatusFromRoute = () => {
    switch (currentPath) {
      case "completed":
        return "completed";
      case "in-progress":
        return "in progress";
      case "pending":
        return "pending";
      default:
        return null;
    }
  };

  // Fetch logged-in user details
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      setUser({ id: response.data.id, role: response.data.role }); // Include user role
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fetch tasks assigned by the logged-in user
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUser(); // Fetch the user first
      await fetchTasks(); // Fetch tasks after fetching the user
    };
    loadData();
  }, []);


  const filteredTasks = tasks.filter((task) => {
    const statusFilter = getStatusFromRoute();
    
    // Admins: show tasks they assigned to others
    if (user?.role === "Admin") {
      if (statusFilter) {
        return task.assignedBy === user.id && task.status.toLowerCase() === statusFilter;
      }
      return task.assignedBy === user.id;
    }
  
    // Users: show tasks assigned to them
    if (user?.role === "User") {
      if (statusFilter) {
        return task.assignedTo === user.id && task.status.toLowerCase() === statusFilter;
      }
      return task.assignedTo === user.id;
    }
  
    return false;
  });

  // Update page title based on current route
  const getPageTitle = () => {
    switch (currentPath) {
      case "completed":
        return "Completed Tasks";
      case "in-progress":
        return "In Progress Tasks";
      case "pending":
        return "Pending Tasks";
      default:
        return "Your Tasks";
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]); // Add the new task to the task list
    setShowModal(false); // Close the modal
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
        {currentPath === "tasks" && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer"
          >
            <FaPlusCircle className="mr-2" />
            Create Task
          </button>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 py-10 mt-32">
            No tasks found
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <TaskModal 
          onClose={() => setShowModal(false)} 
          onTaskCreated={handleTaskCreated} 
        />
      )}
    </div>
  );
};

export default Tasks;
