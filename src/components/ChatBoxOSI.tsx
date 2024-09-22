import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseButton from './CloseButton';

interface ChatBoxOSIProps {
  show: boolean;
  onClose: () => void;
  content: { title: string; description: string };
}

const ChatBoxOSI: React.FC<ChatBoxOSIProps> = ({ show, onClose, content }) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 w-full h-1/2 md:top-4 md:right-4 md:w-80 md:max-w-full md:max-h-[50vh] bg-white rounded-t-lg md:rounded-lg shadow-lg overflow-hidden z-50"
        >
          <motion.div
            className="bg-gray-100 p-4 flex justify-between items-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-800">{localContent.title}</h3>
            <CloseButton onClick={onClose} />
          </motion.div>

          <motion.div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: 'calc(100% - 4rem)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.p
              className="text-justify text-gray-800 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {localContent.description}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBoxOSI;