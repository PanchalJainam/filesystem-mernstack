// // src/components/Layout/Layout.jsx
// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import NewSidebar from "../Sidebar/NewSidebar";
// import avtar from "../../assets/avtar.png";
// import { useSelector } from "react-redux";
// import { Menu } from "lucide-react";

// const Layout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user } = useSelector((state) => state.auth);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <NewSidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         user={{
//           email: user?.email || "Guest",
//           avatar: avtar,
//         }}
//         usedStorage={0} // you can pass real storage later
//       />

//       {/* Overlay for mobile */}

//       {/* Main Content */}
//       <div className="relative">
//         <div className="absolute top-4 left-4">
//           <button
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-200"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu size={24} />
//           </button>
//         </div>
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NewSidebar from "../Sidebar/NewSidebar";
import avtar from "../../assets/avtar.png";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const files = useSelector((state) => state.files.files);

  const sidebarRef = useRef(null);

  const usedStorage =
    files?.reduce((acc, file) => acc + (file.size || 0), 0) || 0;

  // 🔹 Close sidebar if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <NewSidebar
        ref={sidebarRef} // 🔹 attach ref
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={{
          email: user?.email || "Guest",
          avatar: user?.avatar || avtar,
        }}
        usedStorage={usedStorage}
        closeSidebar={() => setSidebarOpen(false)} // 🔹 pass close function to sidebar
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="relative flex-1 overflow-auto">
        <div className="absolute top-3 right-3">
          <button
            className="sm:hidden md:hidden lg:hidden p-2 rounded-lg hover:bg-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
