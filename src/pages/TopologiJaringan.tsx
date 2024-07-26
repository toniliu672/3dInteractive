import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Vector3, Group } from "three";
import ChatBox from '../components/ChatBox'; // Import the ChatBox component
import ambilData from '../ambildata'; // Import the data fetching function
import "../App.css"

// Define the component to load and display the GLTF model
function Model({ path, onClick }: { path: string, onClick: (group: Group) => void }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(path);

  // Adjust scale based on window size
  useFrame(({ viewport }: { viewport: { width: number; height: number } }) => {
    if (groupRef.current) {
      const scaleFactor = Math.min(viewport.width, viewport.height) / 10;
      groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });

  return <primitive ref={groupRef} object={scene} onClick={() => groupRef.current && onClick(groupRef.current)} />;
}

function CameraSetup({ targetPosition, zoomIn }: { targetPosition: Vector3 | null, zoomIn: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (zoomIn && targetPosition && controlsRef.current) {
      const offset = new Vector3(10, 10, 10); // Adjust this offset for better viewing
      const newPosition = targetPosition.clone().add(offset);
      camera.position.copy(newPosition); // Move camera to new position
      camera.lookAt(targetPosition); // Make the camera look at the target position
      controlsRef.current.target.copy(targetPosition); // Set OrbitControls target to the target position
      controlsRef.current.update(); // Update the controls
    } else if (!zoomIn && controlsRef.current) {
      camera.position.set(60, 10, 15); // Reset to initial position
      camera.lookAt(new Vector3(0, 0, 0)); // Adjust to look at the center of the object
      controlsRef.current.target.set(0, 0, 0); // Reset OrbitControls target
      controlsRef.current.update(); // Update the controls
    }
  }, [zoomIn, targetPosition, camera]);

  return <OrbitControls ref={controlsRef} enableZoom={!zoomIn} />;
}

// Define the main component to render the 3D scene
function TopologiJaringan() {
  const [modelPath, setModelPath] = useState("/topologi/topologi-bus.glb");
  const [key, setKey] = useState(0); // Add key to force re-render
  const [popupContent, setPopupContent] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);
  const [zoomIn, setZoomIn] = useState(false); // Add state for zooming
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);

  const handleSwitchModel = (path: string) => {
    setModelPath(path);
    setKey(key + 1); // Change key to force re-render
  };

  const handleModelClick = async (group: Group) => {
    setShowPopup(false); // Ensure popup is hidden before fetching new data
    const data = await ambilData();
    const content = modelPath.includes('bus') ? data.popup1 : data.popup2;
    setPopupContent(content);
    setShowPopup(true);
    setZoomIn(true); // Set zoomIn to true to zoom in
    setTargetPosition(group.position.clone()); // Set the target position for zooming
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setZoomIn(false); // Set zoomIn to false to reset camera
    setTargetPosition(null); // Clear the target position
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <Canvas key={key}>
        <CameraSetup zoomIn={zoomIn} targetPosition={targetPosition} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model 
            path={modelPath} 
            onClick={(group) => handleModelClick(group)} 
          />
        </Suspense>
      </Canvas>
      {!zoomIn && (
        <div className="absolute top-5 left-5 z-10 flex space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0"
            onClick={() => handleSwitchModel("/topologi/topologi-bus.glb")}
          >
            Topologi Bus
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:-translate-y-1 active:translate-y-0"
            onClick={() => handleSwitchModel("/topologi/topologi-ring.glb")}
          >
            Topologi Ring
          </button>
        </div>
      )}
      <ChatBox show={showPopup} onClose={handleClosePopup} content={popupContent} />
    </div>
  );
}

export default TopologiJaringan;
