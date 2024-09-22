import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Vector3, Group } from "three";
import TWEEN from '@tweenjs/tween.js';
import ChatBox from '../components/ChatBox';
import ambilData from '../ambildata';
import "../App.css"

function Model({ path, onClick }: { path: string, onClick: (group: Group) => void }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(path);

  useFrame(({ viewport }: { viewport: { width: number; height: number } }) => {
    if (groupRef.current) {
      const scaleFactor = Math.min(viewport.width, viewport.height) / 10;
      groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });

  return <primitive ref={groupRef} object={scene} onClick={() => groupRef.current && onClick(groupRef.current)} />;
}

function CameraSetup() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const startPosition = new Vector3(60, 10, 15);
    const endPosition = new Vector3(60, 10, 15);
    const targetPosition = new Vector3(0, 0, 0);

    camera.position.copy(startPosition);
    camera.lookAt(targetPosition);

    new TWEEN.Tween(startPosition)
      .to(endPosition, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        camera.position.copy(startPosition);
        camera.lookAt(targetPosition);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetPosition);
          controlsRef.current.update();
        }
      })
      .start();
  }, [camera]);

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      maxPolarAngle={(2 * Math.PI) / 3}
      minPolarAngle={Math.PI / 6}
      maxDistance={100}
      minDistance={20}
    />
  );
}

function TopologiJaringan() {
  const [modelPath, setModelPath] = useState("/topologi/topologi-bus.glb");
  const [key, setKey] = useState(0);
  const [popupContent, setPopupContent] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopology, setCurrentTopology] = useState<'bus' | 'ring'>('bus');

  const fetchTopologyData = async (topology: 'bus' | 'ring') => {
    setIsLoading(true);
    try {
      const data = await ambilData();
      const content = topology === 'bus' ? data.popup1 : data.popup2;
      setPopupContent(content);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPopupContent("Error mengambil data. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      fetchTopologyData(currentTopology);
    }
  }, [currentTopology, showPopup]);

  const handleSwitchModel = (topology: 'bus' | 'ring') => {
    const path = topology === 'bus' ? "/topologi/topologi-bus.glb" : "/topologi/topologi-ring.glb";
    setModelPath(path);
    setCurrentTopology(topology);
    setKey(key + 1);
    if (showPopup) {
      fetchTopologyData(topology);
    }
  };

  const handleModelClick = () => {
    setShowPopup(true);
    fetchTopologyData(currentTopology);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <Canvas key={key}>
        <CameraSetup />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model 
            path={modelPath} 
            onClick={handleModelClick} 
          />
        </Suspense>
      </Canvas>
      <div className="absolute top-5 left-5 z-10 flex space-x-2">
        <button
          className={`px-4 py-2 rounded-lg shadow-md transition-all ${
            currentTopology === 'bus'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleSwitchModel('bus')}
        >
          Topologi Bus
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow-md transition-all ${
            currentTopology === 'ring'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleSwitchModel('ring')}
        >
          Topologi Ring
        </button>
      </div>
      <ChatBox 
        show={showPopup} 
        onClose={handleClosePopup} 
        content={popupContent}
        isLoading={isLoading}
        currentTopology={currentTopology}
      />
      <button
        className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md z-10"
        onClick={handleModelClick}
      >
        Show Info
      </button>
    </div>
  );
}

export default TopologiJaringan;