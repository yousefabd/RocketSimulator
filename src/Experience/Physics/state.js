import {constants} from './constants.js'

export const state = {
  altitude: 0,

  get airDensity() {
    return constants.seaLevelDensity * Math.exp(-this.altitude / constants.scaleHeight);
  },

  get gravityAcceleration(){
    return constants.GravitationalContant * constants.earthMass / Math.pow(constants.earthRadius + this.altitude, 2);
  },

  velocity: 0,
};