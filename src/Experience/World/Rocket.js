import * as THREE from 'three'
import Experience from '../Experience.js'
import Physics from '../Physics/Physics.js';
import {state} from '../Physics/state.js';

export default class Rocket{
  constructor(dryMass, fuelMass, exhaustVelocity, massFlowRate){
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug

    // === Rocket Parameters ===
    this.dryMass = dryMass              // kg
    this.fuelMass = fuelMass            // kg
    this.exhaustVelocity = exhaustVelocity  // m/s
    this.massFlowRate = massFlowRate    // kg/s
    this.engineStarted = false;

    this.physics = new Physics(this);

    // Debug
    if(this.debug.active)
    {
        this.debugFolder = this.debug.ui.addFolder('rocket')
    }

    // Resource
    this.transform = this.resources.items.rocketModel
    this.transform.rotation.z = 0.72;
    this.transform.rotation.x = -0.08;
    if(this.debug.active){
      this.debugFolder.add(this.transform.position,'y').min(0).max(100).name("rocket position manual");
      this.debugFolder.add(this,'engineStarted').name("start engine");
      // this.debugFolder.add(this.transform.rotation,'x').min(-9).max(9)
      // this.debugFolder.add(this.transform.rotation,'y').min(-9).max(9)
      // this.debugFolder.add(this.transform.rotation,'z').min(-9).max(9)
    }
    this.scene.add(this.transform)
  }
  // === Get total mass (dry + remaining fuel) ===
  getTotalMass() {
    return this.dryMass + this.fuelMass
  }
  
  startEngine(){
    engineStarted = true;
  }

  // === Fuel burn over time step (dt in seconds) ===
  burnFuel(deltaTime) {
    const burned = this.massFlowRate * deltaTime
    this.fuelMass = Math.max(this.fuelMass - burned, 0)
  }

  update(){
    if(!this.engineStarted)
      return;
    //engine is started
    this.burnFuel(this.time.delta);
    this.physics.update();
    //console.log(state.altitude / 1000)
    this.transform.position.y = state.altitude;
  }
}