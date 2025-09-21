import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import FileTable from "../components/FileTable/FileTable";
import FileGrid from "../components/FileGrid/FileGrid";
import FileUploadModal from "../components/FileUploadModal/FileUploadModal";
import FileDrawer from "../components/FileDrawer/FileDrawer";
import CreateFolderModal from "../components/CreateFolderModal/CreateFolderModal"; // ✅ Import here

import avtar from "../assets/avtar.png";
import { deleteFile, getFiles } from "../Api/fileApi";
import {
  setFiles,
  setLoading,
  setError,
  addToRecentFiles,
  removeFile,
} from "../redux/slice/fileSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { files, recentFiles, itemsCount, formattedSize, loading } =
    useSelector((state) => state.files);

  const [openPopup, setOpenPopup] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false); // ✅ New folder modal state
  const [selectedFile, setSelectedFile] = useState(null);
  const [recentData, setRecentData] = useState([]);
  const popupRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await getFiles();
      dispatch(setFiles(data?.files || []));
    } catch (err) {
      dispatch(setError("Failed to fetch files"));
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
    }
  }, [token]);

  useEffect(() => {
    if (recentFiles) {
      setRecentData(recentFiles);
    }
  }, [recentFiles]);

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId._id);
      dispatch(removeFile(fileId._id));

      fetchFiles();
      setOpenPopup(false);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      setOpenPopup(false);
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  const handleRowClick = (file) => {
    setSelectedFile(file);
    dispatch(addToRecentFiles(file));
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

  const handleCreateFolder = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setShowFolderModal(true);
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-[#F8FAFC] overflow-auto">
        {/* Header */}
        <div className="lg:flex px-4 py-4 items-center justify-between gap-10 border-b-2 border-[#E2E8F0]">
          <div className="flex flex-col px-4 gap-4 lg:gap-2">
            <h2 className="text-xl font-semibold">My Files</h2>
            <ul className="text-sm text-gray-600 lg:flex space-x-2 hidden">
              <li>{itemsCount}&nbsp;Items</li>
              <li>{formattedSize}&nbsp;Total</li>
            </ul>
          </div>

          <div className="flex items-center mt-3 md:mt-0 lg:mt-0 lg:justify-between lg:space-x-4 gap-2">
            <div className="flex items-center bg-white border-2 rounded-full py-1 px-3 w-52 lg:w-72">
              <i className="ri-search-line text-gray-500"></i>
              <input
                className="flex-1 bg-transparent focus:outline-none px-2 w-20 lg:w-full"
                type="text"
                placeholder="Search in drive"
              />
              <i className="ri-equalizer-2-line text-gray-500 cursor-pointer"></i>
            </div>

            <div className="flex lg:justify-between lg:items-center space-x-2 text-xl relative">
              <div className="bg-white w-8 h-8 border-2 border-[#CBD5E1] flex items-center justify-center rounded-full p-2">
                <i className="ri-settings-4-line"></i>
              </div>

              <div
                className="bg-white w-8 h-8 border-2 border-[#CBD5E1] flex items-center justify-center rounded-full p-2 cursor-pointer"
                onClick={() => setOpenPopup(!openPopup)}
              >
                <i className="ri-add-line"></i>
              </div>

              {openPopup && (
                <div
                  ref={popupRef}
                  className="absolute top-12 right-10 bg-white border border-gray-300 rounded-lg shadow-lg w-40 py-2 z-50"
                >
                  <button
                    className="w-full text-left text-sm px-4 py-2 hover:bg-[#F8FAFC]"
                    onClick={() => {
                      handleCreateFolder(); // ✅ Open CreateFolderModal
                      setOpenPopup(false);
                    }}
                  >
                    <i className="ri-folder-add-line text-[16px]"></i> New
                    Folder
                  </button>
                  <button
                    className="w-full text-left text-sm px-4 py-2 hover:bg-[#F8FAFC]"
                    onClick={() => {
                      handleUploadClick();
                      setOpenPopup(false);
                    }}
                  >
                    <i className="ri-folder-upload-line text-[16px]"></i> Upload
                    File
                  </button>
                </div>
              )}

              <img
                className="bg-white flex items-center justify-center w-8 h-8 rounded-full"
                src={user?.avatar || avtar}
                alt="user_profile"
              />
            </div>
          </div>
        </div>

        {/* File Section */}
        <div className="bg-white rounded-lg w-full max-h-screen p-4">
          <FileGrid
            files={recentData.slice(0, 5) || []}
            onDelete={handleDelete}
            onDownload={handleDownload}
            loading={loading}
          />
          <FileTable
            files={files || []}
            onRowClick={handleRowClick}
            loading={loading}
          />
          {selectedFile && (
            <FileDrawer file={selectedFile} onClose={closeDrawer} />
          )}
        </div>
      </div>
      {/* Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => fetchFiles()}
      />
      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSuccess={() => {
          fetchFiles();
        }}
      />
    </div>
  );
};

export default Home;
