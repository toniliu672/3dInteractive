interface RotationButtonProps {
    direction: 'up' | 'down' | 'left' | 'right';
    onMouseDown: () => void;
    onMouseUp: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
    className?: string;
  }
  
  const RotationButton = ({ direction, onMouseDown, onMouseUp, onTouchStart, onTouchEnd, className }: RotationButtonProps) => {
    const icons = {
      up: '↑',
      down: '↓',
      left: '←',
      right: '→'
    };
  
    return (
      <button
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`bg-gray-700 text-white rounded-full h-12 w-12 flex items-center justify-center m-2 shadow-lg transition-transform transform hover:scale-110 active:scale-95 ${className}`}
      >
        {icons[direction]}
      </button>
    );
  }
  
  export default RotationButton;
  