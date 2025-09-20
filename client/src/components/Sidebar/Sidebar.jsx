import React from "react";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-60 bg-white border-r-2 border-[#E2E8F0] transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 md:static`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="font-semibold">My Drive</h2>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}
      <ul className="text-sm pt-4 text-[#1E293B]">
        <li className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <i className="ri-home-line font-semibold"></i>
          <span className="font-semibold">Home</span>
        </li>

        <li className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <i className="ri-folder-line font-semibold"></i>
          <span className="font-semibold">My Files</span>
        </li>

        <li className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <i className="ri-settings-3-line font-semibold"></i>
          <span className="font-semibold">Settings</span>
        </li>

        <li className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <i className="ri-settings-3-line font-semibold"></i>
          <span className="font-semibold">Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

// import React from "react";
// import { X, LogOut } from "lucide-react";

// const NewSidebar = ({ isOpen, onClose, user }) => {
//   return (
//     <div
//       className={`fixed top-0 left-0 h-full w-60 bg-white border-r-2 border-[#E2E8F0] flex flex-col justify-between transform transition-transform duration-300 z-50
//       ${isOpen ? "translate-x-0" : "-translate-x-full"}
//       md:translate-x-0 md:static`}
//     >
//       {/* Header */}
//       <div>
//         <div className="p-4 flex justify-between items-center border-b">
//           <h2 className="font-semibold">My Drive</h2>
//           {/* Close button for mobile */}
//           <button
//             onClick={onClose}
//             className="md:hidden text-gray-600 hover:text-black"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Menu */}
//         <ul className="text-sm pt-4 text-[#1E293B]">
//           <li className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
//             <i className="ri-home-line font-semibold"></i>
//             <span className="font-semibold">Home</span>
//           </li>

//           <li className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
//             <i className="ri-folder-line font-semibold"></i>
//             <span className="font-semibold">My Files</span>
//           </li>

//           <li className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
//             <i className="ri-settings-3-line font-semibold"></i>
//             <span className="font-semibold">Settings</span>
//           </li>
//         </ul>
//       </div>

//       {/* User Info + Logout (Bottom Section) */}
//       <div className="border-t-2 border-[#E2E8F0] p-4 flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <img
//             src={user?.avatar}
//             alt="user"
//             className="w-10 h-10 rounded-full object-cover border"
//           />
//           <div>
//             <p className="text-xs font-semibold text-gray-800">
//               {user?.email || "Guest"}
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             window.location.reload();
//           }}
//           className="text-red-500 hover:text-red-700"
//         >
//           <LogOut size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NewSidebar;
