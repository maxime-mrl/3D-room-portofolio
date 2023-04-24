import { InteractionManager } from './three.interactive/build/three.interactive.js';
import Environment from './utils/environment.js';

const animations = {};

export default class World { // World is everithing regarding 3D world after initialization (set the room, add some light updating etc)
    constructor(assets) {
        this.assets = assets;
        this.fullRoom = assets.room;
        this.room = assets.room.objects;

        this.interactionManager = new InteractionManager(renderer, camera, renderer.domElement);
        this.environment = new Environment();
        this.mixer = new THREE.AnimationMixer(this.fullRoom.scene);
        this.setRoom();
        this.updateClock();
        this.timer = new THREE.Clock(); // create Three clock to get delta time
        this.update();
    }
    setRoom = () => {
        scene.add(this.fullRoom.scene);

        // add screen texture
        this.room["screen-video"].material = new THREE.MeshStandardMaterial({
            map: this.assets["screen-animation"],
            emissive: 0x999999,
            emissiveMap: this.assets["screen-animation"],
            emissiveIntensity: 0.5,
        });
        // add lights
        const deskLight = this.environment.addSpotLight(this.room["desk_lamp"].position, this.room.letter);
        const bedLight = this.environment.addPointLight(this.room["lamp"].position);
        // add Interactions
        this.setInteractions("screen-video", () => openModal("projects"));
        this.setInteractions("lamp", () => this.environment.toggleLight(bedLight));
        this.setInteractions("desk_lamp", () => this.environment.toggleLight(deskLight));
        this.setInteractions("globe", () => this.Animate("globe-anim", 2, "repeat"));
        this.setInteractions("chair", () => this.Animate("chair-anim", 2, "both-way"));
        this.setInteractions("paraglider", () => this.Animate("paraglider-anim", 10, "reset-after"));
        this.setInteractions("cofee-cup", () => this.Animate("cofee-anim", 2, "both-way"));
    };

    setInteractions = (target, action) => {
        this.interactionManager.add(this.room[target]);
        this.room[target].addEventListener("click", action);
    }

    Animate = (animation, speed, mode) => { // need to make it work
        if (!animations[animation]) {
            const clip = this.fullRoom.animations.find(element => element.name === animation);
            animations[animation] = this.mixer.clipAction(clip);    
            animations[animation].setDuration(speed);
            animations[animation].setLoop(THREE.LoopOnce);  
            animations[animation].clampWhenFinished = true;
        } else {
            if (mode == "both-way") {
                animations[animation].paused = false;
                animations[animation].timeScale = -animations[animation].timeScale;
                animations[animation].setLoop(THREE.LoopOnce); 
            } else {
                animations[animation].reset()
            }
        }
        animations[animation].play();
        if (mode == "reset-after") {
            setTimeout(() => {
                animations[animation].reset();
                animations[animation].paused = true;
            }, speed*1000 + 5000)
        }
    }

    updateClock = () => { // update the clock time
        const date = new Date();
        const time = [date.getHours(), date.getMinutes(), date.getSeconds()];
        const angle = {
            h: (time[0] + time[1]/60) * 30,
            m: time[1]*6,
        };
        this.room["clock-h"].rotation.z = - toRadian(angle.h);
        this.room["clock-m"].rotation.z = - toRadian(angle.m);
        setTimeout(() => {
            this.updateClock();
        }, (60 - time[2])*1000);
    }

    frameRequest; // make accessible from class instance so possible to stop updating on modal oppening (for perf)
    update = () => { // update rendering
        const deltaTime = this.timer.getDelta(); // get elapsed time since last call to ensure speed const could be possible by hand but hey three.js allows it
        // console.log(Math.round(deltaTime*1000));
        this.mixer.update(deltaTime);
        this.render();
        this.frameRequest = requestAnimationFrame(this.update);
    }

    render() {
        renderer.render(scene, camera);
    }
}
