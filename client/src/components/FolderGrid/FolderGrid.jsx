// import React, { useEffect, useState } from "react";
// import { getFoldersApi } from "../../Api/folderApi";
// import { useNavigate } from "react-router-dom";

// const FolderGrid = () => {
//   const [folders, setFolders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState("grid"); // "grid" | "list"
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFolders = async () => {
//       try {
//         const res = await getFoldersApi();
//         console.log(res.data, "Data");
//         setFolders(res.data.folders || []);
//       } catch (error) {
//         console.error("Error fetching folders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFolders();
//   }, []);

//   const handleFolderClick = (id) => {
//     navigate(`/myfiles/${id}`);
//   };

//   return (
//     <div className="p-6">
//       {/* Header with Toggle */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">📂 My Folders</h2>

//         <div className="space-x-2">
//           <button
//             onClick={() => setView("grid")}
//             className={`px-3 py-1 rounded ${
//               view === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             Grid
//           </button>
//           <button
//             onClick={() => setView("list")}
//             className={`px-3 py-1 rounded ${
//               view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             List
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         // ✅ Skeleton Loader
//         <div
//           className={
//             view === "grid"
//               ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//               : "space-y-3"
//           }
//         >
//           {Array.from({ length: 6 }).map((_, index) => (
//             <div
//               key={index}
//               className="bg-gray-200 animate-pulse rounded-xl p-4 h-24"
//             >
//               <div className="w-10 h-10 bg-gray-300 rounded mb-2"></div>
//               <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//             </div>
//           ))}
//         </div>
//       ) : folders?.length === 0 ? (
//         <p>No folders found.</p>
//       ) : view === "grid" ? (
//         // ✅ Grid View
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {folders?.map((folder) => (
//             <div
//               key={folder._id}
//               onClick={() => handleFolderClick(folder._id)}
//               className="bg-white border rounded-xl p-4 shadow hover:shadow-lg cursor-pointer transition"
//             >
//               <div className="text-4xl mb-2">📁</div>
//               <h3 className="text-lg font-semibold">{folder.name}</h3>
//             </div>
//           ))}
//         </div>
//       ) : (
//         // ✅ List View
//         <div className="divide-y border rounded-lg bg-white">
//           {folders?.map((folder) => (
//             <div
//               key={folder._id}
//               onClick={() => handleFolderClick(folder._id)}
//               className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition"
//             >
//               <div className="flex items-center space-x-3">
//                 <span className="text-3xl">📁</span>
//                 <h3 className="text-lg font-medium">{folder.name}</h3>
//               </div>
//               <span className="text-sm text-gray-500">
//                 {new Date(folder.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FolderGrid;

// src/components/FolderGrid/FolderGrid.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, List } from "lucide-react"; // icons
import {
  getFoldersApi,
  renameFolderApi,
  softDeleteFolderApi,
} from "../../Api/folderApi";
import noFolderData from "../../assets/noFolders.png";
import NoRecords from "../NoRecords/NoRecords";

const FolderGrid = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [newName, setNewName] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const menuRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await getFoldersApi();
      // Filter out folders that are deleted
      const activeFolders = (res.data.folders || []).filter((f) => !f.deleted);
      setFolders(activeFolders);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
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

  const handleRename = async (id) => {
    if (!newName.trim()) return;
    try {
      await renameFolderApi(id, newName);
      setRenameId(null);
      setNewName("");
      fetchFolders();
    } catch (err) {
      console.error("Error renaming folder:", err);
    }
  };

  // ✅ Soft delete (move to Bin)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to move this folder to Bin?"))
      return;
    try {
      await softDeleteFolderApi(id);
      fetchFolders();
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  // ⚠️ Permanent delete (only use in Bin page)
  // const handlePermanentDelete = async (id) => {
  //   if (
  //     !window.confirm("⚠️ This will permanently delete the folder. Continue?")
  //   )
  //     return;
  //   try {
  //     await permanentDeleteFolderApi(id);
  //     fetchFolders();
  //   } catch (err) {
  //     console.error("Error permanently deleting folder:", err);
  //   }
  // };

  // ♻️ Restore (only use in Bin page)
  // const handleRestore = async (id) => {
  //   try {
  //     await restoreFolderApi(id);
  //     fetchFolders();
  //   } catch (err) {
  //     console.error("Error restoring folder:", err);
  //   }
  // };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Folders</h2>
      </div>
      <div className="flex justify-end space-x-2 py-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded ${
            viewMode === "grid"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <Grid size={18} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded ${
            viewMode === "list"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <List size={18} />
        </button>
      </div>
      {loading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-xl p-4 h-24"
            />
          ))}
        </div>
      ) : folders?.length === 0 ? (
        <NoRecords src={noFolderData} message={"This folder is empty."} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <FolderCard
              key={folder._id}
              folder={folder}
              onNavigate={() =>
                navigate(`/myfiles/${folder._id}`, {
                  state: { rowState: folder },
                })
              }
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              menuRef={menuRef}
              renameId={renameId}
              setRenameId={setRenameId}
              newName={newName}
              setNewName={setNewName}
              handleRename={handleRename}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {folders.map((folder) => (
            <FolderCard
              key={folder._id}
              folder={folder}
              onNavigate={() =>
                navigate(`/myfiles/${folder._id}`, {
                  state: { rowState: folder },
                })
              }
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              menuRef={menuRef}
              renameId={renameId}
              setRenameId={setRenameId}
              newName={newName}
              setNewName={setNewName}
              handleRename={handleRename}
              handleDelete={handleDelete}
              listView
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FolderCard = ({
  folder,
  onNavigate,
  menuOpen,
  setMenuOpen,
  menuRef,
  renameId,
  setRenameId,
  newName,
  setNewName,
  handleRename,
  handleDelete,
  listView = false,
}) => {
  return (
    <div
      className={`bg-white border rounded-xl p-4 shadow hover:shadow-lg transition relative ${
        listView ? "flex items-center justify-between" : ""
      }`}
    >
      <div
        className={`cursor-pointer flex-1 ${
          listView ? "flex items-center space-x-4" : ""
        }`}
        onClick={onNavigate}
      >
        <div className="text-4xl">📁</div>

        {renameId === folder._id ? (
          <div
            className="flex items-center space-x-2 flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Enter new name"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRename(folder._id);
              }}
              className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRenameId(null);
                setNewName("");
              }}
              className="text-sm px-2 py-1 bg-gray-300 text-black rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <h3 className="text-lg font-semibold truncate">{folder.name}</h3>
        )}
      </div>

      {/* 3-dot menu */}
      <div
        className="absolute top-2 right-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(menuOpen === folder._id ? null : folder._id);
        }}
      >
        ⋮
      </div>

      {menuOpen === folder._id && (
        <div
          ref={menuRef}
          className="absolute top-8 right-2 bg-white border rounded shadow-md w-28 z-10"
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setRenameId(folder._id);
              setNewName(folder.name);
              setMenuOpen(null);
            }}
          >
            Rename
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(folder._id);
              setMenuOpen(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderGrid;
