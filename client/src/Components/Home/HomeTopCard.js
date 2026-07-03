import React from "react";

const HomeTopCard = ({ title, description, buttonLabel, color, fileUrl }) => {
  const getButtonStyle = (color) => {
    switch (color) {
      case "green": return "bg-green-500 hover:bg-green-600 focus:ring-green-300";
      case "yellow": return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300";
      case "blue": return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300";
      case "red": return "bg-red-500 hover:bg-red-600 focus:ring-red-300";
      default: return "bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-300";
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border-4 border-black flex flex-col min-h-[200px] transition-all hover:scale-105 hover:shadow-xl">
      <h2 className="text-xl font-bold text-blue-400 mb-1">{title}</h2>
      <div className="flex-1 flex items-center mb-4">
        <p className="text-gray-200 mt-2">{description}</p>
      </div>
      <a href={fileUrl} download className="mt-auto">
        <button
          className={`px-4 py-2 w-full text-white font-semibold rounded-lg transition-all shadow-md focus:ring-2 focus:outline-none ${getButtonStyle(color)}`}
        >
          {buttonLabel}
        </button>
      </a>
    </div>
  );
};

export default HomeTopCard;
