import React from 'react';
import CloseButton from './CloseButton';

interface ChatBoxOSIProps {
  show: boolean;
  onClose: () => void;
  content: { title: string, description: string };
}

const ChatBoxOSI: React.FC<ChatBoxOSIProps> = ({ show, onClose, content }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 w-80 max-w-full max-h-full md:max-h-[50vh] bg-white p-6 rounded-lg shadow-lg overflow-y-auto z-50">
      <CloseButton onClick={onClose} />
      <div className="mt-4 text-justify text-gray-800 leading-relaxed">
        <h2 className="text-xl font-bold mb-4">{content.title}</h2>
        <p className="mb-4">{content.description}</p>
      </div>
    </div>
  );
};

export default ChatBoxOSI;
