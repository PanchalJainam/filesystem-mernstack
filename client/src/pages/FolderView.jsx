import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FileTable from "../components/FileTable/FileTable";
import FileDrawer from "../components/FileDrawer/FileDrawer";
import FileUploadModal from "../components/FileUploadModal/FileUploadModal"; // ✅ Import

import { setFiles, setLoading, setError } from "../redux/slice/fileSlice";
import { getFiles } from "../Api/fileApi";

const FolderView = () => {
  const { folderId } = useParams();
  const location = useLocation();
  const { rowState } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { files, loading } = useSelector((state) => state.files);

  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchFiles = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await getFiles(folderId);
      dispatch(setFiles(data?.files || []));
    } catch (err) {
      dispatch(setError("Failed to fetch files"));
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (folderId) fetchFiles();
  }, [folderId]);

  const handleRowClick = (file) => {
    setSelectedFile(file);
  };

  const closeDrawer = () => setSelectedFile(null);

  const handleUploadClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setShowUploadModal(true);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] overflow-auto p-4">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => navigate("/myfiles")}
        >
          My Files
        </span>{" "}
        / {rowState?.name}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={handleUploadClick}
          className="px-4 py-2 bg-[#4F46E5] text-white rounded hover:bg-[#4338CA] transition"
        >
          Upload File
        </button>
      </div>

      {/* File Section */}
      <div className="bg-white rounded-lg w-full max-h-screen p-4">
        {/* <FileGrid
          files={recentFiles.slice(0, 5) || []}
          onDelete={() => fetchFiles()}
          onDownload={() => {}}
          loading={loading}
        /> */}
        <FileTable
          files={files || []}
          onRowClick={handleRowClick}
          loading={loading}
        />
        {selectedFile && (
          <FileDrawer file={selectedFile} onClose={closeDrawer} />
        )}
      </div>

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => fetchFiles()}
        folderId={folderId} // ✅ Pass folderId to API for upload
      />
    </div>
  );
};

export default FolderView;
