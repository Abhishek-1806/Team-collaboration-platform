import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import UpdateTaskModal from "../components/UpdateTaskModal";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userId, setUserId] = useState(null); // Logged-in user ID
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [fileType, setFileType] = useState(null);
  
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/tasks/${id}`);
        setTask(response.data.task);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Fetch logged-in user's ID on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        setUserId(response.data.id); // Set the logged-in user's ID
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (task?.fileUrl) {
      const extension = task.fileUrl.split('.').pop().toLowerCase();
      setFileType(extension === 'pdf' ? 'pdf' : 'image');
    }
  }, [task]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/delete/${id}`);
      navigate("/tasks"); // Redirect to tasks page after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowUpdateModal(false);
      setShowDeleteConfirmation(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );  
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  const { title, description, priority, status, assignedBy, dueDate } = task;

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-5 text-blue-500 hover:text-blue-600 cursor-pointer"
      >
        <FaArrowLeft className="mr-2" />
        Back to Tasks
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-semibold mb-4">{title}</h1>
          {task.fileUrl && (
            <div className="ml-4">
              <div 
                onClick={() => setShowFilePreview(true)}
                className="cursor-pointer hover:opacity-90 transition-opacity"
              >
                {fileType === 'pdf' ? (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg shadow-md ">
                    <span className="text-red-500 font-bold">PDF</span>
                  </div>
                ) : (
                  <img 
                    src={task.fileUrl} 
                    alt="Task attachment" 
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <p className="text-gray-600 mb-2">
          <strong>Priority:</strong> <span className="capitalize">{priority}</span>
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Status:</strong> <span className="capitalize">{status}</span>
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}
        </p>
        <div className="flex justify-end space-x-3">
          {/* Render Update Button */}
          <button
            onClick={() => setShowUpdateModal(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600"
          >
            Update
          </button>
          
          {/* Render Delete Button only if user is assignedBy */}
          {userId === assignedBy && (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Modals for File Preview, Update, and Delete */}
      {/* File Preview Modal */}
      {showFilePreview && task.fileUrl && (
        <div 
          className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFilePreview(false)}
        >
          {fileType === 'pdf' ? (
            <div className="w-[70%] h-[90vh] bg-white md:w-[80%] sm:h-[90%]">
              <iframe
                src={`${task.fileUrl}#view=FitH`}
                title="PDF Preview"
                className="w-full h-full"
              />
            </div>
          ) : (
            <img 
              src={task.fileUrl} 
              alt="Task attachment preview" 
              className="max-w-[70%] max-h-[90vh] object-contain"
            />
          )}
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
          <div ref={modalRef}>
            <UpdateTaskModal
              task={task}
              onClose={() => setShowUpdateModal(false)}
              onTaskUpdated={(updatedTask) => {
                setTask(updatedTask);
                setShowUpdateModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white p-5 rounded-lg shadow-lg max-w-md text-center"
          >
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
