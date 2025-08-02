import * as THREE from 'three'
import Experience from '../Experience.js'
import Physics from '../Physics/Physics.js';
import {state} from '../Physics/state.js';
import RocketController from './RocketController.js';

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
    this.fuelMass = 0
    this.exhaustVelocity = exhaustVelocity        // m/s
    this.massFlowRate = massFlowRate              // kg/s
    this.finArea = finArea                        // m^2
    this.finOffset = finOffset                    // m
    this.fuelExitPressure = fuelExitPressure      // Pa
    this.nozzleExitArea = nozzleExitArea;         // m^2
    this.finExhaustVelocity = finExhaustVelocity; // m/s
    this.finMassFlowRate = finMassFlowRate;       // kg/s
    this.finNozzleExitArea = finNozzleExitArea    // m^2


    this.physics = new Physics(this);

    this.controller = new RocketController(this);

    // Resource
    //this.transform = this.resources.items.rocketModel
    this.transform = new THREE.Mesh(
      new THREE.BoxGeometry(1,9.5,1),
      new THREE.MeshStandardMaterial({color:0x00a00f})
    );
    //offset rotation to make the model vertical until I find an actual vertical model;
    this.offsetQuaternion = new THREE.Quaternion(-0.03742589084626636,0.014087212039777891,0.35199245146238406,0.9351482060426629);
    this.transform.quaternion.copy(this.offsetQuaternion);
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
    const burned = this.massFlowRate * deltaTime
    this.fuelMass = Math.max(this.fuelMass - burned, 0)
  }

  update(){
    this.burnFuel(this.time.delta);
    this.physics.update();
    //console.log(state.altitude / 1000)
    //moving the whole world down instead of the rocket up because three.js is trash
    this.scene.children.forEach((child)=>{
      if(child !== this.transform && child !== this.experience.camera.instance){
        child.position.sub(state.position.clone().sub(this.prev))
        this.prev = state.position.clone();
      }
    })
    this.orientation.copy(state.orientation);

  }
}