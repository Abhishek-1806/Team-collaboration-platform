import React, { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import Sidebar from "./Sidebar";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="block lg:hidden">
      {/* Hamburger/Close Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <MdClose className="text-2xl text-gray-700" />
        ) : (
          <RiMenu3Line className="text-2xl text-gray-700" />
        )}
      </button>
      

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - passing toggleSidebar to close when route changes */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <Sidebar onNavigate={toggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
