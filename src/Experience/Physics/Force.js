import {rocket} from '../World/World.js'
import {constants} from './constants.js'
import {state} from './state.js'
import * as THREE from 'three'

const up = () => new THREE.Vector3(0, 1, 0);
const down = () => new THREE.Vector3(0, -1, 0);

export default class Force {
  constructor(getValue, getDirection) {
    this.getValue = getValue;       // Function returning scalar (N)
    this.getDirection = getDirection; // Function returning THREE.Vector3
  }

  get vector() {
    return this.getDirection().clone().normalize().multiplyScalar(this.getValue());
  }
}


export const forces = {
  thrust: new Force(
    () => rocket.fuelMass > 0 ? rocket.massFlowRate * rocket.exhaustVelocity : 0,
    () => up().applyQuaternion(rocket.orientation)
  ),

  drag: new Force(
    () => {
      const Cd = constants.dragCoefficient;
      const rho = state.airDensity;
      const A = constants.frontalArea();
      const v = state.velocity.length();
      return 0.5 * Cd * rho * A * v * v;
    },
    () => state.velocity.clone().negate().normalize() // drag opposes motion
  ),

  weight: new Force(
    () => {
      const m = rocket.getTotalMass();
      const g = state.gravityAcceleration;
      return m * g;
    },
    down
  )
};