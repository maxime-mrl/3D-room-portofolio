import { InteractionManager } from './three.interactive/build/three.interactive.js';
import Environment from './utils/environment.js';
import Resizer from "./utils/resize.js";

const animations = {};
const interactions = [];
let interacted = false;

export default class World { // World is everithing regarding 3D world after initialization (set the room, add some light updating etc)
    constructor(assets) {
        this.assets = assets;
        this.fullRoom = assets.room;
        this.room = assets.room.objects;

        this.interactionManager = new InteractionManager(renderer, camera, renderer.domElement); // handle click/hover etc event
        this.environment = new Environment(); // light fog etc
        this.mixer = new THREE.AnimationMixer(this.fullRoom.scene); // animations
        this.setRoom();
        this.updateClock();
        this.timer = new THREE.Clock(); // create Three clock to get delta time
        this.update();
        setTimeout(() => { // add "hint" if user dosen't interact
            if (!interacted) this.Animate("hint-anim", 0.1, "forward");
        }, 8000)
        new Resizer(renderer, camera);
    }

    setRoom = () => { // add room to scene + set up
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
        this.setInteractions("screen-video", "mousedown", () => openModal("projects"));
        this.setInteractions("letter", "mousedown", () => openModal("contact"));
        this.setInteractions("letter-box", "mousedown", () => openModal("contact"));

        this.setInteractions("lamp", "click", () => this.environment.toggleLight(bedLight));
        this.setInteractions("desk_lamp", "click", () => this.environment.toggleLight(deskLight));

        this.setInteractions("keyboard", "click", () => this.assets.typing.audio = playAudio(this.assets.typing));
        this.setInteractions("Cube", "click", () => this.assets.oof.audio = playAudio(this.assets.oof));
        this.setInteractions("radio", "click", () => this.assets.oof.audio = playAudio(this.assets.radio));

        this.setInteractions("globe", "click", () => this.Animate("globe-anim", 2, "repeat"));
        this.setInteractions("mouse", "click", () => this.Animate("mouse-anim", 2, "repeat"));
        this.setInteractions("chair", "click", () => this.Animate("chair-anim", 2, "both-way"));
        this.setInteractions("cofee-cup", "click", () => this.Animate("cofee-anim", 2, "both-way"));
        this.setInteractions("drawer", "click", () => this.Animate("drawer-anim", 0.5, "both-way"));
        this.setInteractions("book5", "click", () => this.Animate("book5-anim", 1, "both-way"));
        this.setInteractions("paraglider", "click", () => this.Animate("paraglider-anim", 10, "reset-after"));
        this.setInteractions("letter", "mouseover", () => this.Animate("letter-top-anim", 1, "forward"));
        this.setInteractions("letter", "mouseout", () => this.Animate("letter-top-anim", 1, "backward"));
        // add animations
        this.Animate("letter-box-anim", 5, "infinite");
        this.Animate("room-entry-anim", 5, "infinite");
    };

    setInteractions = (target, type, action) => { // create interaction for elements
        if (!this.interactionManager.interactiveObjects.find(interaction => interaction.name == target)) { // if object is not arleady animated add all prior need (add to interaction manager, add hover cursor, add to interaction hint)
            this.interactionManager.add(this.room[target]);
            // hover cursor change
            this.room[target].addEventListener("mouseover", () => document.body.style.cursor = "pointer");
            this.room[target].addEventListener("mouseout", () => document.body.style.cursor = "initial");
            // add element to interaction list for color change hint
            this.room[target].traverse((node) => {
                interactions.push({
                    name: target,
                    object: node,
                    originalMaterial: node.material
                })
            })
        }
        // listen for wanted interaction
        this.room[target].addEventListener(type, () => {
            action();
            interacted = true;
        });
    }

    hint = () => { // change color of every interactible elements for 2s then revert back to original
        const hintMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF0000
        });

        interactions.forEach(interaction => interaction.object.material = hintMaterial);
        setTimeout(() => {
            interactions.forEach(interaction => interaction.object.material = interaction.originalMaterial);
        }, 2000);
    }

    Animate = (animation, speed, mode) => { // manage all animation
        // animation mode: "forward" "backward" "infinite" "both-way" "reset-after" "repeat" (repeat = default so anything unrecognized will repeat)
        if (!animations[animation]) { // if animation not initialized create it
            const clip = this.fullRoom.animations.find(element => element.name === animation);
            animations[animation] = this.mixer.clipAction(clip);
            if (mode == "backward") animations[animation].setDuration(-speed); // backward mode 
            else animations[animation].setDuration(speed);
            if (mode != "infinite") animations[animation].setLoop(THREE.LoopOnce); // infinite mode
            animations[animation].clampWhenFinished = true;
        } else { // if arleady exist
            animations[animation].paused = false;
            switch (mode) {
                case "both-way": // revert animation
                    animations[animation].timeScale = -animations[animation].timeScale;
                    break;
                case "forward": // reset the timing for if same animation is used forward and backward
                    animations[animation].timeScale = Math.abs(animations[animation].timeScale);
                    break;
                case "backward":
                    animations[animation].timeScale = -Math.abs(animations[animation].timeScale);
                    break;
                default:
                    animations[animation].reset();
            }
        }
        animations[animation].play();
        if (mode == "reset-after") { // reset annimation 5sec after its end
            setTimeout(() => {
                animations[animation].reset();
                animations[animation].paused = true;
            }, speed*1000 + 5000);
        }
    }

    updateClock = () => { // update the clock time to the user local time
        const date = new Date();
        const time = [ date.getHours(), date.getMinutes(), date.getSeconds() ];
        const angle = {
            h: (time[0] + time[1]/60) * 30, // 12 hours, 360° => 30° steps -- add minutes as 0.something hours to make angle right
            m: time[1]*6, // 60 minutes, 360° => 6° steps
        };
        this.room["clock-h"].rotation.z = - toRadian(angle.h);
        this.room["clock-m"].rotation.z = - toRadian(angle.m);
        setTimeout(() => {
            this.updateClock();
        }, (60 - time[2])*1000);
    }

    frameRequest; // make accessible from class instance so possible to stop updating on modal oppening (for perf)
    update = () => { // update rendering
        const deltaTime = this.timer.getDelta();
        this.interactionManager.update(); // update interactions
        this.mixer.update(deltaTime); // update animation
        renderer.render(scene, camera); // render new frame
        this.frameRequest = requestAnimationFrame(this.update);
    }
}
