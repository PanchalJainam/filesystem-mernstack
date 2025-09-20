import React, { useEffect, useState } from "react";
import FileTable from "../components/FileTable/FileTable";
import { deleteFile, getFiles, restoreFile } from "../Api/fileApi";
import FolderBin from "./FolderBin";
import ConfirmationModal from "../components/ConfirmationModal/ConfirmationModal";
import { toast } from "react-hot-toast";

const BinPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [actionType, setActionType] = useState(""); // 'delete' or 'restore'

  const fetchBinFiles = async () => {
    try {
      setLoading(true);
      const res = await getFiles(null, true); // bin=true
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("❌ Error fetching bin files:", err);
      toast.error("Failed to fetch bin files ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBinFiles();
  }, []);

  const handleAction = async () => {
    if (!selectedFile) return;

    try {
      if (actionType === "restore") {
        await restoreFile(selectedFile._id);
        toast.success("File restored successfully ✅");
      } else if (actionType === "delete") {
        await deleteFile(selectedFile._id, true); // permanent delete
        toast.success("File deleted permanently ✅");
      }
      setShowConfirm(false);
      setSelectedFile(null);
      fetchBinFiles(); // refresh files
    } catch (err) {
      console.error("❌ Action failed:", err);
      toast.error("Action failed ❌");
    }
  };

  const openConfirm = (file, type) => {
    setSelectedFile(file);
    setActionType(type);
    setShowConfirm(true);
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">🗑 Bin</h2>
        <FileTable
          files={files}
          loading={loading}
          onRowAction={(file, action) => {
            openConfirm(file, action);
          }}
          isBin={true} // tells FileTable to render Restore + Permanent Delete
        />
      </div>
      <FolderBin />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        title={
          actionType === "delete"
            ? "Confirm Permanent Delete"
            : "Confirm Restore"
        }
        message={
          actionType === "delete"
            ? "Are you sure you want to permanently delete this file?"
            : "Are you sure you want to restore this file?"
        }
        onConfirm={handleAction}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedFile(null);
        }}
      />
    </>
  );
};

export default BinPage;

