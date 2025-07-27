export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'rocketModel',
        type: 'objModel',
        path: 'models/Rocket/rocket.obj',
        textures: {
            diffuseMap: 'models/Rocket/textures/10038.jpg',
            normalMap: 'models/Rocket/textures/10038.jpg_normalmap.jpg',
            roughnessMap: 'models/Rocket/textures/3968.png',         // Assumed use
            alternateDiffuse: 'models/Rocket/textures/316.02.20.jpg' // Optional, if needed
        }
    }
    
    // {
    //     name: 'foxModel',
    //     type: 'gltfModel',
    //     path: 'models/Fox/glTF/Fox.gltf'
    // }
]