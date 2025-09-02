import Experience from "./Experience"
import { state } from "./Physics/state";
export default class ValuesUI{
  constructor()
  {
    this.experience = new Experience()
    this.velocityElement =  document.getElementById('velocity');
    this.angularVelocityElement = document.getElementById("angularVelocity");
    this.altitudeElement = document.getElementById("altitude");
    this.altitudeUnitElement = document.getElementById("altitudeUnit");
    this.airDensityElement = document.getElementById("airDensity");
    this.airPressureElement = document.getElementById("airPressure");
  }
  setAltitude(){
    let altitude = state.altitude.toFixed(2);
    if(altitude <= 1000){
      this.altitudeUnitElement.textContent = "m";
    }
    else{
      altitude = (altitude/1000).toFixed(2);
      this.altitudeUnitElement.textContent = "km";
    }
    this.altitudeElement.textContent = altitude;
  }
  update(){
    //velocity 
    const velocity = state.velocity.length().toFixed(2);
    this.velocityElement.textContent = velocity;
    //angularVelocity
    const angVelocity = state.angularVelocity.length().toFixed(2);
    this.angularVelocityElement.textContent = angVelocity;
    //altitude
    this.setAltitude();
    //airDensity
    const airDensity = state.airDensity.toFixed(3);
    this.airDensityElement.textContent = airDensity;
    //airPressure
    const airPressure = state.airPressure.toFixed(2);
    this.airPressureElement.textContent = airPressure;
  }
}