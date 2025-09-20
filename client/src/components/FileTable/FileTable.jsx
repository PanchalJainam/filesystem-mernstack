import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Edit2, Trash2, Save, X } from "lucide-react";
import noData from "../../assets/noData.png";
import {
  updateFile,
  deleteFile,
  getFiles,
  restoreFile,
  deleteFilePermanently,
} from "../../Api/fileApi";
import { setError, setFiles, setLoading } from "../../redux/slice/fileSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import NoRecords from "../NoRecords/NoRecords";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { toast } from "react-hot-toast";

const FileTable = ({ files, onRowClick, loading, isBin = false }) => {
  const { folderId } = useParams();
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  const fetchFiles = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await (folderId ? getFiles(folderId) : getFiles());
      dispatch(setFiles(data?.files || []));
    } catch (err) {
      dispatch(setError("Failed to fetch files"));
      console.error(err);
      toast.error("Failed to fetch files ❌");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = async (file) => {
    if (!newName.trim()) return;
    try {
      await updateFile(file._id, newName);
      setEditingId(null);
      setNewName("");
      fetchFiles();
      toast.success("File renamed successfully ✅");
    } catch (err) {
      console.error("Error renaming file:", err);
      toast.error("Failed to rename file ❌");
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    try {
      await (isBin
        ? deleteFilePermanently(selectedFile._id)
        : deleteFile(selectedFile._id));
      setSelectedFile(null);
      setShowConfirm(false);
      fetchFiles();
      toast.success("File deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting file:", err);
      toast.error("Failed to delete file ❌");
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreFile(id);
      fetchFiles();
      toast.success("File restored successfully ✅");
    } catch (err) {
      console.error("Error restoring file:", err);
      toast.error("Failed to restore file ❌");
    }
  };

  if (loading) {
    return (
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse rounded">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-2 font-semibold">File Name</th>
              <th className="p-2 font-semibold">Size</th>
              <th className="p-2 font-semibold">Type</th>
              <th className="p-2 font-semibold">Uploaded At</th>
              <th className="p-2 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array(5)
              .fill()
              .map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 text-sm">
                    <Skeleton width={120} />
                  </td>
                  <td className="p-2 text-sm">
                    <Skeleton width={60} />
                  </td>
                  <td className="p-2 text-sm">
                    <Skeleton width={80} />
                  </td>
                  <td className="p-2 text-sm">
                    <Skeleton width={140} />
                  </td>
                  <td className="p-2 text-sm text-center">
                    <Skeleton width={50} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <NoRecords
        src={noData}
        message={isBin ? "No Files in Bin" : "No Files Found"}
      />
    );
  }

  return (
    <div className="mt-5 overflow-x-auto">
      <h2 className="text-sm font-semibold mb-4">
        {isBin ? "Bin" : "All Files"}
      </h2>
      <table className="w-full border-collapse rounded">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="p-2 font-semibold">File Name</th>
            <th className="p-2 font-semibold">Size</th>
            <th className="p-2 font-semibold">Type</th>
            <th className="p-2 font-semibold">Uploaded At</th>
            <th className="p-2 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file._id}
              className="border-t hover:bg-gray-50 cursor-pointer"
            >
              <td
                className="p-2 text-sm"
                onClick={() => !isBin && onRowClick(file)}
              >
                {editingId === file._id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  file.originalName
                )}
              </td>
              <td className="p-2 text-sm">
                {(file.size / 1024).toFixed(2)} KB
              </td>
              <td className="p-2 text-sm">{file.mimetype}</td>
              <td className="p-2 text-sm">
                {new Date(file.createdAt).toLocaleString()}
              </td>
              <td className="p-2 text-sm text-center flex justify-center space-x-3">
                {isBin ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(file._id);
                      }}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        setShowConfirm(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : editingId === file._id ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(file);
                      }}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                        setNewName("");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(file._id);
                        setNewName(file.originalName);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                        setShowConfirm(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this file?"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedFile(null);
        }}
      />
    </div>
  );
};

export default FileTable;
