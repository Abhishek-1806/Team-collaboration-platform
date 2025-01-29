import React, { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import { Navigate, Route, Routes, Outlet, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Tasks from './pages/Tasks';
import Navbar from './components/Navbar';
import Users from './pages/Users';
import Signup from './pages/Signup';
import TaskDetails from './pages/TaskDetails';
import Profile from './components/Profile';
import MobileSidebar from './components/MobileSidebar';

function Layout() {
  const user = localStorage.getItem('token');
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return user ? (
    <div className='w-full h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50 to-violet-50'>
      {/* Header */}
      <div className='w-full sticky top-0 z-20'>
        <Navbar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-row overflow-hidden'>
        {/* Desktop Sidebar with transition */}
        <div 
          className={`hidden lg:block bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-1/5' : 'w-0'
          }`}
        >
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content Area with transition */}
        <div className='flex-1 overflow-y-auto p-4 2xl:px-10 transition-all duration-300 ease-in-out'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {

  return (
    <>
      <div className='w-full min-h-screen bg-[#f3f4f6] '>
      <Routes>
        <Route element={<Layout />}>
          <Route index path='/' element={<Navigate to='/login' />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/tasks' element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/taskDetails/:id" element={<TaskDetails />} />
          <Route path="/completed" element={<Tasks />} />
          <Route path="/in-progress" element={<Tasks />} />
          <Route path="/pending" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
    </>
  )
}

export default App
