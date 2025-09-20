import React from "react";

const NoRecords = ({ message = "No Records Found", src }) => {
  return (
    <div className="flex flex-col items-center justify-center py-5">
      {/* Example SVG */}
      <img
        src={src}
        alt="Not Found"
        className="h-60 w-96 mb-6 object-contain"
      />

      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default NoRecords;
