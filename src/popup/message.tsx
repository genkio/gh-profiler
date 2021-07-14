import React from "react";

interface IProps {
  message: string;
  onClose: () => void;
}

export const Message: React.FC<IProps> = ({ message, onClose }) => (
  <div className="flex justify-center items-center font-medium py-2 px-4 bg-red-400 text-white">
    <div className="max-w-full flex-initial font-normal text-md">{message}</div>
    <div className="flex flex-auto flex-row-reverse" onClick={onClose}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-x cursor-pointer hover:text-red-800 rounded-full w-5 h-5 ml-2"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  </div>
);
