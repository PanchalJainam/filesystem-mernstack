import React, { useState, useRef, useEffect } from "react";
import { createFolderApi } from "../../Api/folderApi";
import { useNavigate } from "react-router-dom";

const CreateFolderModal = ({ isOpen, onClose, onSuccess }) => {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const res = await createFolderApi({ name: folderName });
      const { folder } = res.data;
      setFolderName("");
      setError("");
      onSuccess();
      navigate(`/myfiles/${folder?._id}`);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFolderName("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-2xl shadow-xl w-[400px]"
      >
        <h2 className="text-[18px] font-semibold mb-4 text-gray-800">
          Create New Folder
        </h2>
        <input
          type="text"
          placeholder="Folder name"
          className="w-full border p-2 rounded mb-2 focus:outline-none"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-[14px]"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4F46E5] transition disabled:opacity-50 text-[14px]"
            onClick={handleCreateFolder}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
