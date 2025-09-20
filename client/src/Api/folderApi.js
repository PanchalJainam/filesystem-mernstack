// // api/folderApi.js

// import API from "./authApi";

// export const createFolderApi = (folderData) =>
//   API.post("/folder/create", folderData);

// export const getFoldersApi = async () => {
//   return await API.get("/folder");
// };

// export const getFilesByFolder = async (folderId) => {
//   return await API.get(`/folder/${folderId}`);
// };

// export const renameFolderApi = (id, newName) =>
//   API.put(`/folder/${id}`, { name: newName });

// export const deleteFolderApi = (id) => API.delete(`/folder/${id}`);

// api/folderApi.js
import API from "./authApi";

// Create a new folder
export const createFolderApi = (folderData) =>
  API.post("/folder/create", folderData);

// Get all folders
export const getFoldersApi = () => API.get("/folder");

// Get single folder
export const getFilesByFolder = (folderId) => API.get(`/folder/${folderId}`);

// Rename folder
export const renameFolderApi = (id, newName) =>
  API.put(`/folder/${id}`, { name: newName });

// Soft delete folder (move to Bin)
export const softDeleteFolderApi = (id) =>
  API.delete(`/folder/${id}?permanent=false`);

// Permanent delete folder
export const permanentDeleteFolderApi = (id) =>
  API.delete(`/folder/${id}?permanent=true`);

// Restore folder (⚠️ use PUT not PATCH)
export const restoreFolderApi = (id) => API.put(`/folder/restore/${id}`);

// Get deleted folders (Bin)
export const getDeletedFoldersApi = () => API.get("/folder/bin");
