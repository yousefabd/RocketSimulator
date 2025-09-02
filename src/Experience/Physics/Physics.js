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
    //console.log(net)
    return net;
  }

  computeAerodynamicTorque() {
    const velocity = state.velocity.clone();
    const windDirection = velocity.clone().negate().normalize();
    const v = velocity.length();
  
    if (v < 1e-3) return new THREE.Vector3(0, 0, 0);
  
    const Cd = constants.finDragCoefficient;
    const A = this.rocket.finArea;
    const rho = state.airDensity;
    const d = this.rocket.finOffset;
  
    const deflection = this.rocket.controller.finDeflection;
  
    // === Local axes ===
    const pitchLever = new THREE.Vector3(1, 0, 0).multiplyScalar(-d).applyQuaternion(this.rocket.orientation); // pitch
    const yawLever = new THREE.Vector3(0, 0, 1).multiplyScalar(-d).applyQuaternion(this.rocket.orientation); // yaw
  
    const deflections = [deflection.yaw, deflection.pitch];
    const arms = [pitchLever,yawLever];
    
    let totalTorque = new THREE.Vector3();
    
    for (let i = 0; i < 2; i++) {
      const deflectionAngle = deflections[i];
      if (Math.abs(deflectionAngle) < 1e-4) continue;

      const arm = arms[i];

      const sinAngle = Math.sin(deflectionAngle);
    
      const liftMag = 0.5 * Cd * rho * A * v * v * sinAngle;
      const liftForce = windDirection.clone().multiplyScalar(liftMag);
    
      const torque = arm.clone().cross(liftForce);
      totalTorque.add(torque);
    }
    
    return totalTorque;    
  }
  computeDampingTorque(){
    const angVelocity = state.angularVelocity.clone();
    const dampingDirection = angVelocity.clone().negate().normalize();
    const ω = angVelocity.length();

    const Cd = constants.angularDampingCoefficient;
    const rho = state.airDensity;
    const A = constants.dampingArea();
    const d = constants.diameter / 2;
    const l = this.rocket.finOffset;
    const dampMag = Cd * rho * A * l * l * ω;
    const dampForce = dampingDirection.clone().multiplyScalar(dampMag);
    const torque = dampForce.clone().multiplyScalar(d);
    return torque;
  }
  computeThrustTorque(){
    const thrustDir = this.rocket.controller.thrustRotationDir.clone().applyQuaternion(this.rocket.orientation);
    const mdot = this.rocket.finMassFlowRate;
    const Ve = this.rocket.finExhaustVelocity;
    const Pe = this.rocket.fuelExitPressure;
    const P0 = state.airPressure;
    const Ae = this.rocket.finNozzleExitArea;
    const d = this.rocket.finOffset;

    const thrustMag = mdot * Ve + (Pe - P0) * Ae; 
    const thrustForce = thrustDir.clone().multiplyScalar(thrustMag);
    return thrustForce.clone().multiplyScalar(d);
  }
  handleTranslationalMotion() {
    const netForce = this.computeNetForce();
    const mass = this.rocket.getTotalMass();

    // a = F / m
    const acceleration = netForce.clone().divideScalar(mass);
    // v = v + a * dt
    state.velocity.add(acceleration.clone().multiplyScalar(this.time.delta));

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
    //α = ΣΓ / IΔ
    const aerodynamicTorque = this.computeAerodynamicTorque();
    const dampingTorque = this.computeDampingTorque();
    const thrustTorque = this.computeThrustTorque();
    state.torque = aerodynamicTorque.add(dampingTorque).add(thrustTorque);
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
