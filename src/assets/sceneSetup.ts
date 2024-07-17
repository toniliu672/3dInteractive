import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class SceneSetup {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private model?: THREE.Object3D;
    private isMouseDown = false;
    private lastMousePosition = { x: 0, y: 0 };

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.addLights();
        this.loadModel();
        this.addEventListeners();
    }

    private addLights(): void {
        const light = new THREE.AmbientLight(0x404040);
        this.scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
    }

    private loadModel(): void {
        const loader = new GLTFLoader();
        loader.load('/scene.gltf', (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    }

    private addEventListeners(): void {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.isMouseDown && this.model) {
            const deltaX = event.clientX - this.lastMousePosition.x;
            const deltaY = event.clientY - this.lastMousePosition.y;

            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;

            this.lastMousePosition = { x: event.clientX, y: event.clientY };
        }
    }

    private onMouseDown(event: MouseEvent): void {
        this.isMouseDown = true;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
    }

    private onMouseUp(): void {
        this.isMouseDown = false;
    }

    private onTouchMove(event: TouchEvent): void {
        if (event.touches.length === 1 && this.model) {
            const touch = event.touches[0];
            const deltaX = touch.clientX - this.lastMousePosition.x;
            const deltaY = touch.clientY - this.lastMousePosition.y;

            this.model.rotation.y += deltaX * 0.01;
            this.model.rotation.x += deltaY * 0.01;

            this.lastMousePosition = { x: touch.clientX, y: touch.clientY };
        }
    }

    private onTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.lastMousePosition = { x: touch.clientX, y: touch.clientY };
        }
    }

    private onTouchEnd(): void {
        this.isMouseDown = false;
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
