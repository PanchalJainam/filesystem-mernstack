import API from "./authApi";

// Upload file (multipart/form-data) with optional folderId
export const uploadFile = (formData, folderId = null) => {
  if (folderId) {
    formData.append("folderId", folderId); // attach folderId to FormData
  }
  return API.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get files, optionally filtered by folderId
export const getFiles = (folderId = null, bin = false) => {
  let url = folderId ? `/files/allfiles/${folderId}` : "/files/allfiles";
  if (bin) url += "?bin=true";
  return API.get(url);
};

// Delete file
export const deleteFile = (id) => API.delete(`/files/delete/${id}`);

export const deleteFilePermanently = (id) =>
  API.delete(`/files/delete/${id}?permanent=true`);

// Update file (rename
export const updateFile = (id, newName) =>
  API.put(`/files/update/${id}`, { name: newName });

// Restore a soft-deleted file from Bin
export const restoreFile = (id) => API.put(`/files/restore/${id}`);
