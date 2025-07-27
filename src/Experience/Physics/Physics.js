import { forces } from './Force.js';
import { state } from './state.js';
import Experience from '../Experience.js';
import * as THREE from 'three';

export default class Physics {
  constructor(rocket) {
    this.rocket = rocket; // for mass, etc.
    this.experience = new Experience();
    this.time = this.experience.time;
  }

  computeNetForce() {
    const net = new THREE.Vector3();
    for (const key in forces) {
      net.add(forces[key].vector);
    }
    return net;
  }

  update() {
    const netForce = this.computeNetForce();
    const mass = this.rocket.getTotalMass();

    // a = F / m
    const acceleration = netForce.clone().divideScalar(mass);
    // v = v + a * dt
    state.velocity += acceleration.y * this.time.delta;

    // h = h + v * dt
    state.altitude += state.velocity * this.time.delta;
  }
}
