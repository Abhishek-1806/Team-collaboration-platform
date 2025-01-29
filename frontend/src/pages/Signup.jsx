import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Add icon library

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User',
  });
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate input
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    // Add API call logic here
    try {
      console.log('Submitting form:', formData);
      // Example API call to signup endpoint
      const response = await axios.post('api/auth/signup', formData);
      console.log(response.data);

      // Redirect to login page after successful signup
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Signup failed. Please try again.'); // Example error handling
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto gap-20 flex flex-col md:flex-row items-center justify-center">
        {/* Left Side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center mt-10">
          <div className="w-full md:max-w-lg sm:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">
              Manage all your tasks in one place
            </span>
            <p className="text-4xl md:text-6xl font-black text-center text-blue-700">
              Team Collaboration Platform
            </p>
            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/3 p-4 flex flex-col justify-center items-center">
          <form
            onSubmit={submitHandler}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div>
              <p className="text-blue-600 text-3xl font-bold text-center">Create Account</p>
              <p className="text-center text-base text-gray-700">Join us and keep all your tasks organized</p>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="flex flex-col gap-y-2">
              <label htmlFor="username" className="flex items-start ml-4">Username</label>
              <input
                id="username"
                name="username"
                placeholder="JohnDoe"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-full px-4 py-1 bg-gray-50 focus:bg-gray-100 outline-none"
              />

              <label htmlFor="email" className="flex items-start ml-4 mt-4">Email</label>
              <input
                id="email"
                name="email"
                placeholder="email@example.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-full px-4 py-1 bg-gray-50 focus:bg-gray-100 outline-none"
              />

              <label htmlFor="password" className="flex items-start ml-4 mt-4">Password</label>
              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  placeholder="******"
                  type={passwordVisible ? 'text' : 'password'} // Toggle input type based on visibility state
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-full px-4 py-1 bg-gray-50 focus:bg-gray-100 outline-none"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {passwordVisible ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>

              <label htmlFor="role" className="flex items-start ml-4 mt-4">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-full px-4 py-1 bg-gray-50 focus:bg-gray-100 outline-none"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-6">
              <button type="submit" className="w-1/2 md:w-full h-10 text-white text-xl rounded-full bg-blue-700">
                Sign Up
              </button>
              <Link to="/login" className="w-full text-center">
                <button type="button" className="w-1/2 md:w-full h-10 text-white text-xl rounded-full bg-blue-700">
                  Login
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
