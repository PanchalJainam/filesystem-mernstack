// import { useState, useEffect, useRef } from "react";
// import { uploadFile } from "../../Api/fileApi";

// const FileUploadModal = ({ isOpen, onClose, onSuccess }) => {
//   const [file, setFile] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const modalRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (modalRef.current && !modalRef.current.contains(e.target)) {
//         handleClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length > 0) {
//       setFile(selectedFiles);
//       setError("");
//     }
//   };

//   // const handleUpload = async (e) => {
//   //   e.preventDefault();
//   //   if (!file) {
//   //     setError("⚠️ Please select a file before uploading.");
//   //     return;
//   //   }

//   //   const formData = new FormData();
//   //   for (let i = 0; i < e.target.files.length; i++) {
//   //     formData.append("files", e.target.files[i]); // must match .array("files")
//   //   }

//   //   try {
//   //     setLoading(true);
//   //     await uploadFile(formData);
//   //     setLoading(false);
//   //     setFile(null);
//   //     setError("");
//   //     onSuccess();
//   //     handleClose();
//   //   } catch (err) {
//   //     console.error(err);
//   //     setLoading(false);
//   //     setError("❌ File upload failed. Please try again.");
//   //   }
//   // };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (file.length === 0) {
//       setError("⚠️ Please select at least one file before uploading.");
//       return;
//     }

//     const formData = new FormData();
//     file.forEach((file) => formData.append("files", file)); // must match .array("files")

//     try {
//       setLoading(true);
//       await uploadFile(formData);
//       setLoading(false);
//       setFile([]);
//       setError("");
//       onSuccess();
//       handleClose();
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//       setError("❌ File upload failed. Please try again.");
//     }
//   };

//   const handleClose = () => {
//     setFile([]);
//     setError("");
//     setLoading(false);
//     onClose();
//   };

//   // ✅ Render null in JSX instead of returning before hooks
//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div
//         ref={modalRef}
//         className="bg-white p-6 rounded-2xl shadow-xl w-[400px]"
//       >
//         <h2 className="text-[18px] font-semibold mb-4 text-gray-800">
//           Upload File
//         </h2>

//         <form onSubmit={handleUpload} className="flex flex-col gap-4">
//           {/* Upload Box */}
//           <label
//             htmlFor="file-upload"
//             className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#4F46E5] hover:bg-blue-50 transition"
//           >
//             <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-2"></i>
//             {/* <p className="text-gray-600">
//               {file ? (
//                 <span className="text-blue-600 font-medium">{file.name}</span>
//               ) : (
//                 <>
//                   <span className="font-medium text-[#4F46E5]">
//                     Click to upload
//                   </span>{" "}
//                   or drag and drop
//                 </>
//               )}
//             </p> */}
//             <p className="text-gray-600">
//               {file.length > 0 ? (
//                 <span className="text-blue-600 font-medium">
//                   {file.length === 1
//                     ? file[0].name
//                     : `${file.length} files selected`}
//                 </span>
//               ) : (
//                 <>
//                   <span className="font-medium text-[#4F46E5]">
//                     Click to upload
//                   </span>{" "}
//                   or drag and drop
//                 </>
//               )}
//             </p>
//             <input
//               id="file-upload"
//               type="file"
//               multiple
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </label>

//           {/* Error */}
//           {error && <p className="text-sm text-red-500">{error}</p>}

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 mt-2">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-[14px]"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4F46E5] transition disabled:opacity-50 text-[14px]"
//             >
//               {loading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FileUploadModal;

import { useState, useEffect, useRef } from "react";
import { uploadFile } from "../../Api/fileApi";

const FileUploadModal = ({ isOpen, onClose, onSuccess, folderId }) => {
  // ✅ folderId prop
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFile(selectedFiles);
      setError("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file.length === 0) {
      setError("⚠️ Please select at least one file before uploading.");
      return;
    }

    const formData = new FormData();
    file.forEach((f) => formData.append("files", f)); // must match backend `.array("files")`
    if (folderId) formData.append("folderId", folderId); // ✅ attach folderId if provided

    try {
      setLoading(true);
      await uploadFile(formData);
      setLoading(false);
      setFile([]);
      setError("");
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("❌ File upload failed. Please try again.");
    }
  };

  const handleClose = () => {
    setFile([]);
    setError("");
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-2xl shadow-xl w-[400px]"
      >
        <h2 className="text-[18px] font-semibold mb-4 text-gray-800">
          Upload File
        </h2>

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#4F46E5] hover:bg-blue-50 transition"
          >
            <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-2"></i>
            <p className="text-gray-600">
              {file.length > 0 ? (
                <span className="text-blue-600 font-medium">
                  {file.length === 1
                    ? file[0].name
                    : `${file.length} files selected`}
                </span>
              ) : (
                <>
                  <span className="font-medium text-[#4F46E5]">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </>
              )}
            </p>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-[14px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4F46E5] transition disabled:opacity-50 text-[14px]"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
