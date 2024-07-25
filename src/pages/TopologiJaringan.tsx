import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from 'react-responsive';
import Laptop from '../components/Laptop';
import Popup from '../components/Popup';
import RotationButton from '../components/RotationButton';
import ResetButton from '../components/ResetButton';
import ambilData from '../ambildata';

export default function TopologiJaringan() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [zoom, setZoom] = useState(1);
  const rotateInterval = useRef<NodeJS.Timeout | null>(null);
  const [data, setData] = useState({ popup1: '', popup2: '' });

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await ambilData();
      setData(fetchedData);
    };
    getData();
  }, []);

  const handleButtonClick = (content: string) => {
    setPopupContent(content);
    setShowPopup(true);
  };

  const startRotation = (direction: string) => {
    if (rotateInterval.current) return;

    rotateInterval.current = setInterval(() => {
      setRotation(prevRotation => {
        switch (direction) {
          case 'up':
            return [prevRotation[0] + 0.01, prevRotation[1], prevRotation[2]];
          case 'down':
            return [prevRotation[0] - 0.01, prevRotation[1], prevRotation[2]];
          case 'left':
            return [prevRotation[0], prevRotation[1] + 0.01, prevRotation[2]];
          case 'right':
            return [prevRotation[0], prevRotation[1] - 0.01, prevRotation[2]];
          default:
            return prevRotation;
        }
      });
    }, 16); // Interval 16ms untuk mendapatkan sekitar 60fps
  };

  const stopRotation = () => {
    if (rotateInterval.current) {
      clearInterval(rotateInterval.current);
      rotateInterval.current = null;
    }
  };

  const resetRotation = () => {
    setRotation([0, 0, 0]);
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 1));
  };

  useEffect(() => {
    return () => {
      if (rotateInterval.current) {
        clearInterval(rotateInterval.current);
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative">
      <Canvas className="w-full h-full bg-gray-100" pixelratio={window.devicePixelRatio / 2}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Laptop rotation={rotation} position={[0, -1, 0]} scale={0.5 * zoom} />
        </Suspense>
      </Canvas>

      <div className="absolute w-full h-full pointer-events-none" style={{ top: 0, left: 0 }}>
        <button 
          onClick={() => handleButtonClick(data.popup1)}
          className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center m-2 pointer-events-auto"
          style={{ position: 'absolute', top: '40%', left: '45%' }}
        >
          1
        </button>
        <button 
          onClick={() => handleButtonClick(data.popup2)}
          className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center m-2 pointer-events-auto"
          style={{ position: 'absolute', top: '50%', left: '55%' }}
        >
          2
        </button>
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">
        <div className="flex justify-center">
          <RotationButton
            direction="up"
            onMouseDown={() => startRotation('up')}
            onMouseUp={stopRotation}
            onTouchStart={() => startRotation('up')}
            onTouchEnd={stopRotation}
          />
        </div>
        <div className="flex justify-center space-x-2">
          <RotationButton
            direction="left"
            onMouseDown={() => startRotation('left')}
            onMouseUp={stopRotation}
            onTouchStart={() => startRotation('left')}
            onTouchEnd={stopRotation}
          />
          <RotationButton
            direction="down"
            onMouseDown={() => startRotation('down')}
            onMouseUp={stopRotation}
            onTouchStart={() => startRotation('down')}
            onTouchEnd={stopRotation}
          />
          <RotationButton
            direction="right"
            onMouseDown={() => startRotation('right')}
            onMouseUp={stopRotation}
            onTouchStart={() => startRotation('right')}
            onTouchEnd={stopRotation}
          />
        </div>
      </div>

      <div className="absolute top-10 right-10 flex space-x-2">
        <ResetButton onClick={resetRotation} />
        <button
          onMouseDown={zoomIn}
          onMouseUp={() => {}}
          onTouchStart={zoomIn}
          onTouchEnd={() => {}}
          className="bg-gray-700 text-white h-12 w-12 rounded-full shadow-lg transition-transform transform hover:scale-110 active:scale-95"
        >
          +
        </button>
        <button
          onMouseDown={zoomOut}
          onMouseUp={() => {}}
          onTouchStart={zoomOut}
          onTouchEnd={() => {}}
          className={`h-12 w-12 rounded-full shadow-lg transition-transform transform ${zoom > 1 ? 'bg-gray-700 text-white hover:scale-110 active:scale-95' : 'bg-gray-300 text-gray-500'}`}
          disabled={zoom === 1}
        >
          -
        </button>
      </div>

      <Popup show={showPopup} onClose={() => setShowPopup(false)} content={popupContent} />
    </div>
  );
}
