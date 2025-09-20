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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* All routes with sidebar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/myfiles/:folderId" element={<FolderView />} />
          <Route path="/myfiles" element={<FolderGrid />} />
          <Route path="/bin" element={<BinPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
