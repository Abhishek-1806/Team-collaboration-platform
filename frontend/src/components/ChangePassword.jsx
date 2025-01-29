import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineCheckCircle, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const modalRef = useRef(null); // Ref for the modal container

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any existing errors

    try {
      await axios.put("/api/auth/update", formData);
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      if (err.response) {
        // Handle specific error messages from backend
        switch (err.response.status) {
          case 400:
            setError("The old password is incorrect");
            break;
          case 406:
            setError("New password must be at least 6 characters long");
            break;
          default:
            setError("Failed to update password. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  // Close modal when clicking outside of the modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose(); // Close the modal if clicked outside
    }
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {showSuccess ? (
          <div className="text-center">
            <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Password Updated Successfully!</h2>
            <p className="text-gray-600">You will be redirected shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            {error && (
              <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Old Password</label>
              <div className="relative">
                <input
                  type={oldPasswordVisible ? 'text' : 'password'}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  className="w-full p-2 border rounded-md pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setOldPasswordVisible(!oldPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {oldPasswordVisible ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="relative">
                <input
                  type={newPasswordVisible ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  className="w-full p-2 border rounded-md pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {newPasswordVisible ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
