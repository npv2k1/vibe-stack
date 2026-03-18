import React, { useState } from 'react';
import { Plus, X, MessageSquare, Edit3, Settings } from 'lucide-react';

// Main Floating Action Button (FAB) component
const FloatingActionButton = ({ icon, onClick, bgColor = 'bg-blue-600', hoverBgColor = 'bg-blue-700', tooltip }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex items-center">
      {tooltip && isHovered && (
        <div className="absolute right-full mr-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg whitespace-nowrap">
          {tooltip}
        </div>
      )}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-14 h-14 rounded-full ${bgColor} ${hoverBgColor} text-white flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-110`}
        aria-label={tooltip || 'Floating Action Button'}
      >
        {icon}
      </button>
    </div>
  );
};
export { FloatingActionButton };
