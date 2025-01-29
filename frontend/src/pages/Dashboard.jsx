import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { MdTaskAlt, MdOutlinePendingActions } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { RiProgress3Fill } from "react-icons/ri";
import axios from "axios";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Use state for user
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is admin

  // Fetch logged-in user details
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data); // Set user details in state
      setIsAdmin(response.data.role === "Admin"); // Assuming 'role' is part of user data
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Fetch tasks assigned to or by the user
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUser(); // Fetch user details first
      await fetchTasks(); // Fetch tasks after user details
    };
    loadData();
  }, []);

  // Calculate task stats directly from the tasks array
  const calculateTaskStats = () => {
    if (!user) return { total: 0, completed: 0, inProgress: 0, pending: 0 }; // Ensure user is loaded

    const userTasks = tasks.filter((task) => task.assignedTo === user.id);
    const total = userTasks.length;
    const completed = userTasks.filter((task) => task.status.toLowerCase() === "completed").length;
    const inProgress = userTasks.filter((task) => task.status.toLowerCase() === "in progress").length;
    const pending = userTasks.filter((task) => task.status.toLowerCase() === "pending").length;

    return { total, completed, inProgress, pending };
  };

  const calculateAssignedTaskStats = () => {
    if (!user) return { totalAssigned: 0, completedAssigned: 0, inProgressAssigned: 0, pendingAssigned: 0 }; // Ensure user is loaded

    const assignedTasks = tasks.filter((task) => task.assignedBy === user.id && task.assignedBy !== task.assignedTo);
    const totalAssigned = assignedTasks.length;
    const completedAssigned = assignedTasks.filter((task) => task.status.toLowerCase() === "completed").length;
    const inProgressAssigned = assignedTasks.filter((task) => task.status.toLowerCase() === "in progress").length;
    const pendingAssigned = assignedTasks.filter((task) => task.status.toLowerCase() === "pending").length;

    return { totalAssigned, completedAssigned, inProgressAssigned, pendingAssigned };
  };

  const { total, completed, inProgress, pending } = calculateTaskStats();
  const { totalAssigned, completedAssigned, inProgressAssigned, pendingAssigned } = calculateAssignedTaskStats();

  // Bar chart data for task status
  const barChartData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        label: "Task Status",
        data: [completed, inProgress, pending],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  // Bar chart data for assigned task status
  const assignedBarChartData = {
    labels: ["Completed Assigned", "In Progress Assigned", "Pending Assigned"],
    datasets: [
      {
        label: "Assigned Task Status",
        data: [completedAssigned, inProgressAssigned, pendingAssigned],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Task Status",
      },
    },
  };

  // Conditional rendering based on loading and tasks data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );  }

  return (
    <div className="p-5">
      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <Card icon={<FaTasks />} label="Total Tasks" count={total} bg="bg-blue-500" />
        <Card icon={<MdTaskAlt />} label="Completed Tasks" count={completed} bg="bg-green-500" />
        <Card icon={<RiProgress3Fill />} label="In Progress" count={inProgress} bg="bg-yellow-500" />
        <Card icon={<MdOutlinePendingActions />} label="Pending Tasks" count={pending} bg="bg-red-500" />
      </div>

      {/* Admin-Specific Task Cards */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <Card icon={<FaTasks />} label="Total Assigned Tasks" count={totalAssigned} bg="bg-blue-500" />
          <Card icon={<MdTaskAlt />} label="Completed Assigned Tasks" count={completedAssigned} bg="bg-green-500" />
          <Card icon={<RiProgress3Fill />} label="In Progress Assigned" count={inProgressAssigned} bg="bg-yellow-500" />
          <Card icon={<MdOutlinePendingActions />} label="Pending Assigned Tasks" count={pendingAssigned} bg="bg-red-500" />
        </div>
      )}

      {/* Bar Chart for Task Status */}
      <div className="bg-white shadow-md rounded-md p-5 mb-10">
        <h3 className="text-lg font-semibold mb-4">Task Status</h3>
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      {/* Admin-Specific Bar Chart for Assigned Task Status */}
      {isAdmin && (
        <div className="bg-white shadow-md rounded-md p-5 mb-10">
          <h3 className="text-lg font-semibold mb-4">Assigned Task Status</h3>
          <Bar data={assignedBarChartData} options={barChartOptions} />
        </div>
      )}

      {/* Additional Analysis */}
      <div className="bg-white shadow-md rounded-md p-5">
        <h3 className="text-lg font-semibold mb-4">Additional Analysis</h3>
        <p className="text-gray-600">Analyze tasks and identify bottlenecks to optimize productivity.</p>
      </div>
    </div>
  );
};

const Card = ({ icon, label, count, bg }) => (
  <div className={`flex items-center p-4 rounded-lg shadow-md text-white ${bg}`}>
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm">{label}</p>
      <h2 className="text-2xl font-bold">{count}</h2>
    </div>
  </div>
);

export default Dashboard;
