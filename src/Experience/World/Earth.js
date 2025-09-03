import * as THREE from 'three'
import Experience from '../Experience.js'
import { state } from '../Physics/state.js'
export default class Earth
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
        const radius = 1000; // Earth's radius in kilometers (or scale down for your scene)
        const widthSegments = 64;
        const heightSegments = 64;

        this.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    }

    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.earthTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.repeat.set(50, 50)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.earthColorTexture
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.color.repeat.set(1, 1)
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
        opacity: 0.0 // Start invisible
    })
    }
    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.rotation.y = - Math.PI * 0.5
        this.mesh.position.y = -1025;
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }

    update()
    {
        //Check if the rocket has reached the threshold height
        if(state.position.y >= 300)
        {
            // Calculate fade progress (0 to 1) based on how far above 500 we are
            const fadeProgress = Math.min(1, (state.position.y - 300) / 100);
            
            // Fade IN the Earth material (opposite of floor fade)
            this.material.opacity = fadeProgress;
        }
    }
}