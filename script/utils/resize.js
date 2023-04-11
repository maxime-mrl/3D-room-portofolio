export default class Resizer { // set render and camera size / aspect ratio to be 100% of available
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize); // on iphone orientation change don't trigger resize listener
        
    }
    resize = () => { // arrow function call because with normal call this is not defined apparently https://stackoverflow.com/questions/62735307/node-js-class-constructor-variables-undefined
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(pixelRatio);
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }
}
