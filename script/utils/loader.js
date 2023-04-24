import { GLTFLoader } from "../three/examples/jsm/loaders/GLTFLoader.js";
import assets from "./assets.js";
import World from "../world.js";

export default class Loader { // load every assets for the scene then initialize world
    constructor(loadOverlay) {
        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = this.updateProgress;

        this.overlay = loadOverlay;
        this.loader = new GLTFLoader(this.manager);
        this.queue = assets.length;
        this.loaded = 0;
        this.items = {};
    }

    load = () => {
        console.log("%cLoading assets...", "color: #F5853F; font-weight: bold");
        assets.forEach(asset => {
            switch (asset.type) {
                case "gltf":
                    this.loadGltf(asset);
                    break;
                case "video":
                    this.loadVideo(asset);
                    break;
                case "image":
                    this.loadImage(asset);
                    break;
                default:
                    console.error(`Unknown asset type ${asset.type} -- asset "${asset.name}" not loaded`);
            }
        })
    }

    loadImage = (asset) => { // not used rn but did it for test so for now it stays
        const imageTexture = new THREE.TextureLoader().load(asset.path);
        this.oneLoaded(asset.name, imageTexture);
    }

    loadVideo = (asset) => { // load video as texture
        const video = document.createElement("video");
        video.src = asset.path;
        video.muted = true;
        video.playsInline = true;
        video.loop = true;


        video.play()
        .then(() => {
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.encoding = THREE.sRGBEncoding;

            this.oneLoaded(asset.name, videoTexture);
        })
        .catch(error => {// catch any errors because one can appen randomly but dosen't matter to remove it -- https://developer.chrome.com/blog/play-request-was-interrupted/)
            const errorTxt = String(error);
            console.log("Handle video error");
            console.log(errorTxt);
            if (errorTxt.includes("https://goo.gl/LdLk22")) {
                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.encoding = THREE.sRGBEncoding;
    
                this.oneLoaded(asset.name, videoTexture);
                return;
            };
            console.error(error); // when the error isn't recognized log it
        });
    }

    loadGltf = (asset) => { // load gltf model (the scene)
        this.loader.load(asset.path, file => {
            file["objects"] = {};
            file.scene.traverse((node) => {
                node.castShadow = true;
                node.receiveShadow = true;
                file.objects[node.name] = node;
            })
            this.oneLoaded(asset.name, file);
        });
    }

    oneLoaded = (name, file) => { // called every time somethings load -- check if everything loaded to continue or just wait
        this.items[name] = file;
        this.loaded++;
        console.log(name)
        if (this.loaded !== this.queue) return;
        console.log("%cLoaded successfully!", "color: #09814A; font-weight: bold");
        this.overlay.style.display = "none";
        window.world = new World(this.items);
    }
    
    updateProgress = (url, loaded, total) => {
        const progress = loaded / total;
        if (progress >= 0.25) {
            this.overlay.querySelectorAll(".dot")[0].className = "dot loaded";
        }
        if (progress >= 0.5) {
            this.overlay.querySelectorAll(".dot")[1].className = "dot loaded";
        }
        if (progress >= 0.75) {
            this.overlay.querySelectorAll(".dot")[2].className = "dot loaded";
        }
        if (progress >= 1) {
            this.overlay.querySelectorAll(".dot")[3].className = "dot loaded";
        }
    }
}
