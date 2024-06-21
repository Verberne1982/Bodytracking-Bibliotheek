import * as THREE from 'three';

console.log("klasse vooraan")

class ThreejsCube {
  constructor() {
    console.log("constructor");
    this.canvasId = canvasId;
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.cube = null;
  }

  initialize(canvasId) {
    console.log("Three.js initialised with cube");
    const canvasWidth = 400;
    const canvasHeight = 300;
    const aspectRatio = canvasWidth / canvasHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById(canvasId) });
    this.renderer.setSize(canvasWidth, canvasHeight);

    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.z = 5;

    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);

    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const cubeEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    this.cube.add(cubeEdges);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    this.scene.add(directionalLight);

    this.scene.add(this.cube);

    

    this.render();
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
    console.log("render");
  }
}

export default ThreejsCube;
