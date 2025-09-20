import React from "react";
import { X, LogOut, Cloud } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { clearFiles } from "../../redux/slice/fileSlice";

const NewSidebar = ({ isOpen, onClose, user, closeSidebar }) => {
  const files = useSelector((state) => state.files.files);

  const totalStorage = 1000 * 1024 * 1024; // 1000 MB
  const usedStorage =
    files?.reduce((acc, file) => acc + (file.size || 0), 0) || 0;
  const usagePercent = Math.min((usedStorage / totalStorage) * 100, 100);
  const usedMB = (usedStorage / (1024 * 1024)).toFixed(2);
  // ✅ usedStorage is in BYTES
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dynamic color: green < 70%, yellow < 90%, red >= 90%
  const progressColor =
    usagePercent < 70
      ? "bg-green-500"
      : usagePercent < 90
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div
      className={`fixed top-0 left-0 h-full w-60 bg-white border-r-2 border-[#E2E8F0] flex flex-col justify-between transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 md:static`}
    >
      <div>
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-semibold">My Drive</h2>
          <button
            onClick={onClose}
            className="md:hidden text-gray-600 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <ul className="text-sm pt-4 px-2 text-[#1E293B]">
          <li
            onClick={() => {
              navigate("/");
              closeSidebar(); // 🔹 close sidebar on menu click
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
          >
            <i className="ri-home-line font-semibold text-xl"></i>
            <span className="font-semibold">Home</span>
          </li>

          <li
            onClick={() => {
              navigate("/myfiles");
              closeSidebar();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
          >
            <i className="ri-folder-line font-semibold text-xl"></i>
            <span className="font-semibold">My Folders</span>
          </li>

          <li
            onClick={() => {
              navigate("/bin"); // Navigate to Bin page
              closeSidebar();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
          >
            <i className="ri-delete-bin-line font-semibold text-xl"></i>
            <span className="font-semibold">Bin</span>
          </li>

          <li
            onClick={() => {
              navigate("/settings");
              closeSidebar();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
          >
            <i className="ri-settings-3-line font-semibold text-xl"></i>
            <span className="font-semibold">Settings</span>
          </li>
        </ul>

        {/* Storage Usage Bar */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between text-sm mb-1">
            <div className="flex items-center space-x-1">
              <Cloud />
              <span className="text-[#1E293B] font-semibold">Storage</span>
            </div>
            <span className="text-gray-600">{usagePercent.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} rounded-full`}
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {usedMB} MB of 1000 MB used
          </p>
        </div>
      </div>

      {/* User Info + Logout */}
      <div className="border-t p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-wrap overflow-hidden">
          <img
            src={user?.avatar || "https://via.placeholder.com/40"}
            alt="user"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold text-gray-800 truncate"
              title={user?.email || "Guest"} // tooltip shows full email
            >
              {user?.email || "Guest"}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");

            dispatch(clearUser());
            dispatch(clearFiles());
            window.location.reload();
          }}
          className="text-red-500 hover:text-red-700"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default NewSidebar;
