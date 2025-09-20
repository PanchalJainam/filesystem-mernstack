import React, { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FileDrawer = ({ file, onClose }) => {
  const drawerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const isImage = file.mimetype.startsWith("image/");
  const isPDF = file.mimetype === "application/pdf";

  // Close drawer if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Fake loading delay (can be removed if you want to load instantly)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [file]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40">
      <div
        ref={drawerRef}
        className="h-full w-80 bg-white shadow-lg overflow-auto transition-transform transform"
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b">
          {loading ? (
            <Skeleton width={150} height={20} />
          ) : (
            <h2 className="truncate max-w-[250px] inline-block font-semibold text-lg">
              {file.originalName}
            </h2>
          )}
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Content */}
        <div className="px-2">
          {/* File preview */}
          <div className="mb-4 flex justify-center items-center">
            {loading ? (
              <Skeleton height={150} width={200} />
            ) : isImage ? (
              <img
                src={file.url}
                alt={file.originalName}
                className="w-full h-auto rounded"
              />
            ) : isPDF ? (
              <div className="flex flex-col items-center space-y-2 py-6">
                <div className="w-16 h-16 flex items-center justify-center bg-red-100 text-red-600 font-bold text-lg rounded">
                  PDF
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Open PDF
                </a>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No preview available for this file type
              </p>
            )}
          </div>

          {/* File details */}
          <div className="text-sm space-y-2">
            {loading ? (
              <>
                <Skeleton width={200} height={15} />
                <Skeleton width={180} height={15} />
                <Skeleton width={160} height={15} />
                <Skeleton width={220} height={15} />
              </>
            ) : (
              <>
                <p>
                  <strong>File Name:</strong>
                  <span
                    className="truncate max-w-[250px] inline-block"
                    title={file.originalName}
                  >
                    {file.originalName}
                  </span>
                </p>
                <p>
                  <strong>Type:</strong> {file.mimetype}
                </p>
                <p>
                  <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                </p>
                <p>
                  <strong>Uploaded At:</strong>{" "}
                  {new Date(file.createdAt).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDrawer;
