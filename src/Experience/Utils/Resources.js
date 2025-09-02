import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.manager = new THREE.LoadingManager();
        this.manager.onError = function (url) {
            console.error('There was an error loading ' + url);
        };
        this.loaders.gltfLoader = new GLTFLoader(this.manager);
        this.loaders.objLoader = new OBJLoader(this.manager);
        this.loaders.mtlLoader = new MTLLoader(this.manager);
        this.loaders.textureLoader = new THREE.TextureLoader(this.manager);
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.manager);
    }

    startLoading() {
        for (const source of this.sources) {
            // GLTF
            if (source.type === 'gltffModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => this.sourceLoaded(source, file),
                    undefined,
                    (error) => console.error('GLTF Load Error:', source.path, error)
                );
            }

            // OBJ
            else if (source.type === 'objModel') {

                this.loaders.objLoader.load(
                    source.path,
                    (model) => {
                        if (source.textures) {
                            const materialParams = {};

                            if (source.textures.diffuseMap) {
                                materialParams.map = this.loaders.textureLoader.load(source.textures.diffuseMap);
                            }
                            if (source.textures.normalMap) {
                                materialParams.normalMap = this.loaders.textureLoader.load(source.textures.normalMap);
                            }
                            if (source.textures.roughnessMap) {
                                materialParams.roughnessMap = this.loaders.textureLoader.load(source.textures.roughnessMap);
                            }
                            if (source.textures.metalnessMap) {
                                materialParams.metalnessMap = this.loaders.textureLoader.load(source.textures.metalnessMap);
                            }

                            const material = new THREE.MeshStandardMaterial(materialParams);

                            model.traverse((child) => {
                                if (child.isMesh) {
                                    child.material = material;
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            });
                        }

                        this.sourceLoaded(source, model);
                    },
                    undefined,
                    (error) => console.error('OBJ Load Error:', source.path, error)
                );
            }
            

            // Single texture
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => this.sourceLoaded(source, file),
                    undefined,
                    (error) => console.error('Texture Load Error:', source.path, error)
                );
            }

            // Cube texture
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => this.sourceLoaded(source, file),
                    undefined,
                    (error) => console.error('CubeTexture Load Error:', source.path, error)
                );
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file;
        this.loaded++;

        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}
