import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="absolute top-4 right-4 text-gray-500 hover:text-black focus:outline-none"
      aria-label="Close"
    >
      ✕
    </button>
  );
}

export default CloseButton;
