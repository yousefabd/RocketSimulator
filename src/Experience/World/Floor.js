import * as THREE from 'three'
import Experience from '../Experience.js'
import { state } from '../Physics/state.js'
export default class Floor
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        const groundSize = 10000; // Really wide floor
        this.geometry = new THREE.PlaneGeometry(groundSize, groundSize, 1, 1)
    }

    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.grassColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.repeat.set(500, 500)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.repeat.set(500, 500)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalScale: new THREE.Vector2(0.1, 0.1),
            normalMap: this.textures.normal,
            roughness: 0.8,
            metalness: 0,
            transparent: true, // Add this
            opacity: 1.0 // Initial opacity
        })
                
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.position.y = -5;
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
    setTrees() {
    this.trees = [] // store tree meshes

    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 150;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const tree = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 1, 10, 8),
            new THREE.MeshStandardMaterial({ color: '#228B22', transparent: true, opacity: 1 })
        );
        tree.position.set(x, 0, z);
        tree.castShadow = true;

        this.trees.push(tree); // store it
        this.scene.add(tree);
    }
}
    update()
    {
        if(state.position.y >= 300)
    {
        // Calculate fade progress (0 to 1) based on how far above 500 we are
        // You can adjust the 100 value to control how quickly it fades out
        const fadeProgress = Math.min(1, (state.position.y - 300) / 100);
        
        // Fade out the floor material
        this.material.opacity = 1 - fadeProgress;
        //  this.trees.forEach(tree => {
        //     tree.material.opacity = 1 - fadeProgress;
        // });
        // Optional: Also fade out the trees if you want them to disappear too
        // You would need to store references to the trees for this to work
    }
    }

}