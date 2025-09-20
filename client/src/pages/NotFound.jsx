import React from "react";
import { Link } from "react-router-dom";
import notFound from "../assets/notFoundImage.png"; // make sure path is correct

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      {/* ✅ Image instead of SVG */}
      <img
        src={notFound}
        alt="Not Found"
        className="h-96 w-96 mb-6 object-contain"
      />

      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-gray-500 mb-4">Page Not Found</p>

      <Link
        to="/"
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
