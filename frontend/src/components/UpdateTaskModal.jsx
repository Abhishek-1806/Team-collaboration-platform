import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Success tick icon

const UpdateTaskModal = ({ task, onClose, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate.split("T")[0],
    assignedTo: task.assignedTo,
    file: task.fileUrl,
  });

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(""); // User role

  const modalRef = useRef(null);

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
        // setLoadingUsers(true);
        try {
          const response = await axios.get("/api/auth/users");
          setUsers(response.data || []);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          // setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/tasks/update/${task.id}`, formData);
      if (response.status === 200) {
        setShowSuccessMessage(true); // Show success message

        // Close the modal after 2 seconds to show success card
        setTimeout(() => {
          onTaskUpdated(response.data.task);
          // setShowSuccessMessage(false); // Hide success message after a delay
          onClose(); // Close modal after success card disappears
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/delete/${task.id}`);
      setShowDeleteConfirmation(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Success message
  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md text-center">
          <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Task Updated Successfully!</h2>
          <p className="text-gray-600">You will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  // Delete confirmation
  if (showDeleteConfirmation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md text-center">
          <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Task Deleted Successfully!</h2>
          <p className="text-gray-600">You will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm overflow-y-auto">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl m-4">
        <h2 className="text-2xl font-semibold mb-6">Update Task</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Left Column */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Right Column First Row */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full p-2 h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Description - Full Width, Double Height */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full h-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
              style={{ height: "88px" }}
            />
          </div>

          {/* Status and Assign To */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {role === "Admin" && (
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full p-2 h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
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
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Attach File */}
          <div>
            <label className="block text-sm font-medium mb-1">Attach File</label>
            <input
              type="file"
              name="fileUrl"
              onChange={handleInputChange}
              className="w-full p-2 h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer - Full Width */}
          <div className="col-span-2 flex justify-end items-center pt-6 mt-2 border-t">
            
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;