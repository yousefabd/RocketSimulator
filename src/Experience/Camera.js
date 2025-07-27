import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setControls();

        this.target = null;
        this.prevTargetPos = new THREE.Vector3();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1660);
        this.instance.position.set(6, 4, 8); // Initial position
        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.screenSpacePanning = false;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    setTarget(target) {
        this.target = target;

        // Set initial camera position relative to the rocket
        const targetWorldPos = new THREE.Vector3();
        this.target.transform.getWorldPosition(targetWorldPos);

        const offset = new THREE.Vector3(0, 2, 25); // relative offset
        this.instance.position.copy(targetWorldPos).add(offset);

        // Set controls target to the rocket
        this.controls.target.copy(targetWorldPos);

        // Save initial position
        this.prevTargetPos.copy(targetWorldPos);
    }

    update() {
        if (this.target) {
            const currentPos = new THREE.Vector3();
            this.target.transform.getWorldPosition(currentPos);

            const delta = new THREE.Vector3().subVectors(currentPos, this.prevTargetPos);

            // Move camera and orbit target by same delta
            this.instance.position.add(delta);
            this.controls.target.add(delta);

            // Update stored position
            this.prevTargetPos.copy(currentPos);
        }

        this.controls.update();
    }
}
