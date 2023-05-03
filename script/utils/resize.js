export default class Resizer { // set render and camera size / aspect ratio to be 100% of available and update it when necessary
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        window.addEventListener("resize", this.resize);
        window.addEventListener("orientationchange", this.resize); // on iphone orientation change don't trigger resize listener so listen for orientation
        this.resize();
    }
    resize = () => { // arrow function call because with normal call this is not defined sometimes apparently (valable for all classes) https://stackoverflow.com/questions/62735307/node-js-class-constructor-variables-undefined
        // update size aspect ratio etc to matches viewport
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
