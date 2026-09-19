import React, { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import Auth from "../pages/Auth";

const AuthModel = ({ onclose }) => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onclose();
    }
  }, [userData, onclose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onclose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition z-10 cursor-pointer p-1"
          aria-label="Close"
        >
          <FaTimesCircle size={20} />
        </button>

        <Auth isModal={true} onSuccess={onclose} />
      </div>
    </div>
  );
};

export default AuthModel;
