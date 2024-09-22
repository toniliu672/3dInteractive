// components/TextBox.tsx
import React from 'react';

interface TextBoxProps {
  text: string;
  onClose: () => void;
}

const TextBox: React.FC<TextBoxProps> = ({ text, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-gray-800 bg-opacity-90 p-6 rounded-lg w-full max-w-md lg:max-w-lg">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-white focus:outline-none"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="overflow-y-auto max-h-48 text-white">
          <p className='text-xl'>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default TextBox;
