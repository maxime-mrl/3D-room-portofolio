const themeBtn = document.querySelector("#night-switch")

export default class Environment { // create every environment elements (ambiantlight sun ground fog, and then diverse type of light as needed)
    constructor() {
        this.hlight = new THREE.AmbientLight(0xFCE8B0, 1);
        this.sun = new THREE.DirectionalLight(0xFDEEC4, 2);

        this.sun.castShadow = true;
        this.sun.shadow.camera.far = 20;
        this.sun.shadow.mapSize.set(1500,1500);
        this.sun.shadow.normalBias = 0.1;
        this.sun.position.set(-1, 15, 7);

        const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.BackSide
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.y = 500;
        plane.receiveShadow = true;
        plane.castShadow = true;

        scene.fog = new THREE.Fog(0xffffff, 20, 100);
        scene.add(plane);
        scene.add(this.sun);
        scene.add(this.hlight);

        themeBtn.addEventListener("click", this.swicthTheme)
    }

    swicthTheme = () => {
        themeBtn.parentNode.classList.toggle("night")
        if (document.querySelector(".night")) {
            this.hlight.intensity = 0.2;
            this.sun.intensity = 0.5;
            this.hlight.color.setHex(0x6D72C3);
            this.sun.color.setHex(0x94C5CC);
        } else {
            this.hlight.intensity = 1;
            this.sun.intensity = 2;
            this.hlight.color.setHex(0xFCE8B0);
            this.sun.color.setHex(0xFDEEC4);
        }
    }

    addPointLight = (pos) => { // create a point light based on position
        if (!pos) {
            console.error("cannot add spot light parameters not given");
            return;
        }
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
        if (!pos || !target) {
            console.error("cannot add spot light parameters not given");
            return;
        }
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

    toggleLight = (light) => {
        if (light.intensity > 0.5) {
            light["mIntensity"] = light.intensity;
            light.intensity = 0;
        }
        else if (light.mIntensity) {
            light.intensity = light.mIntensity;
        } else {
            light.intensity = 1;
        }
    }
}