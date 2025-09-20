import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Lock, Bell, HardDrive, Globe, Save } from "lucide-react";
import API from "../Api/authApi";
import { setUser } from "../redux/slice/authSlice";
import ConfirmationModal from "../components/ConfirmationModal/ConfirmationModal";
import toast, { Toaster } from "react-hot-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const dispatch = useDispatch();

  // User info from Redux
  const user = useSelector((state) => state.auth.user);

  // Local states
  const [fullName, setFullName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");

  // Storage info from Redux
  const { totalSize, formattedSize } = useSelector((state) => state.files);
  const totalLimit = 1000 * 1024 * 1024;
  const usedPercent = Math.min((totalSize / totalLimit) * 100, 100);

  // Confirmation modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("");

  // Open modal
  const handleOpenConfirm = (type) => {
    setActionType(type);
    setShowConfirm(true);
  };

  // Close modal
  const handleCloseConfirm = () => setShowConfirm(false);

  // Confirm action
  const handleConfirmAction = async () => {
    setShowConfirm(false); // close modal
    const token = localStorage.getItem("token");
    try {
      if (actionType === "general") {
        const formData = new FormData();
        formData.append("name", fullName);
        if (avatar) formData.append("avatar", avatar);

        const { data } = await API.put("/user/update", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch(setUser({ ...data.user, token }));
        toast.success("Profile updated successfully ✅");
      } else if (actionType === "password") {
        await API.put(
          "/user/update",
          { password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Password updated successfully ✅");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Action failed ❌");
    }
  };

  return (
    <div className="p-4 mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 border rounded-lg bg-white shadow-sm">
          <ul>
            {[
              { id: "general", label: "General", icon: <User size={18} /> },
              { id: "security", label: "Security", icon: <Lock size={18} /> },
              {
                id: "notifications",
                label: "Notifications",
                icon: <Bell size={18} />,
              },
              {
                id: "storage",
                label: "Storage",
                icon: <HardDrive size={18} />,
              },
              { id: "language", label: "Language", icon: <Globe size={18} /> },
            ].map((tab, index) => (
              <li
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-200 ${
                  activeTab === tab.id ? "bg-gray-200 font-medium" : ""
                } ${index === 0 ? "rounded-t-lg" : ""} ${
                  index === 4 ? "rounded-b-lg" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 border rounded-lg bg-white p-6 shadow-sm">
          {/* General */}
          {activeTab === "general" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border rounded px-3 py-2 w-full mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="border rounded px-3 py-2 w-full mt-1 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleOpenConfirm("general")}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="border rounded px-3 py-2 w-full mt-1"
                  />
                </div>
                <button
                  onClick={() => handleOpenConfirm("password")}
                  className="mt-3 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Notifications</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> Email Notifications
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Push Notifications
                </label>
              </div>
            </div>
          )}

          {/* Storage */}
          {activeTab === "storage" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Storage Settings</h2>
              <p className="text-sm text-gray-600 mb-4">
                Manage your file storage and upgrade your plan.
              </p>
              <div className="bg-gray-100 rounded p-4">
                <p>
                  <span className="font-medium">Used:</span> {formattedSize} /
                  1000 MB
                </p>
                <div className="w-full h-2 bg-gray-300 rounded mt-2">
                  <div
                    className="h-2 bg-gray-700 rounded"
                    style={{ width: `${usedPercent}%` }}
                  ></div>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Language */}
          {activeTab === "language" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Language</h2>
              <select className="border rounded px-3 py-2">
                <option>English</option>
                <option>Spanish</option>
                <option>Hindi</option>
                <option>French</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Action"
        message={
          actionType === "general"
            ? "Are you sure you want to update your profile?"
            : "Are you sure you want to change your password?"
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCloseConfirm}
      />
    </div>
  );
};

export default Settings;
