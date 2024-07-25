interface ResetButtonProps {
    onClick: () => void;
  }
  
  const ResetButton = ({ onClick }: ResetButtonProps) => {
    return (
      <button 
        onClick={onClick} 
        className="bg-red-500 text-white rounded-full px-4 py-2 m-2 shadow-lg transition-transform transform hover:scale-110 active:scale-95"
        aria-label="Reset view"
      >
        Reset View
      </button>
    );
  }
  
  export default ResetButton;
  