import * as THREE from 'three'
import Experience from '../Experience.js'
export default class Rocket{
  constructor(){
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug

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
      // this.debugFolder.add(this.transform.rotation,'x').min(-9).max(9)
      // this.debugFolder.add(this.transform.rotation,'y').min(-9).max(9)
      // this.debugFolder.add(this.transform.rotation,'z').min(-9).max(9)
    }
    this.scene.add(this.transform)
  }
}