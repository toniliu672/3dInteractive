import CloseButton from './CloseButton';

interface ChatBoxProps {
  show: boolean;
  onClose: () => void;
  content: string;
}

export default function ChatBox({ show, onClose, content }: ChatBoxProps) {
  if (!show) return null;

  // Ensure content is not undefined or null
  const validContent = content || "";

  // Split content into different sections based on empty lines
  const sections = validContent.split('\n\n');

  // Extract relevant sections
  const title = sections[0] || "Judul Tidak Ditemukan";
  const description = sections[1] || "";

  // Split advantages and disadvantages based on keywords
  const advantagesSection = sections.find(section => section.startsWith("Kelebihan:"));
  const disadvantagesSection = sections.find(section => section.startsWith("Kekurangan:"));

  const advantages = advantagesSection 
    ? advantagesSection.split('\n').slice(1).map((adv, index) => <li key={index}>{adv.trim()}</li>) 
    : [];

  const disadvantages = disadvantagesSection 
    ? disadvantagesSection.split('\n').slice(1).map((disadv, index) => <li key={index}>{disadv.trim()}</li>) 
    : [];

  return (
    <div className="fixed md:top-48 md:bottom-48 bottom-0 right-0 m-4 w-80 max-h-48 md:max-h-96 h-auto bg-white p-4 rounded-lg shadow-lg overflow-y-auto z-50">
      <CloseButton onClick={onClose} />
      <div className="text-justify text-gray-800 leading-relaxed">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-4">{description}</p>
        {advantages.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold">Kelebihan:</h4>
            <ul className="list-disc pl-5">{advantages}</ul>
          </div>
        )}
        {disadvantages.length > 0 && (
          <div>
            <h4 className="font-semibold">Kekurangan:</h4>
            <ul className="list-disc pl-5">{disadvantages}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
