// import * as THREE from 'three';
// import Nebula, { 
//   Emitter, Rate, Span, Position, Vector3D, SphereZone, 
//   Life, Mass, Radius, Body, RadialVelocity 
// } from 'three-nebula';
// import Experience from '../Experience';

// export default class Fire {
//   constructor(rocket) {
//     this.experience = new Experience();
//     this.time = this.experience.time;
//     this.scene = this.experience.scene;
//     this.rocket = rocket;

//     // Create Nebula particle system
//     this.particleSystem = new Nebula();

//     // Create an emitter
//     this.emitter = new Emitter()
//       .setRate(new Rate(new Span(60, 100), new Span(0.01, 0.02)))
//       .addInitializers([
//         new Position(new SphereZone(0, 0, 0, 1)),
//         new Life(0.3, 0.6),
//         new Radius(2, 6),
//         new Mass(1),
//         new RadialVelocity(50, new Vector3D(0, -1, 0), 30)
//       ])
//       .addBehaviours([
//         new Body(this.createParticleMaterial())
//       ]);

//     // Add emitter to the system
//     this.particleSystem.addEmitter(this.emitter);

//     // Start the particle system
//     this.particleSystem.emit(
//       () => {}, // onStart
//       (delta) => {
//         // Update system each frame
//         const pos = this.rocket.position;
//         this.emitter.position.set(pos.x, pos.y, pos.z);
//         this.particleSystem.update(delta);
//       },
//       () => {} // onComplete
//     );
//     this.particleMesh = this.emitter.getBehaviours()[0].body;
//     this.scene.add(this.particleMesh);
//   }

//   // If you still want an external update loop, you can keep this
//   update() {
//     // The main update is already handled in the emit() onUpdate callback
//   }

//   createParticleMaterial() {
//     const sprite = new THREE.TextureLoader().load('/textures/particles/particle.png');
//     return new THREE.PointsMaterial({
//       map: sprite,
//       blending: THREE.AdditiveBlending,
//       depthWrite: false,
//       transparent: true,
//       color: 0xffa733,
//       size: 10
//     });
//   }
// }