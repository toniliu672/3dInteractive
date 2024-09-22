import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseButton from './CloseButton';
import Loading from './Loading';

interface ChatBoxProps {
  show: boolean;
  onClose: () => void;
  content: string;
  isLoading: boolean;
  currentTopology: 'bus' | 'ring';
}

export default function ChatBox({ show, onClose, content, isLoading, currentTopology }: ChatBoxProps) {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    if (content) {
      setLocalContent(content);
    }
  }, [content, currentTopology]);

  // Ensure content is not undefined or null
  const validContent = localContent || "";

  // Split content into different sections based on empty lines
  const sections = validContent.split('\n\n');

  // Extract relevant sections
  const title = sections[0] || "Memuat";
  const description = sections[1] || "";

  // Split advantages and disadvantages based on keywords
  const advantagesSection = sections.find(section => section.startsWith("Kelebihan:"));
  const disadvantagesSection = sections.find(section => section.startsWith("Kekurangan:"));

  const advantages = advantagesSection 
    ? advantagesSection.split('\n').slice(1).map((adv, _index) => adv.trim()) 
    : [];

  const disadvantages = disadvantagesSection 
    ? disadvantagesSection.split('\n').slice(1).map((disadv, _index) => disadv.trim()) 
    : [];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed md:top-48 md:bottom-48 bottom-0 right-0 m-4 w-80 max-h-72 md:max-h-96 md:w-1/4 bg-white rounded-lg shadow-lg overflow-x-hidden z-50"
        >
          <motion.div
            className="bg-gray-100 p-4 flex justify-between items-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <CloseButton onClick={onClose} />
          </motion.div>

          <motion.div
            className="p-4 overflow-y-auto"
            style={{ maxHeight: 'calc(100% - 4rem)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <Loading message="Mengambil data..." className="h-32" />
            ) : (
              <>
                <p className="text-gray-600 mb-4 text-xl">{description}</p>
                {advantages.length > 0 && (
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className=" text-2xl font-semibold text-gray-700 mb-2">Kelebihan:</h3>
                    <ul className="space-y-2">
                      {advantages.map((adv, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start text-gray-600 text-xl"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <span className="text-green-500 mr-2">•</span>
                          {adv}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {disadvantages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="font-semibold text-gray-700 mb-2 text-2xl">Kekurangan:</h3>
                    <ul className="space-y-2">
                      {disadvantages.map((disadv, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start text-gray-600 text-xl"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <span className="text-red-500 mr-2">•</span>
                          {disadv}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}