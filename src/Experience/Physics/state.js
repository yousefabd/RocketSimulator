import {constants} from './constants.js'
import * as THREE from 'three'

export const state = {
  //environmental state
  get airDensity() {
    return constants.seaLevelDensity * Math.exp(-this.altitude / constants.scaleHeight);
  },
  get airPressure(){
    const P0 = constants.groundAirPressure;
    const g = this.gravityAcceleration;
    const M = constants.molarAirMass;
    const h = this.altitude;
    const R = constants.gasConstant;
    const T = constants.airTemperature;

    return P0 * Math.exp(-g*M*h/(R*T))
  },
  get gravityAcceleration(){
    const r = this.position.distanceTo(constants.earthCenter);
    return constants.GravitationalConstant * constants.earthMass / (r * r);
  },
  //rocket translational motion state
  position: new THREE.Vector3(0, 0, 0),

  velocity: new THREE.Vector3(0, 0, 0),

  get altitude() {
    // distance from Earth center minus radius
    return this.position.distanceTo(constants.earthCenter) - constants.earthRadius;
  },
  
  //rocket rotational motion state
  //ω
  angularVelocity: new THREE.Vector3(),

  //IΔ
  momentOfInertia: 0,

  //τ
  torque: new THREE.Vector3(),

  orientation: new THREE.Quaternion()
};