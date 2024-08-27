import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Button from "../components/Button";
import TextBox from "../components/TextBox";
import ambildata from "../ambildata";

type Line = [THREE.Vector3, THREE.Vector3];

const TransmisiJaringan: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentModel, setCurrentModel] = useState(1);
  const [modelDescriptions, setModelDescriptions] = useState({
    basicNetwork: "",
    hubNetwork: "",
    routerNetwork: "",
  });
  const [currentDescription, setCurrentDescription] = useState("");
  const [showTextBox, setShowTextBox] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ambildata();
      setModelDescriptions({
        basicNetwork: data.networkModels.basicNetwork,
        hubNetwork: data.networkModels.hubNetwork,
        routerNetwork: data.networkModels.routerNetwork,
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    camera.position.z = 10;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Models
    const models = [createModel1(), createModel2(), createModel3()];
    let currentSceneModel = models[currentModel - 1];
    scene.add(currentSceneModel);

    // Animation: Data transmission
    const dataGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const dataMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const dataSphere = new THREE.Mesh(dataGeometry, dataMaterial);
    scene.add(dataSphere);

    let progress = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Move dataSphere along the lines
      const currentLine = Math.floor(progress * 4);
      const t = (progress * 4) % 1;
      const lines: Line[] = currentSceneModel.userData.lines;
      const [start, end] = lines[currentLine];

      dataSphere.position.lerpVectors(start, end, t);

      progress += 0.01;
      if (progress > 1) progress = 0;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Clean up on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", onWindowResize);
    };
  }, [currentModel]);

  const handleModelChange = (modelIndex: number) => {
    setCurrentModel(modelIndex);
  };

  const handleShowPopup = () => {
    setCurrentDescription(
      modelDescriptions[
        currentModel === 1
          ? "basicNetwork"
          : currentModel === 2
          ? "hubNetwork"
          : "routerNetwork"
      ]
    );
    setShowTextBox(true);
  };

  const handleCloseTextBox = () => {
    setShowTextBox(false);
  };

  // Create Model 1
  const createModel1 = () => {
    const group = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(3, 0, 0),
      new THREE.Vector3(0, -3, 0),
    ];

    nodePositions.forEach((position) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(position);
      group.add(node);
      nodes.push(node);
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    const lines: Line[] = [
      [nodePositions[0], nodePositions[1]],
      [nodePositions[1], nodePositions[2]],
      [nodePositions[2], nodePositions[3]],
      [nodePositions[3], nodePositions[0]],
    ];

    lines.forEach(([start, end]) => {
      const points = [start, end];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);
    });

    // Store lines for animation
    group.userData.lines = lines;

    return group;
  };

  // Create Model 2 (Hub)
  const createModel2 = () => {
    const group = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const hub = new THREE.Mesh(nodeGeometry, nodeMaterial);
    hub.position.set(0, 0, 0);
    group.add(hub);

    const nodePositions: THREE.Vector3[] = [
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(3, 0, 0),
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(0, -3, 0),
    ];

    const lines: Line[] = [];

    nodePositions.forEach((position) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(position);
      group.add(node);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const points = [hub.position, position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);

      lines.push([hub.position, position]);
    });

    // Store lines for animation
    group.userData.lines = lines;

    return group;
  };

  // Create Model 3 (Router)
  const createModel3 = () => {
    const group = new THREE.Group();
    const routerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const routerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const router = new THREE.Mesh(routerGeometry, routerMaterial);
    router.position.set(0, 0, 0);
    group.add(router);

    const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const nodePositions: THREE.Vector3[] = [
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(3, 0, 0),
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(0, -3, 0),
    ];

    const lines: Line[] = [];

    nodePositions.forEach((position) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(position);
      group.add(node);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const points = [router.position, position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);

      lines.push([router.position, position]);
    });

    // Store lines for animation
    group.userData.lines = lines;

    return group;
  };

  return (
    <div className="relative">
      <div ref={mountRef} className="w-full h-[80vh]" />
      {showTextBox && (
        <TextBox text={currentDescription} onClose={handleCloseTextBox} />
      )}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl lg:text-4xl text-center">
        {currentModel === 1 && "Model 1: Basic Network"}
        {currentModel === 2 && "Model 2: Hub Network"}
        {currentModel === 3 && "Model 3: Router Network"}
        <div className="mt-2">
          <button
            className="bg-orange-300 hover:bg-orange-600 text-sm font-medium py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 active:translate-y-0"
            onClick={() => setShowTextBox(true)}
          >
            Show Description
          </button>{" "}
        </div>
      </div>
      <div className="text-center mt-4">
        <Button onClick={() => handleModelChange(1)}>Model 1</Button>
        <Button onClick={() => handleModelChange(2)}>Model 2</Button>
        <Button onClick={() => handleModelChange(3)}>Model 3</Button>
      </div>
    </div>
  );
};

export default TransmisiJaringan;
