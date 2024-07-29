import { Suspense, useRef, useState, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3, Group, Mesh } from 'three';
import { FBXLoader } from 'three-stdlib';
import TWEEN from '@tweenjs/tween.js';
import ChatBoxOSI from '../components/ChatBoxOSI';
import ambilData from '../ambildata';
import "../App.css";

interface ClickableModelProps {
  path: string;
  layerName: string;
  onClick: (group: Group | null, layerName: string) => void;
  setZoomIn: React.Dispatch<React.SetStateAction<boolean>>;
  setTargetPosition: React.Dispatch<React.SetStateAction<Vector3 | null>>;
}

function ClickableModel({ path, layerName, onClick, setZoomIn, setTargetPosition }: ClickableModelProps) {
  const groupRef = useRef<Group>(null as unknown as Group);
  const scene = useLoader(FBXLoader, path);
  const [selectedObject, setSelectedObject] = useState<Mesh | null>(null);

  const handleObjectClick = (e: any) => {
    e.stopPropagation();
    const object = e.object as Mesh;

    if (selectedObject === object) {
      resetObject(object);
      setSelectedObject(null);
      setZoomIn(false);
      setTargetPosition(null);
      onClick(null, layerName);
    } else {
      if (!object.userData.originalPosition) {
        object.userData.originalPosition = object.position.clone();
        object.userData.originalRotation = object.rotation.clone();
      }

      object.translateX(60);

      setSelectedObject(object);
      setZoomIn(true);
      setTargetPosition(object.position.clone());
      onClick(groupRef.current!, layerName);
    }
  };

  const resetObject = (object: Mesh) => {
    if (object.userData.originalPosition) {
      object.position.copy(object.userData.originalPosition);
    }
    if (object.userData.originalRotation) {
      object.rotation.copy(object.userData.originalRotation);
    }
  };

  return (
    <group ref={groupRef as MutableRefObject<Group>} onPointerDown={handleObjectClick} name={layerName}>
      <primitive object={scene} />
    </group>
  );
}

function CameraSetup({ targetPosition, zoomIn }: { targetPosition: Vector3 | null, zoomIn: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (zoomIn && targetPosition && controlsRef.current) {
      const startPosition = camera.position.clone();
      const endPosition = targetPosition.clone().add(new Vector3(10, 10, 10));
      new TWEEN.Tween(startPosition)
        .to(endPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          camera.position.copy(startPosition);
          camera.lookAt(targetPosition);
          controlsRef.current.target.copy(targetPosition);
          controlsRef.current.update();
        })
        .start();
    } else if (!zoomIn && controlsRef.current) {
      const startPosition = camera.position.clone();
      const endPosition = new Vector3(0, 2, 5);
      new TWEEN.Tween(startPosition)
        .to(endPosition, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          camera.position.copy(startPosition);
          camera.lookAt(new Vector3(0, 0, 0));
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        })
        .start();
    }
  }, [zoomIn, targetPosition, camera]);

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={!zoomIn}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={0}
      maxDistance={800}
      minDistance={700}
    />
  );
}

function OSILayer() {
  const [popupContent, setPopupContent] = useState<{ title: string, description: string }>({ title: '', description: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null);
  const [osiData, setOsiData] = useState<any>(null);
  const [selectedObject, setSelectedObject] = useState<Mesh | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ambilData();
      setOsiData(data);
    };
    fetchData();
  }, []);

  const resetObject = (object: Mesh) => {
    if (object.userData.originalPosition) {
      object.position.copy(object.userData.originalPosition);
    }
    if (object.userData.originalRotation) {
      object.rotation.copy(object.userData.originalRotation);
    }
  };

  const handleModelClick = (group: Group | null, layerName: string) => {
    if (group === null) {
      handleClosePopup();
      return;
    }

    if (!osiData) {
      console.error("OSI data not loaded yet");
      return;
    }

    if (selectedObject) {
      resetObject(selectedObject);
    }

    const content = osiData[layerName];
    if (content) {
      setPopupContent(content);
      setShowPopup(true);
      setZoomIn(true);
      setTargetPosition(group.position.clone());
      const mesh = group.children[0] as Mesh;
      setSelectedObject(mesh);
      if (!mesh.userData.originalPosition) {
        mesh.userData.originalPosition = mesh.position.clone();
        mesh.userData.originalRotation = mesh.rotation.clone();
      }
      mesh.translateX(60);
    } else {
      console.error(`Content not found for layer: ${layerName}`);
    }
  };

  const handleClosePopup = () => {
    if (selectedObject) {
      resetObject(selectedObject);
      setSelectedObject(null);
    }

    setShowPopup(false);
    setZoomIn(false);
    setTargetPosition(null);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative flex flex-col">
      <Canvas className="flex-grow">
        <CameraSetup zoomIn={zoomIn} targetPosition={targetPosition} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <ClickableModel 
            path="/osi/layer1.fbx" 
            layerName="physicalLayer"
            onClick={handleModelClick} 
            setZoomIn={setZoomIn}
            setTargetPosition={setTargetPosition}
          />
          <ClickableModel 
            path="/osi/layer2.fbx" 
            layerName="dataLinkLayer"
            onClick={handleModelClick} 
            setZoomIn={setZoomIn}
            setTargetPosition={setTargetPosition}
          />
          <ClickableModel 
            path="/osi/layer3.fbx" 
            layerName="networkLayer"
            onClick={handleModelClick} 
            setZoomIn={setZoomIn}
            setTargetPosition={setTargetPosition}
          />
          <ClickableModel 
            path="/osi/layer4.fbx" 
            layerName="transportLayer"
            onClick={handleModelClick} 
            setZoomIn={setZoomIn}
            setTargetPosition={setTargetPosition}
          />
          <ClickableModel 
            path="/osi/layer5.fbx" 
            layerName="sessionLayer"
            onClick={handleModelClick} 
            setZoomIn={setZoomIn}
            setTargetPosition={setTargetPosition}
          />
          <ClickableModel 
            path="/osi/layer6.fbx" 
            layerName="presentationLayer"
            onClick={handleModelClick} 
            setZoomIn={setZoomIn}
            setTargetPosition={setTargetPosition}
          />
          <ClickableModel 
            path="/osi/layer7.fbx" 
            layerName="applicationLayer"
            onClick={handleModelClick} 
            setZoomIn={setZoomIn}
            setTargetPosition={setTargetPosition}
          />
        </Suspense>
      </Canvas>
      {showPopup && (
        <ChatBoxOSI show={showPopup} onClose={handleClosePopup} content={popupContent} />
      )}
      <div className="block md:hidden w-full p-4 bg-gray-100 text-center">
        <div className="text-lg">
          <p className='text-red-500'>Layer 7: Application</p>
          <p className='text-red-500'>Layer 6: Presentation</p>
          <p className='text-red-500'>Layer 5: Session</p>
          <p>Layer 4: Transport</p>
          <p>Layer 3: Network</p>
          <p>Layer 2: Data Link</p>
          <p>Layer 1: Physical</p>
        </div>
      </div>
      <div className="hidden md:block absolute top-1/2 right-10 transform -translate-y-1/2 text-lg text-left">
        <p className='text-red-500'>Layer 7: Application</p>
        <p className='text-red-500'>Layer 6: Presentation</p>
        <p className='text-red-500'>Layer 5: Session</p>
        <p>Layer 4: Transport</p>
        <p>Layer 3: Network</p>
        <p>Layer 2: Data Link</p>
        <p>Layer 1: Physical</p>
      </div>
    </div>
  );
}

export default OSILayer;
