const themeBtn = document.querySelector("#night-switch");

export default class Environment { // create every environment elements (ambiantlight sun ground fog, and then diverse type of light as needed)
    constructor() {
        // light
        this.hlight = new THREE.AmbientLight(colors.day.environment.light[0], colors.day.environment.light[1]); // env light

        this.sun = new THREE.DirectionalLight(colors.day.environment.sun[0], colors.day.environment.sun[1]); // sun
        this.sun.castShadow = true;
        // set shadow size
        this.sun.shadow.camera.near = 10;
        this.sun.shadow.camera.far = 20;
        this.sun.shadow.camera.right = 7;
        this.sun.shadow.camera.left = -4;
        this.sun.shadow.camera.top = 5;
        this.sun.shadow.camera.bottom = -3.5;
        this.sun.shadow.mapSize.set(1500,1500); // resolution
        this.sun.shadow.normalBias = 0.1;
        this.sun.position.set(-1, 15, 7);

        // plane under the room
        const geometry = new THREE.BoxGeometry(500, 500, 500);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        });
        const box = new THREE.Mesh(geometry, material);
        box.position.y = 250;
        box.receiveShadow = true;
        
        scene.fog = new THREE.Fog(colors.day.environment.fog, 20, 100); // fog
        // add everythong to scene
        scene.add(box);
        scene.add(this.sun);
        scene.add(this.hlight);

        // select theme for 3d environment
        const hours = new Date().getHours();
        if (hours > 19 || hours < 7) this.swicthTheme();

        themeBtn.addEventListener("click", this.swicthTheme); // listen for theme change
    }

    swicthTheme = () => { // update color theme
        themeBtn.parentNode.classList.toggle("night");
        if (document.querySelector(".night")) {
            this.hlight.intensity = colors.night.environment.light[1];
            this.sun.intensity = colors.night.environment.sun[1];
            this.hlight.color.setHex(colors.night.environment.light[0]);
            this.sun.color.setHex(colors.night.environment.sun[0]);
            scene.fog = new THREE.Fog(colors.night.environment.fog, 20, 100);
            setColors("night");
        } else {
            this.hlight.intensity = colors.day.environment.light[1];
            this.sun.intensity = colors.day.environment.sun[1];
            this.hlight.color.setHex(colors.day.environment.light[0]);
            this.sun.color.setHex(colors.day.environment.sun[0]);
            scene.fog = new THREE.Fog(colors.day.environment.fog, 20, 100);
            setColors("day");
        }
    }

    addPointLight = (pos) => { // create a point light based on position
        if (!pos) return;
        const light = new THREE.PointLight(0xFAAC51, 1, 20, 1.5);
        light.position.set(pos.x, pos.y, pos.z);
        window.lightcolor = light.color;

        // shadows
        light.castShadow = true;
        light.shadow.camera.far = 20;
        light.shadow.mapSize.set(1500,1500);
        light.shadow.normalBias = 0.1;
        // add to scene
        scene.add(light);
        return light;
    }

    addSpotLight = (pos, target) => { // create a spot light based on position
        if (!pos || !target) return;

        const light = new THREE.SpotLight(0xffbbbb, 5, undefined, toRadian(45), 0.9, 1.8);
        light.position.set(pos.x, pos.y, pos.z);
        light.target = target;

        // shadows
        light.castShadow = true;
        light.shadow.camera.far = 20;
        light.shadow.mapSize.set(1500,1500);
        light.shadow.normalBias = 0.1;

        // add to scene
        scene.add(light);
        return light;
    }

    toggleLight = (light) => { // turn on or off light
        if (light.intensity > 0.5) {
            light["mIntensity"] = light.intensity;
            light.intensity = 0;
        }
        else if (light.mIntensity) light.intensity = light.mIntensity;
        else light.intensity = 1;
    }
}
