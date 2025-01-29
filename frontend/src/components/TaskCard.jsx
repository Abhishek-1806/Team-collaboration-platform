import React from "react";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { id, title, description, priority, status } = task;

  const priorityColor = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500",
  }[priority.toLowerCase()] || "text-gray-500";

  return (
    <div
      className="bg-white shadow-md rounded-md p-4 cursor-pointer"
      onClick={() => navigate(`/taskDetails/${id}`)}
    >
      <h3 className="text-lg font-semibold mb-2 truncate">
        {title.length > 20 ? `${title.substring(0, 20)}...` : title}
      </h3>
      <p className="text-gray-600 text-sm mb-2 truncate">{description}</p>
      <div className="flex justify-between items-center">
        <span className={`flex items-center ${priorityColor}`}>
          ● <span className="ml-1 capitalize">{priority}</span>
        </span>
        <span className="capitalize text-gray-700">{status}</span>
      </div>
    </div>
  );
};

export default TaskCard;
