import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
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
            rocket = new Rocket({
                dryMass: 22200 + 410900 - 30000,      // in kg
                fuelMass: 410900 - 410900 + 30000,    // in kg
                exhaustVelocity: 2380,                // in m/s
                massFlowRate: 2055                    // in kg/s
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
        }
    }
}