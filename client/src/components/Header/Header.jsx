import React from "react";
import avtar from "../../assets/avtar.png"; // adjust path
import { useState } from "react";
import { useRef } from "react";

const Header = ({ title }) => {
  const [openPopup, setOpenPopup] = useState(false);

  const popupRef = useRef(null);

  return (
    <div className="lg:flex px-4 py-4 items-center justify-between gap-2 border-b-2 border-[#E2E8F0]">
      {/* Left side */}
      <div className="flex flex-col lg:px-4 gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <ul className="text-sm text-gray-600 lg:flex space-x-2 hidden">
          <li>Items</li>
          <li>Total</li>
        </ul>
      </div>

      {/* Right side */}
      <div className="flex items-center lg:justify-between lg:space-x-4 gap-2">
        <div className="flex items-center bg-white border-2 rounded-full py-1 px-3 w-52 lg:w-72">
          <i className="ri-search-line text-gray-500"></i>
          <input
            className="flex-1 bg-transparent focus:outline-none px-2 w-20 lg:w-full"
            type="text"
            placeholder="Search in drive"
          />
          <i className="ri-equalizer-2-line text-gray-500 cursor-pointer"></i>
        </div>

        <div className="flex lg:justify-between lg:items-center space-x-2 text-xl relative">
          <div className="bg-white w-8 h-8 border-2 border-[#CBD5E1] flex items-center justify-center rounded-full p-2">
            <i className="ri-settings-4-line"></i>
          </div>

          <div
            className="bg-white w-8 h-8 border-2 border-[#CBD5E1] flex items-center justify-center rounded-full p-2 cursor-pointer"
            onClick={() => setOpenPopup(!openPopup)}
          >
            <i className="ri-add-line"></i>
          </div>

          {openPopup && (
            <div
              ref={popupRef}
              className="absolute top-12 right-10 bg-white border border-gray-300 rounded-lg shadow-lg w-40 py-2 z-50"
            >
              <button className="w-full text-left text-sm px-4 py-2 hover:bg-[#F8FAFC]">
                <i className="ri-folder-add-line text-[16px]"></i> New File
              </button>
              <button
                className="w-full text-left text-sm px-4 py-2 hover:bg-[#F8FAFC]"
                onClick={() => {
                  // handleUploadClick();
                  setOpenPopup(false);
                }}
              >
                <i className="ri-folder-upload-line text-[16px]"></i> Upload
                File
              </button>
            </div>
          )}

          <div>
            <img
              className="bg-white flex items-center justify-center w-8 h-8 rounded-full"
              src={avtar}
              alt="user_profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
