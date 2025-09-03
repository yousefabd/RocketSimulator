import Experience from "../Experience";
import * as THREE from 'three'

export default class RocketController {
  constructor(rocket) {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.rocket = rocket;
    
    this.thrustRotationDir = new THREE.Vector3(0, 0, 0);
    this.thrustForward = false;
    this.thrustBackward = false;
    this.thrustLeft = false;
    this.thrustRight = false;

    this.finDeflection = {
      pitch: 0,
      yaw: 0,
    };
    this.engineStarted = false;

    // Bind keyboard listeners
    this.addKeyboardListeners();

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('rocket');
      this.debugFolder.add(rocket, 'engineStarted').name("start engine");
      this.debugFolder.add(this.finDeflection, 'yaw').min(-30).max(30).step(0.1).name('Yaw Deflection');
      this.debugFolder.add(this.finDeflection, 'pitch').min(-30).max(30).step(0.1).name('Pitch Deflection');
      this.debugFolder.add(this, 'thrustForward').onChange(() => { this.calculateThrustRotation() });
      this.debugFolder.add(this, 'thrustBackward').onChange(() => { this.calculateThrustRotation() });
      this.debugFolder.add(this, 'thrustLeft').onChange(() => { this.calculateThrustRotation() });
      this.debugFolder.add(this, 'thrustRight').onChange(() => { this.calculateThrustRotation() });
    }
  }

  addKeyboardListeners() {
    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyW": // Forward
          this.thrustForward = true;
          break;
        case "KeyS": // Backward
          this.thrustBackward = true;
          break;
        case "KeyA": // Left
          this.thrustLeft = true;
          break;
        case "KeyD": // Right
          this.thrustRight = true;
          break;
        case "Space": // Start engine
          this.engineStarted = !this.engineStarted;
          break;
      }
      this.calculateThrustRotation();
    });

    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyW":
          this.thrustForward = false;
          break;
        case "KeyS":
          this.thrustBackward = false;
          break;
        case "KeyA":
          this.thrustLeft = false;
          break;
        case "KeyD":
          this.thrustRight = false;
          break;
      }
      this.calculateThrustRotation();
    });
  }

  calculateThrustRotation() {
    this.thrustRotationDir = new THREE.Vector3(0, 0, 0);
    if (this.thrustForward) this.thrustRotationDir.x -= 1;
    if (this.thrustBackward) this.thrustRotationDir.x += 1;
    if (this.thrustLeft) this.thrustRotationDir.z += 1;
    if (this.thrustRight) this.thrustRotationDir.z -= 1;
    if (this.thrustRotationDir.length() > 0) {
      this.thrustRotationDir.normalize();
    }
  }
}
