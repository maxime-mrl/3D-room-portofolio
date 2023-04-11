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
            color: 0xffeeaa,
            side: THREE.BackSide
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.y = 500;
        plane.receiveShadow = true;
        plane.castShadow = true;

        scene.add(plane);
        scene.add(this.sun);
        scene.add(this.hlight);
        scene.fog = new THREE.Fog(0xffffff, 20, 100);
        
        const sunHelper = new THREE.CameraHelper(this.sun.shadow.camera);
        scene.add(sunHelper);
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
        //helpers
        const helper = new THREE.PointLightHelper(light, 0.3);
        // add to scene
        scene.add(helper);
        scene.add(light);
        return light;
    }

    addSpotLight = (pos, target) => { // create a spot light based on position
        if (!pos || !target) {
            console.error("cannot add spot light parameters not given");
            return;
        }
        const light = new THREE.SpotLight(0xffbbbb, 2.8, undefined, toRadian(45), 0.9, 1.8);
        light.position.set(pos.x, pos.y, pos.z);
        light.target = target;

        // shadows
        light.castShadow = true;
        light.shadow.camera.far = 20;
        light.shadow.mapSize.set(1500,1500);
        light.shadow.normalBias = 0.1;
        //helpers
        const helper = new THREE.CameraHelper(light.shadow.camera);
        // add to scene
        scene.add(helper);
        scene.add(light);
        return light;
    }

    toggleLight = (light) => {
        if (light.intensity > 0.5) light.intensity = 0;
        else light.intensity = 1;
    }
}