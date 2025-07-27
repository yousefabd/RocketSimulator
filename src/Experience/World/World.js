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
            rocket = new Rocket(
                22200,    // dryMass in kg
                410900,   // fuelMass in kg
                2380,     // exhaustVelocity in m/s
                2055      // massFlowRate in kg/s
            )
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