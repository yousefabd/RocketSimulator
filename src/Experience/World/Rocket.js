import * as THREE from 'three'
import Experience from '../Experience.js'
import Physics from '../Physics/Physics.js';
import {state} from '../Physics/state.js';
import RocketController from './RocketController.js';
import { constants } from '../Physics/constants.js';

export default class Rocket{
  
  constructor({
    dryMass,
    fuelMass,
    exhaustVelocity,
    massFlowRate,
    fuelExitPressure,
    nozzleExitArea,

    finOffset = 2,
    finArea = 0.4,
    finExhaustVelocity = 140,
    finMassFlowRate = 64,
    finNozzleExitArea = 0.16
    
    } = {}){
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug
    
    // === Rocket Parameters ===
    this.dryMass = dryMass                        // kg
    this.maxFuelMass = fuelMass                   // kg
    this.fuelMass = fuelMass      
    this.exhaustVelocity = exhaustVelocity        // m/s
    this.massFlowRate = massFlowRate              // kg/s
    this.finArea = finArea                        // m^2
    this.finOffset = finOffset                    // m
    this.fuelExitPressure = fuelExitPressure      // Pa
    this.nozzleExitArea = nozzleExitArea;         // m^2
    this.finExhaustVelocity = finExhaustVelocity; // m/s
    this.finMassFlowRate = finMassFlowRate;       // kg/s
    this.finNozzleExitArea = finNozzleExitArea    // m^2
    this.engineStarted = false;


    this.physics = new Physics(this);

    this.controller = new RocketController(this);

    // Resource
    this.transform = this.resources.items.rocketModel2
    this.transform.scale.set(0.03,0.03,0.03);
    this.transform.position.y = -5;
    // this.transform = new THREE.Mesh(
    //   new THREE.BoxGeometry(1,9.5,1),
    //   new THREE.MeshStandardMaterial({color:0x00a00f})
    // );
    this.scene.add(this.transform)

    //rocket state
    this.position = this.transform.position;
    this.orientation = this.transform.quaternion;

    this.prev = state.position.clone();
  }
  // === Get total mass (dry + remaining fuel) ===
  getTotalMass() {
    return this.dryMass + this.fuelMass
  }

  // === Fuel burn over time step (dt in seconds) ===
  burnFuel(deltaTime) {
    if(!this.engineStarted)
      return;
    const burned = this.massFlowRate * deltaTime
    this.fuelMass = Math.max(this.fuelMass - burned, 0)
  }

  update(){
    this.controller.calculateThrustRotation();
    this.engineStarted = this.controller.engineStarted;
    this.burnFuel(this.time.delta);
    this.physics.update();
    //console.log(state.altitude / 1000)
    this.scene.children.forEach((child)=>{
      if(child !== this.transform && child !== this.experience.camera.instance){
        child.position.sub(state.position.clone().sub(this.prev))
      }
    })
    this.prev = state.position.clone();
    this.orientation.copy(state.orientation);

  }
}