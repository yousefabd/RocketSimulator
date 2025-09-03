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
        name: 'skyboxTexture',
        type: 'cubeTexture',
        path: [
            'textures/skybox/clouds1_east.bmp',
            'textures/skybox/clouds1_west.bmp',
            'textures/skybox/clouds1_up.bmp',
            'textures/skybox/clouds1_down.bmp',
            'textures/skybox/clouds1_north.bmp',
            'textures/skybox/clouds1_south.bmp'
        ]
    },
   
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/Lawn_Grass_tkynejer_1K_BaseColor.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/Lawn_Grass_tkynejer_1K_Normal.jpg'
    },
    {
        name: 'earthTexture',
        type: 'texture',
        path: 'textures/earth/2k_earth_daymap.jpg'
    },
    {
        name: 'earthColorTexture',
        type: 'texture',
        path: 'textures/earth/2k_earth_normal_map.jpg'
    },
    {
        name: 'skyboxCross',
        type: 'crossCubeTexture',
        path: 'textures/skybox/Cubemap_Sky_04-512x512.png'
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
    },
    {
        name: 'spaceboxTexture',
        type: 'cubeTexture',
        path: [
            'textures/skybox/galaxy+X.jpg',
            'textures/skybox/galaxy-X.jpg',
            'textures/skybox/galaxy+Y.jpg',
            'textures/skybox/galaxy-Y.jpg',
            'textures/skybox/galaxy+Z.jpg',
            'textures/skybox/galaxy-Z.jpg'
        ]
    },
    // {
    //     name: 'foxModel',
    //     type: 'gltfModel',
    //     path: 'models/Fox/glTF/Fox.gltf'
    // }
]