import React, { useState } from "react";
import { MdDashboard, MdOutlineAddTask, MdOutlinePendingActions, MdSettings, MdTaskAlt } from "react-icons/md";
import { RiProgress3Fill } from "react-icons/ri";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress",
    icon: <RiProgress3Fill />,
  },
  {
    label: "Pending",
    link: "pending",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
];

const Sidebar = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[1];

  const handleClick = () => {
    // Close sidebar if onNavigate function is provided (mobile view)
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-5 mt-10 md:pl-5 md:mt-2">
      {/* Sidebar Links */}
      <div className="flex flex-col gap-y-5 py-8">
        {linkData.map((link) => (
          <Link
            key={link.label}
            to={`/${link.link}`}
            onClick={handleClick}
            className={`w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d] ${
              path === link.link.split("/")[0] ? "bg-blue-700 text-neutral-100" : ""
            }`}
          >
            {link.icon}
            <span className="hover:text-[#2564ed]">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
