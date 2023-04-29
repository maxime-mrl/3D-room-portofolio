import { InteractionManager } from './three.interactive/build/three.interactive.js';
import Environment from './utils/environment.js';

const animations = {};
const interactions = [];

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
        this.setInteractions("screen-video", "click", () => openModal("projects"));
        this.setInteractions("letter", "click", () => openModal("contact"));

        this.setInteractions("lamp", "click", () => this.environment.toggleLight(bedLight));
        this.setInteractions("desk_lamp", "click", () => this.environment.toggleLight(deskLight));

        this.setInteractions("keyboard", "click", () => this.assets.typing.audio = playAudio(this.assets.typing));
        this.setInteractions("Cube", "click", () => this.assets.oof.audio = playAudio(this.assets.oof));

        this.setInteractions("globe", "click", () => this.Animate("globe-anim", 2, "repeat"));
        this.setInteractions("mouse", "click", () => this.Animate("mouse-anim", 2, "repeat"));
        this.setInteractions("chair", "click", () => this.Animate("chair-anim", 2, "both-way"));
        this.setInteractions("cofee-cup", "click", () => this.Animate("cofee-anim", 2, "both-way"));
        this.setInteractions("drawer", "click", () => this.Animate("drawer-anim", 0.5, "both-way"));
        this.setInteractions("book5", "click", () => this.Animate("book5-anim", 1, "both-way"));
        this.setInteractions("paraglider", "click", () => this.Animate("paraglider-anim", 10, "reset-after"));
        this.setInteractions("letter", "mouseover", () => this.Animate("letter-top-anim", 1, "forward"));
        this.setInteractions("letter", "mouseout", () => this.Animate("letter-top-anim", 1, "backward"));
    };

    setInteractions = (target, type, action) => { // create interaction for elements
        this.interactionManager.add(this.room[target]);
        this.room[target].addEventListener(type, action);

        if (interactions.find(elem => elem.name == target)) return; // if element arleady added to interactions hint return (for multiple interactions object)
        if (this.room[target].type == "Group") {
            this.room[target].children.forEach(object => {
                interactions.push({
                    name: target,
                    object: object,
                    originalMaterial: object.material
                })
            })
        } else {
            interactions.push({
                name: target,
                object: this.room[target],
                originalMaterial: this.room[target].material
            })
        }
    }

    hint = () => { // change color of every interactible elements
        const hintMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF0000
        });

        interactions.forEach(interaction => interaction.object.material = hintMaterial);
        setTimeout(() => {
            interactions.forEach(interaction => interaction.object.material = interaction.originalMaterial);
        }, 1800);
    }

    Animate = (animation, speed, mode) => { // manage all animation
        if (mode == "forward" || mode == "backward") { // if animation only one way handled differently 
            if (!animations[animation]) { // if animation not initialized create it
                const clip = this.fullRoom.animations.find(element => element.name === animation);
                animations[animation] = this.mixer.clipAction(clip);
                if (mode == "forward") animations[animation].setDuration(speed); // forward => positive speed  
                else animations[animation].setDuration(-speed); // backward => negative speed
                animations[animation].setLoop(THREE.LoopOnce);
                animations[animation].clampWhenFinished = true;
            } else { // when animation arleady exist (replaying)
                if (mode == "forward") { // reset the timing for if same animation is used forward and backward
                    animations[animation].paused = false;
                    animations[animation].timeScale = Math.abs(animations[animation].timeScale);
                }
                if (mode == "backward") {
                    animations[animation].paused = false;
                    animations[animation].timeScale = -Math.abs(animations[animation].timeScale);
                }
            }
        } else if (!animations[animation]) { // if animation not initialized create it
            const clip = this.fullRoom.animations.find(element => element.name === animation);
            animations[animation] = this.mixer.clipAction(clip);    
            animations[animation].setDuration(speed);
            animations[animation].setLoop(THREE.LoopOnce);  
            animations[animation].clampWhenFinished = true;
        } else { // if arleady exist
            if (mode == "both-way") { // revert animation
                animations[animation].paused = false;
                animations[animation].timeScale = -animations[animation].timeScale;
                animations[animation].setLoop(THREE.LoopOnce); 
            } else { // reset to replay it
                animations[animation].reset();
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

    updateClock = () => { // update the clock time to the user local time
        const date = new Date();
        const time = [date.getHours(), date.getMinutes(), date.getSeconds()];
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
        this.interactionManager.update();
        this.mixer.update(deltaTime);
        renderer.render(scene, camera);
        this.frameRequest = requestAnimationFrame(this.update);
    }
}
