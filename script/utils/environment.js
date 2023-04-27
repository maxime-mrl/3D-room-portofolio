const themeBtn = document.querySelector("#night-switch");
const colors = {
    day: {
        environment: {
            light: [0xFCE8B0, 1],
            sun: [0xFDEEC4, 2],
            fog: 0xe8e7e1
        },
        css: {
            green: "176, 215, 181",
            beige: "223, 219, 212",
            black: "30, 30, 30",
            text: "30, 30, 30",
        }
    },
    night: {
        environment: {
            light: [0x6D72C3, 0.2],
            sun: [0x94C5CC, 0.1],
            fog: 0x5b6378
        },
        css: {
            green: "36, 76, 64",
            beige: "73, 71, 97",
            black: "30, 30, 30",
            text: "239, 241, 237",
        }
    },
}

export default class Environment { // create every environment elements (ambiantlight sun ground fog, and then diverse type of light as needed)
    constructor() {
        this.hlight = new THREE.AmbientLight(colors.day.environment.light[0], colors.day.environment.light[1]);
        this.sun = new THREE.DirectionalLight(colors.day.environment.sun[0], colors.day.environment.sun[1]);

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

        scene.fog = new THREE.Fog(colors.day.environment.fog, 20, 100);
        scene.add(plane);
        scene.add(this.sun);
        scene.add(this.hlight);

        themeBtn.addEventListener("click", this.swicthTheme);
    }

    swicthTheme = () => {
        themeBtn.parentNode.classList.toggle("night")
        if (document.querySelector(".night")) {
            this.hlight.intensity = colors.night.environment.light[1];
            this.sun.intensity = colors.night.environment.sun[1];
            this.hlight.color.setHex(colors.night.environment.light[0]);
            this.sun.color.setHex(colors.night.environment.sun[0]);
            scene.fog = new THREE.Fog(colors.night.environment.fog, 20, 100);

            document.documentElement.style.setProperty('--green', colors.night.css.green);
            document.documentElement.style.setProperty('--beige', colors.night.css.beige);
            document.documentElement.style.setProperty('--black', colors.night.css.black);
            document.documentElement.style.setProperty('--text', colors.night.css.text);
        } else {
            this.hlight.intensity = colors.day.environment.light[1];
            this.sun.intensity = colors.day.environment.sun[1];
            this.hlight.color.setHex(colors.day.environment.light[0]);
            this.sun.color.setHex(colors.day.environment.sun[0]);
            scene.fog = new THREE.Fog(colors.day.environment.fog, 20, 100);

            document.documentElement.style.setProperty('--green', colors.day.css.green);
            document.documentElement.style.setProperty('--beige', colors.day.css.beige);
            document.documentElement.style.setProperty('--black', colors.day.css.black);
            document.documentElement.style.setProperty('--text', colors.day.css.text);
        }
    }

    addPointLight = (pos) => { // create a point light based on position
        if (!pos) return console.error("cannot add spot light parameters not given");
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
        if (!pos || !target) return console.error("cannot add spot light parameters not given");

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
