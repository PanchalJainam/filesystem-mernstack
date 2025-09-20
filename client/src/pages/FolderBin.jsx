import React, { useEffect, useState, useRef } from "react";

import { permanentDeleteFolderApi, restoreFolderApi } from "../Api/folderApi";
import API from "../Api/authApi";
import NoRecords from "../components/NoRecords/NoRecords";
import noDataFound from "../assets/noFolders.png";

const FolderBin = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchDeletedFolders();
  }, []);

  const fetchDeletedFolders = async () => {
    try {
      const res = await API.get("/folder/bin"); // ✅ Your backend route
      setFolders(res.data.folders || []);
    } catch (error) {
      console.error("Error fetching deleted folders:", error);
    } finally {
      setLoading(false);
    }
  };

  // ♻️ Restore folder
  const handleRestore = async (id) => {
    try {
      await restoreFolderApi(id);
      fetchDeletedFolders();
    } catch (err) {
      console.error("Error restoring folder:", err);
    }
  };

  // ⚠️ Permanent delete
  const handlePermanentDelete = async (id) => {
    if (
      !window.confirm("⚠️ This will permanently delete the folder. Continue?")
    )
      return;
    try {
      await permanentDeleteFolderApi(id);
      fetchDeletedFolders();
    } catch (err) {
      console.error("Error permanently deleting folder:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🗑️ Folder Bin</h2>
      </div>

      {loading ? (
        <p>Loading deleted folders...</p>
      ) : folders.length === 0 ? (
        <NoRecords src={noDataFound} message={"This folder is empty."} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-lg transition relative"
            >
              <div className="text-4xl">📁</div>
              <h3 className="text-lg font-semibold truncate">{folder.name}</h3>

              {/* 3-dot menu */}
              <div
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() =>
                  setMenuOpen(menuOpen === folder._id ? null : folder._id)
                }
              >
                ⋮
              </div>

              {menuOpen === folder._id && (
                <div
                  ref={menuRef}
                  className="absolute top-8 right-2 bg-white border rounded shadow-md w-32 z-10"
                >
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600"
                    onClick={() => {
                      handleRestore(folder._id);
                      setMenuOpen(null);
                    }}
                  >
                    Restore
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      handlePermanentDelete(folder._id);
                      setMenuOpen(null);
                    }}
                  >
                    Delete Forever
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderBin;
