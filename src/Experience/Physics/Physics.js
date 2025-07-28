import { forces } from './Force.js';
import { state } from './state.js';
import { constants } from './constants.js';
import Experience from '../Experience.js';
import * as THREE from 'three';

export default class Physics {
  constructor(rocket) {
    this.rocket = rocket; // for mass, etc.
    this.experience = new Experience();
    this.time = this.experience.time;
    this.testArrowHelpers = [];
  }

  computeNetForce() {
    const net = new THREE.Vector3();
    for (const key in forces) {
      net.add(forces[key].vector);
    }
    return net;
  }

  computeAerodynamicTorque() {
    const velocity = state.velocity.clone();
    const windVelocity = velocity.length();
    const windDirection = velocity.clone().normalize();
  
    if (windVelocity < 1e-3) return new THREE.Vector3(0, 0, 0);
  
    const Cd = constants.finDragCoefficient;
    const A = this.rocket.finArea;
    const rho = state.airDensity;
  
    const deflection = this.rocket.finDeflection;
  
    // === Local axes ===
    const localX = new THREE.Vector3(1, 0, 0).applyQuaternion(this.rocket.orientation); // pitch
    const localY = new THREE.Vector3(0, 1, 0).applyQuaternion(this.rocket.orientation); // yaw
    const localZ = new THREE.Vector3(0, 0, 1).applyQuaternion(this.rocket.orientation); // roll
    
    const armVectors = [
      new THREE.Vector3(0, -this.rocket.finOffset, 0), // yaw (vertical offset)
      new THREE.Vector3(0, 0, -this.rocket.finOffset), // pitch (back fin)
      new THREE.Vector3(this.rocket.finOffset, 0, 0)    // roll (side fin)
    ];
    const deflections = [deflection.yaw, deflection.pitch, deflection.roll];
    const axes = [localY, localX, localZ];
    
    let totalTorque = new THREE.Vector3();
    
    for (let i = 0; i < 3; i++) {
      const deflectionAngle = deflections[i];
      if (Math.abs(deflectionAngle) < 1e-4) continue;

      const arm = armVectors[i].clone().applyQuaternion(this.rocket.orientation);
      const axis = axes[i];
      const direction = windDirection.clone().applyAxisAngle(axis, deflectionAngle).normalize().negate();
      // === Compute effective angle of attack ===
      const angleOfAttack = direction.angleTo(windDirection);
      const sinAngle = Math.sin(angleOfAttack);
    
      // If sin(angle) is near 0, lift is ~0
      if (sinAngle < 1e-3) continue;
    
      // Compute lift magnitude based on deflection-induced AoA
      const liftMag = 0.5 * rho * windVelocity * windVelocity * Cd * A * sinAngle;
    
      const liftDirection = direction.clone().sub(windDirection).normalize();
      const liftForce = liftDirection.multiplyScalar(liftMag);
    
      const torque = arm.cross(liftForce);
      totalTorque.add(torque);
    }
    
    return totalTorque;    
  }
  
  handleTranslationalMotion() {
    const netForce = this.computeNetForce();
    const mass = this.rocket.getTotalMass();

    // a = F / m
    const acceleration = netForce.clone().divideScalar(mass);
    // v = v + a * dt
    state.velocity.add(acceleration.multiplyScalar(this.time.delta));

    // h = h + v * dt
    state.position.add(state.velocity.clone().multiplyScalar(this.time.delta));
    if(state.position.y<0){
      state.position.y = 0;
      state.velocity.set(0,0,0);
    }
  }
  handleRotationalMotion() {
    const dt = this.time.delta;
    const rocket = this.rocket;
    state.momentOfInertia = 0.5 * rocket.getTotalMass() * Math.pow(constants.diameter / 2, 2); // cylinder approximation
    state.torque = this.computeAerodynamicTorque();
    const angularAcceleration = state.torque.clone().divideScalar(state.momentOfInertia);
    
    // ω = ω + α * dt
    state.angularVelocity.add(angularAcceleration.multiplyScalar(dt));
  
    // Δθ from angular velocity (converted to quaternion)
    const deltaRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        state.angularVelocity.x * dt,
        state.angularVelocity.y * dt,
        state.angularVelocity.z * dt
      )
    );
  
    // Update orientation
    state.orientation.multiply(deltaRotation).normalize();
  }
  debugVisualize(){
    this.testArrowHelpers.forEach(arrow => this.experience.scene.remove(arrow));
    this.testArrowHelpers.length = 0;
    const dragArrow = new THREE.ArrowHelper(forces.drag.getDirection(),this.rocket.position,8,0x0000ff);
    this.experience.scene.add(dragArrow);
    this.testArrowHelpers.push(dragArrow);

    const weightArrow = new THREE.ArrowHelper(forces.weight.getDirection(),this.rocket.position,8,0x00ff00);
    this.experience.scene.add(weightArrow);
    this.testArrowHelpers.push(weightArrow);
    
    const thrustArrow = new THREE.ArrowHelper(forces.thrust.getDirection(),this.rocket.position,8,0xff0000);
    this.experience.scene.add(thrustArrow);
    this.testArrowHelpers.push(thrustArrow);
  }
  update() {
    this.handleTranslationalMotion();
    this.handleRotationalMotion();
    this.debugVisualize();
  }
}
