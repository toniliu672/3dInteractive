import { useEffect, useRef } from 'react';
import { SceneSetup } from './assets/sceneSetup';

function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = new SceneSetup();
    if (mountRef.current) {
      mountRef.current.appendChild(scene.getRenderer().domElement);
    }
    scene.animate();

    // Cleanup function untuk menghindari memory leaks
    return () => {
      const renderer = scene.getRenderer();
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} id="canvas-container">
      {/* Elemen canvas Three.js akan dimasukkan di sini */}
    </div>
  );
  
}

export default App;
