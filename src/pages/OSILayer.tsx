import { useState, useRef, Suspense, MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Group, Mesh } from 'three';

interface ClickableModelProps {
  path: string;
}

function ClickableModel({ path }: ClickableModelProps) {
  const groupRef = useRef<Group>(null as unknown as Group);
  const { nodes } = useGLTF(path);
  const [selectedObject, setSelectedObject] = useState<Mesh | null>(null);

  const handleObjectClick = (e: any) => {
    e.stopPropagation();
    const object = e.object as Mesh;

    // Reset the previously selected object
    if (selectedObject && selectedObject !== object) {
      selectedObject.position.set(...(selectedObject.userData.originalPosition as [number, number, number]));
      selectedObject.rotation.set(...(selectedObject.userData.originalRotation as [number, number, number]));
    }

    // Toggle the selected object
    if (selectedObject === object) {
      setSelectedObject(null);
      object.position.set(...(object.userData.originalPosition as [number, number, number]));
      object.rotation.set(...(object.userData.originalRotation as [number, number, number]));
    } else {
      // Save the original position and rotation
      if (!object.userData.originalPosition) {
        object.userData.originalPosition = [object.position.x, object.position.y, object.position.z];
        object.userData.originalRotation = [object.rotation.x, object.rotation.y, object.rotation.z];
      }

      // Move and rotate the selected object forward
      object.translateZ(3); // Adjust this value to control how far the object moves forward
      object.rotation.y = Math.PI / -3; // 60 degrees in radians

      setSelectedObject(object);
    }
  };

  return (
    <group ref={groupRef as MutableRefObject<Group>} onPointerDown={handleObjectClick}>
      {Object.keys(nodes).map((key) => (
        <mesh key={key} geometry={nodes[key].geometry} position={nodes[key].position}>
          <meshStandardMaterial attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function OSILayer() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <ClickableModel path="/osi/osi-layer.glb" />
        </Suspense>
        <OrbitControls 
          maxPolarAngle={Math.PI / 2} // Limit vertical rotation
          minPolarAngle={0} // Limit vertical rotation
          maxDistance={14} // Maximum zoom out distance
          minDistance={7} // Minimum zoom in distance
        />
      </Canvas>
    </div>
  );
}

export default OSILayer;
