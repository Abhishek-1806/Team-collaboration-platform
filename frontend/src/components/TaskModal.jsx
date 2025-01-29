import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Success tick icon
import axios from "axios";

const TaskModal = ({ onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    fileUrl: null,
    assignedTo: "",
  });

  const [role, setRole] = useState(""); // User role
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const modalRef = useRef(null); // Ref for the modal content

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setRole(response.data.role || ""); // Set user role
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch users if the role is Admin
  useEffect(() => {
    if (role === "Admin") {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const response = await axios.get("/api/auth/users");
          setUsers(response.data || []);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [role]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskData = new FormData();
      taskData.append("title", formData.title);
      taskData.append("description", formData.description);
      taskData.append("priority", formData.priority);
      taskData.append("dueDate", formData.dueDate);

      if (role === "Admin") {
        taskData.append("assignedTo", formData.assignedTo);
      }
      if (formData.fileUrl) {
        taskData.append("fileUrl", formData.fileUrl);
      }

      const response = await axios.post("/api/tasks/create", taskData);

      if (response.status === 201 || response.status === 200) {
        setShowSuccess(true); // Show success message

        setTimeout(() => {
          onTaskCreated(response.data.task); // Notify parent about the new task
          onClose(); // Close modal
        }, 3000);
      } else {
        alert(response.data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An error occurred while creating the task. Please try again.");
    }
  };

  // Close modal on outside click
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Add event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Render success message
  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md text-center">
          <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Task Created Successfully!</h2>
          <p className="text-gray-600">You will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  // Render form
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-5 w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {role === "Admin" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Attach File</label>
            <input
              type="file"
              name="fileUrl"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
