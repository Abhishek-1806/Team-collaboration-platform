import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineLock } from "react-icons/ai";
import ChangePassword from "./ChangePassword";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile and tasks in parallel
        const [profileResponse, tasksResponse] = await Promise.all([
          axios.get('/api/auth/me'),
          axios.get('/api/tasks')
        ]);

        setProfileData(profileResponse.data);

        // Compute task statistics
        const tasks = tasksResponse.data.tasks;
        const stats = tasks.reduce((acc, task) => {
          acc.total++;
          switch (task.status.toLowerCase()) {
            case 'completed':
              acc.completed++;
              break;
            case 'in progress':
              acc.inProgress++;
              break;
            case 'pending':
              acc.pending++;
              break;
          }
          return acc;
        }, { total: 0, completed: 0, inProgress: 0, pending: 0 });

        setTaskStats(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePasswordClose = () => {
    setShowChangePassword(false);
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <IoArrowBack className="text-xl" />
        <span>Back</span>
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Updated Header Banner */}
        <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600"></div>

        {/* Profile Content */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <img
              src="https://openclipart.org/download/247319/abstract-user-flat-3.svg"
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg"
            />
          </div>

          {/* Profile Information */}
          <div className="pt-20">
            <div className="flex justify-between items-center gap-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {profileData.username}
              </h2>
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md hover:opacity-90 transition-opacity"
              >
                <AiOutlineLock  />
                Change Password
              </button>
            </div>
            
            {/* Profile Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="profile-item">
                  <h3 className="text-sm font-semibold text-gray-500">Email</h3>
                  <p className="text-lg text-gray-700">{profileData.email}</p>
                </div>
                <div className="profile-item">
                  <h3 className="text-sm font-semibold text-gray-500">Role</h3>
                  <p className="text-lg text-gray-700 capitalize">{profileData.role}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="profile-item">
                  <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                
              </div>
            </div>

            {/* Updated Stats Section */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-6">
              <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-2xl font-bold text-violet-600">{taskStats.total}</h4>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-2xl font-bold text-emerald-600">{taskStats.completed}</h4>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-2xl font-bold text-amber-600">{taskStats.inProgress}</h4>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-2xl font-bold text-rose-600">{taskStats.pending}</h4>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated modal background */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div ref={modalRef}>
            <ChangePassword onClose={handleChangePasswordClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
