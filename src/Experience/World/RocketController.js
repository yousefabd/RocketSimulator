import Experience from "../Experience";
import * as THREE from 'three'

export default class RocketController{
  constructor(rocket){
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.rocket = rocket;

    this.thrustRotationDir = new THREE.Vector3(0,0,0);
    this.thrustForward = false;
    this.thrustBackward = false;
    this.thrustLeft = false;
    this.thrustRight = false;

    this.finDeflection = {
      pitch: 0,
      yaw: 0,
    };
    this.engineStarted = false;
    // Debug
    if(this.debug.active)
    {
        this.debugFolder = this.debug.ui.addFolder('rocket')
    }
    if(this.debug.active){
      this.debugFolder.add(this,'engineStarted').name("start engine").onChange((start)=>{
        if(start){
          this.rocket.fuelMass = this.rocket.maxFuelMass;
        }
        else{
          this.rocket.fuelMass = 0;
        }
      });
      this.debugFolder.add(this.finDeflection, 'yaw').min(-30).max(30).step(0.1).name('Yaw Deflection');
      this.debugFolder.add(this.finDeflection, 'pitch').min(-30).max(30).step(0.1).name('Pitch Deflection');
      this.debugFolder.add(this,'thrustForward').onChange(()=>{this.calculateThrustRotation()});
      this.debugFolder.add(this,'thrustBackward').onChange(()=>{this.calculateThrustRotation()});
      this.debugFolder.add(this,'thrustLeft').onChange(()=>{this.calculateThrustRotation()});
      this.debugFolder.add(this,'thrustRight').onChange(()=>{this.calculateThrustRotation()});
    }
  }
  calculateThrustRotation(){
    this.thrustRotationDir = new THREE.Vector3(0,0,0);
    if(this.thrustForward){
      this.thrustRotationDir.x -= 1;
    }
    if(this.thrustBackward){
      this.thrustRotationDir.x += 1;
    }
    if(this.thrustLeft){
      this.thrustRotationDir.z += 1;
    }
    if(this.thrustRight){
      this.thrustRotationDir.z -= 1;
    }
    this.thrustRotationDir.normalize();
  }
}