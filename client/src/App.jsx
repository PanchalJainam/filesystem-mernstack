import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";
import Settings from "./pages/Settings";
import FolderView from "./pages/FolderView";
import FolderGrid from "./components/FolderGrid/FolderGrid";
import BinPage from "./pages/BinPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/myfiles/:folderId" element={<FolderView />} />
            <Route path="/myfiles" element={<FolderGrid />} />
            <Route path="/bin" element={<BinPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
