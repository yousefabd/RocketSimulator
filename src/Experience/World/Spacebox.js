// import * as THREE from 'three'
// import Experience from '../Experience.js'
// import { state } from '../Physics/state.js'

// export default class Spacebox {
//     constructor() {
//         this.experience = new Experience()
//         this.scene = this.experience.scene
//         this.resources = this.experience.resources

//         this.cubeTexture = this.resources.items.spaceboxTexture

//         // Optional fade overlay setup
//         this.createFadeOverlay()
//     }

//     createFadeOverlay() {
//         this.camera = this.experience.camera.instance

//         // Fullscreen plane in front of camera
//         const planeGeometry = new THREE.PlaneGeometry(2, 2)
//         this.fadeMaterial = new THREE.MeshBasicMaterial({
//             color: 0xffffff,      // white skybox color; adjust if needed
//             transparent: true,
//             opacity: 0
//         })
//         this.fadePlane = new THREE.Mesh(planeGeometry, this.fadeMaterial)

//         // Add to camera so it always stays in front
//         this.camera.add(this.fadePlane)
//         this.fadePlane.position.z = -0.5
//     }

//     update() {
//         const y = state.position.y

//         // Fade in effect: fully invisible below 300, fully visible at 400
//         if (y >= 300) {
//             const fadeProgress = Math.min(1, (y - 300) / 100)
//             this.fadeMaterial.opacity = 1-  fadeProgress
//         } else {
//             this.fadeMaterial.opacity = 0
//         }
//     }
// }
