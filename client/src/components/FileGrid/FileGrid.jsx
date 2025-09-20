// import { useState, useRef, useEffect } from "react";
// import {
//   FileIcon,
//   ImageIcon,
//   FileText,
//   MoreVertical,
//   Download,
//   Trash2,
// } from "lucide-react";

// const FileGrid = ({ files, onDownload, onDelete }) => {
//   const [filter, setFilter] = useState("all");
//   const [menuOpen, setMenuOpen] = useState(null);
//   const menuRef = useRef(null);

//   const filteredFiles = files.filter((file) => {
//     if (filter === "all") return true;
//     if (filter === "images") return file.mimetype.startsWith("image/");
//     if (filter === "pdf") return file.mimetype === "application/pdf";
//     if (filter === "docs") return file.mimetype.includes("word");
//     return true;
//   });

//   const getFileIcon = (mimetype) => {
//     if (mimetype.startsWith("image/"))
//       return <ImageIcon size={48} className="text-[#94A3B8]" />;
//     if (mimetype === "application/pdf")
//       return <FileText size={48} className="text-red-500" />;
//     if (mimetype.includes("word"))
//       return <FileText size={48} className="text-blue-700" />;
//     return <FileIcon size={48} className="text-gray-500" />;
//   };

//   // Close popup when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setMenuOpen(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="mt-4">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-2">
//         <h2 className="text-lg font-semibold">Recent Files</h2>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border p-1 rounded text-sm"
//         >
//           <option value="all">All</option>
//           <option value="images">Images</option>
//           <option value="pdf">PDFs</option>
//           <option value="docs">Docs</option>
//         </select>
//       </div>

//       {/* Scrollable row */}
//       <div className="overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
//         <div className="flex gap-4">
//           {filteredFiles.length > 0 ? (
//             filteredFiles.map((file) => (
//               <div
//                 key={file._id}
//                 className="relative min-w-[200px] bg-white rounded-xl shadow-md hover:shadow-lg transition border-2 border-[#E2E8F0]"
//               >
//                 <div className="p-4 grid place-content-center place-items-center border-b-2 border-[#E2E8F0] bg-[#F8FAFC]  rounded-t-xl">
//                   {getFileIcon(file.mimetype)}
//                 </div>

//                 <div className="flex justify-between px-4 py-2 ">
//                   <div>
//                     <p className="truncate text-sm font-medium max-w-[150px]">
//                       {file.originalName}
//                     </p>
//                     <span className="text-xs text-gray-500">
//                       {file.mimetype}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() =>
//                       setMenuOpen(menuOpen === file._id ? null : file._id)
//                     }
//                     className="p-1 rounded hover:bg-gray-100 absolute right-0"
//                   >
//                     <MoreVertical size={18} />
//                   </button>
//                 </div>

//                 {/* Popup Menu */}
//                 {menuOpen === file._id && (
//                   <div
//                     ref={menuRef}
//                     className="absolute top-12 right-4 bg-white border rounded-lg shadow-md py-1 w-32 z-10"
//                   >
//                     <button
//                       onClick={() => {
//                         onDownload(file);
//                         setMenuOpen(null); // close after download
//                       }}
//                       className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
//                     >
//                       <Download size={16} /> Download
//                     </button>
//                     <button
//                       onClick={() => {
//                         onDelete(file);
//                         setMenuOpen(null); // close after delete
//                       }}
//                       className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
//                     >
//                       <Trash2 size={16} /> Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-sm">No files found</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileGrid;

import { useState, useRef, useEffect } from "react";
import {
  FileIcon,
  ImageIcon,
  FileText,
  MoreVertical,
  Download,
  Trash2,
} from "lucide-react";

const FileGrid = ({ files, onDownload, onDelete }) => {
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  const filteredFiles = files.filter((file) => {
    if (filter === "all") return true;
    if (filter === "images") return file.mimetype.startsWith("image/");
    if (filter === "pdf") return file.mimetype === "application/pdf";
    if (filter === "docs") return file.mimetype.includes("word");
    return true;
  });

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith("image/"))
      return <ImageIcon size={48} className="text-[#94A3B8]" />;
    if (mimetype === "application/pdf")
      return <FileText size={48} className="text-red-500" />;
    if (mimetype.includes("word"))
      return <FileText size={48} className="text-blue-700" />;
    return <FileIcon size={48} className="text-gray-500" />;
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
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Recent Files</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-1 rounded text-sm"
        >
          <option value="all">All</option>
          <option value="images">Images</option>
          <option value="pdf">PDFs</option>
          <option value="docs">Docs</option>
        </select>
      </div>

      {/* Scrollable row */}
      <div className="overflow-x-auto pb-3">
        <div className="flex flex-nowrap gap-4 min-w-max">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                key={file._id}
                className="relative min-w-[200px] bg-white rounded-xl shadow-md hover:shadow-lg transition border-2 border-[#E2E8F0]"
              >
                <div className="p-4 grid place-content-center place-items-center border-b-2 border-[#E2E8F0] bg-[#F8FAFC] rounded-t-xl">
                  {getFileIcon(file.mimetype)}
                </div>

                <div className="flex justify-between px-4 py-2">
                  <div>
                    <p className="truncate text-sm font-medium max-w-[150px]">
                      {file.originalName}
                    </p>
                    <span className="text-xs text-gray-500">
                      {file.mimetype}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === file._id ? null : file._id)
                    }
                    className="p-1 rounded hover:bg-gray-100 absolute right-0"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Popup Menu */}
                {menuOpen === file._id && (
                  <div
                    ref={menuRef}
                    className="absolute top-12 right-4 bg-white border rounded-lg shadow-md py-1 w-32 z-10"
                  >
                    <button
                      onClick={() => {
                        onDownload(file);
                        setMenuOpen(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      <Download size={16} /> Download
                    </button>
                    <button
                      onClick={() => {
                        onDelete(file);
                        setMenuOpen(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No files found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileGrid;
