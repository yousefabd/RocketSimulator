import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Earth from './Earth.js'
import Rocket from './Rocket.js'
//import Fox from './Fox.js';

export let rocket = null;
export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.earth= new Earth()
            this.floor.material.transparent = true;
            this.floor.material.opacity = 1;
            this.earth.material.transparent = true;
            this.earth.material.opacity = 0;
            rocket = new Rocket({
                dryMass: 22200 ,      // in kg
                fuelMass: 410900,    // in kg
                exhaustVelocity: 3660,                // in m/s
                massFlowRate: 1280,                    // in kg/s
                fuelExitPressure: 151700,               // in Pa
                nozzleExitArea: 1.38                  // in m^2
            });
            this.rocket = rocket
            //this.fox = new Fox();
            this.environment = new Environment()
            this.experience.camera.setTarget(this.rocket)
        })
    }

    update()
    {
        if(this.rocket){
            this.rocket.update();
            this.floor.update();
            this.earth.update();
        }
    }
}