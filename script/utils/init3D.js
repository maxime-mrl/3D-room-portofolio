// THREEJS
import * as THREE from "../three/build/three.module.js"; // import needs .js to work
window.THREE = THREE; // Allow three.js to be accessible everywhere
import { OrbitControls } from "../three/examples/jsm/controls/OrbitControls.js";
// HOMEMADE
import Loader from "./loader.js";
import Resizer from "./resize.js";

const canvas = document.querySelector(".render-container > canvas");
const loadingOverlay = document.querySelector(".loader");

window.scene = new THREE.Scene();
window.camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight);
window.renderer = setRenderer(); // renderer


new Loader(loadingOverlay).load();
new Resizer(renderer, camera).resize();
createControls();
addHelpers();

function setRenderer() { // create renderer and set it up
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    }); // renderer
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 2.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    return renderer;
}

function createControls() { // create orbits controls and set limitations
    const controls = new OrbitControls(camera, canvas);
    // controls.enablePan = false; // block movement (only left zoom + rot)

    // rotation limits
    // controls.target.set(0,  1.2, 0)
    // controls.minAzimuthAngle = 0.3;
    // controls.maxAzimuthAngle = 1; // horizontal
    // controls.minPolarAngle = 0.5; // vertical
    // controls.maxPolarAngle = 1.2;
    // controls.rotateSpeed = 0.2;
    // // distances limit
    // controls.minDistance = 5; // zoom
    // controls.maxDistance = 10;

    camera.position.set(8,6,8);
    controls.update();
}

function addHelpers() {
    // HELPERS
    const gridHelper = new THREE.GridHelper(10, 10);
    const axesHelper = new THREE.AxesHelper(15);
    scene.add(gridHelper);
    scene.add(axesHelper);
}






