import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineUser, AiOutlineLock, AiOutlineLogout } from "react-icons/ai"; // Icons for options
import { MdOutlineAddTask } from "react-icons/md";
import ChangePassword from "./ChangePassword"; // Import ChangePassword component

const Navbar = ({ userRole, userId, toggleSidebar }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for the dropdown menu
  const avatarRef = useRef(null); // Ref for the avatar button

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setProfileData(response.data);
      navigate("/profile");  // Navigate to profile page
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true); // Show the ChangePassword modal
    setDropdownVisible(false); // Close the dropdown when the modal is triggered
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false); // Close the modal
  };

  // Close dropdown when clicking outside of avatar or dropdown
  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !avatarRef.current.contains(e.target)) {
      setDropdownVisible(false);
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
    <div className="w-full bg-white shadow-sm py-4 px-4">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-green-600 p-2 rounded-full ml-12">
            <MdOutlineAddTask className="text-white text-2xl" />
          </div>
          <span className="text-2xl font-bold text-black">Task Teams</span>
        </div>

        {/* Existing navbar content */}
        <div className="relative" ref={avatarRef}>
          <button onClick={handleDropdownToggle} className="text-white cursor-pointer">
            <img
              src="https://openclipart.org/download/247319/abstract-user-flat-3.svg"
              alt="Avatar"
              className="rounded-full w-8 mr-12"
            />
          </button>
          {dropdownVisible && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 bg-white border-0 rounded-md shadow-lg w-48">
              <ul className="space-y-2 p-3">
                <li onClick={fetchProfile} className="flex items-center cursor-pointer">
                  <AiOutlineUser className="mr-2" /> Profile
                </li>
                <li onClick={handleChangePassword} className="flex items-center cursor-pointer">
                  <AiOutlineLock className="mr-2" /> Change Password
                </li>
                <li onClick={handleLogout} className="flex items-center cursor-pointer">
                  <AiOutlineLogout className="mr-2" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Conditionally render the ChangePassword modal */}
        {showChangePasswordModal && <ChangePassword onClose={closeChangePasswordModal} />}
      </div>
    </div>
  );
};

export default Navbar;
