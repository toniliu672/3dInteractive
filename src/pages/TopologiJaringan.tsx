import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Vector3, Group } from "three";
import ChatBox from '../components/ChatBox'; // Import the ChatBox component
import ambilData from '../ambildata'; // Import the data fetching function
import "../App.css"

// Komponen untuk memuat dan menampilkan model GLTF
function Model({ path, onClick }: { path: string, onClick: (group: Group) => void }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(path);

  // Menyesuaikan skala berdasarkan ukuran jendela
  useFrame(({ viewport }: { viewport: { width: number; height: number } }) => {
    if (groupRef.current) {
      const scaleFactor = Math.min(viewport.width, viewport.height) / 10;
      groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });

  return <primitive ref={groupRef} object={scene} onClick={() => groupRef.current && onClick(groupRef.current)} />;
}

// Komponen untuk mengatur kamera
function CameraSetup({ targetPosition, zoomIn }: { targetPosition: Vector3 | null, zoomIn: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (zoomIn && targetPosition && controlsRef.current) {
      camera.position.set(targetPosition.x + 10, targetPosition.y + 10, targetPosition.z + 10);
      camera.lookAt(targetPosition);
      controlsRef.current.target.copy(targetPosition);
      controlsRef.current.update();
    } else if (!zoomIn && controlsRef.current) {
      camera.position.set(60, 10, 15); // Mengatur kembali ke posisi awal
      camera.lookAt(new Vector3(0, 0, 0)); // Mengatur untuk melihat pusat objek
      controlsRef.current.target.set(0, 0, 0); // Mengatur kembali target OrbitControls
      controlsRef.current.update(); // Memperbarui kontrol
    }
  }, [zoomIn, targetPosition, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={!zoomIn}
      maxPolarAngle={(2 * Math.PI) / 3} // Mengizinkan melihat ke bawah 30 derajat dari horizontal
      minPolarAngle={Math.PI / 6} // Mengizinkan melihat ke atas 30 derajat dari horizontal
      maxDistance={100} // Jarak zoom out maksimum
      minDistance={20} // Jarak zoom in minimum
    />
  );
}

// Komponen utama untuk merender scene 3D
function TopologiJaringan() {
  const [modelPath, setModelPath] = useState("/topologi/topologi-bus.glb");
  const [key, setKey] = useState(0); // Menambahkan key untuk memaksa render ulang
  const [popupContent, setPopupContent] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);
  const [zoomIn, setZoomIn] = useState(false); // Menambahkan state untuk zoom
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);

  const handleSwitchModel = (path: string) => {
    setModelPath(path);
    setKey(key + 1); // Mengubah key untuk memaksa render ulang
  };

  const handleModelClick = async (group: Group) => {
    setShowPopup(false); // Memastikan popup tersembunyi sebelum mengambil data baru
    const data = await ambilData();
    const content = modelPath.includes('bus') ? data.popup1 : data.popup2;
    setPopupContent(content);
    setShowPopup(true);
    setZoomIn(true); // Mengatur zoomIn menjadi true untuk zoom in
    setTargetPosition(group.position.clone()); // Mengatur posisi target untuk zoom
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setZoomIn(false); // Mengatur zoomIn menjadi false untuk reset kamera
    setTargetPosition(null); // Menghapus posisi target
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
