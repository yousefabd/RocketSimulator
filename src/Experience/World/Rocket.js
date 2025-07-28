import * as THREE from 'three'
import Experience from '../Experience.js'
import Physics from '../Physics/Physics.js';
import {state} from '../Physics/state.js';

export default class Rocket{
  
  constructor({
    dryMass,
    fuelMass,
    exhaustVelocity,
    massFlowRate,
    finOffset = 2,
    finArea = 0.1
    } = {}){
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug

    // === Rocket Parameters ===
    this.dryMass = dryMass                  // kg
    this.maxFuelMass = fuelMass             // kg
    this.fuelMass = 0
    this.exhaustVelocity = exhaustVelocity  // m/s
    this.massFlowRate = massFlowRate        // kg/s
    this.finArea = finArea                  // m^2
    this.finOffset = finOffset              // m
    this.engineStarted = false;

    this.physics = new Physics(this);

    // Debug
    if(this.debug.active)
    {
        this.debugFolder = this.debug.ui.addFolder('rocket')
    }

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
    this.finDeflection = {
      pitch: 0,
      yaw: 0,
      roll: 0
    };

    if(this.debug.active){
      this.debugFolder.add(this.transform.position,'y').min(0).max(100).name("rocket position manual");
      this.debugFolder.add(this,'engineStarted').name("start engine").onChange((start)=>{
        if(start){
          this.fuelMass = this.maxFuelMass;
        }
      });
      this.debugFolder.add(this,'testTorque');
      this.debugFolder.add(this.finDeflection, 'yaw').min(-0.5).max(0.5).step(0.01).name('Yaw Deflection');
      this.debugFolder.add(this.finDeflection, 'pitch').min(-0.5).max(0.5).step(0.01).name('Pitch Deflection');
      // this.debugFolder.add(this.transform.rotation,'x').min(-9).max(9)
      // this.debugFolder.add(this.transform.rotation,'y').min(-9).max(9)
      // this.debugFolder.add(this.transform.rotation,'z').min(-9).max(9)
    }
  }
  testTorque() {
    state.torque.set(0,0,10);
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
    this.burnFuel(this.time.delta);
    this.physics.update();
    //console.log(state.altitude / 1000)
    this.position.copy(state.position);
    this.orientation.copy(state.orientation);
  }
}