import { createSlice } from "@reduxjs/toolkit";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const calculateTotalSize = (files) =>
  files.reduce((acc, file) => acc + (file.size || 0), 0);

const initialState = {
  files: [],
  recentFiles: [],
  itemsCount: 0,
  totalSize: 0,
  formattedSize: "0 Bytes",
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.files.push(action.payload);
      state.itemsCount = state.files.length;
      state.totalSize = calculateTotalSize(state.files);
      state.formattedSize = formatBytes(state.totalSize);
    },
    removeFile: (state, action) => {
      const fileId = action.payload;
      state.files = state.files.filter((file) => file._id !== fileId);

      state.recentFiles = state.recentFiles.filter(
        (file) => file._id !== fileId
      );

      state.itemsCount = state.files.length;
      state.totalSize = calculateTotalSize(state.files);
      state.formattedSize = formatBytes(state.totalSize);
    },
    setFiles: (state, action) => {
      state.files = action.payload;
      state.itemsCount = action.payload.length || 0;
      state.totalSize = calculateTotalSize(action.payload);
      state.formattedSize = formatBytes(state.totalSize);
    },
    addToRecentFiles: (state, action) => {
      const file = action.payload;

      if (!Array.isArray(state.recentFiles)) state.recentFiles = [];

      // Remove file if it already exists (by id) to avoid duplicates
      state.recentFiles = state.recentFiles.filter((f) => f._id !== file._id);

      // Add the new file at the start (most recent first)
      state.recentFiles.unshift(file);

      // Keep only the last 5 files
      if (state.recentFiles.length > 5) {
        state.recentFiles = state.recentFiles.slice(0, 5);
      }
    },
    clearFiles: (state) => {
      state.files = [];
      state.recentFiles = [];
      state.itemsCount = 0;
      state.totalSize = 0;
      state.formattedSize = "0 Bytes";
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addFile,
  addToRecentFiles,
  restorePreviousRecentFiles,
  setFiles,
  clearFiles,
  setLoading,
  setError,
  removeFile,
} = fileSlice.actions;

export default fileSlice.reducer;
