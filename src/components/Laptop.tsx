import { useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useMediaQuery } from 'react-responsive';
import * as THREE from 'three';

interface GLTFResult extends THREE.Object3D {
  scene: object;
  nodes: any;
  materials: any;
}

interface LaptopProps {
  rotation: [number, number, number];
  position: [number, number, number];
  scale: number;
}

export default function Laptop({ rotation, position, scale }: LaptopProps) {
  const gltf = useLoader(GLTFLoader, '/alienware_18_gaming_laptop/scene.gltf') as GLTFResult;
  const laptopRef = useRef<THREE.Group>(null);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Adjust position for mobile
  const adjustedPosition = isMobile ? [position[0], position[1] + 1.5, position[2]] : position;

  useThree(({ camera }: { camera: THREE.PerspectiveCamera }) => {
    if (isMobile) {
      camera.position.set(0, 1, 5); // Atur posisi kamera lebih tinggi pada mobile
    } else {
      camera.position.set(0, 0, 5); // Atur posisi kamera standar pada desktop
    }
  });

  return (
    <primitive
      ref={laptopRef}
      object={gltf.scene}
      scale={scale}
      position={adjustedPosition}
      rotation={rotation}
    />
  );
}
