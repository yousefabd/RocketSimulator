import Experience from "./Experience"
import { state } from "./Physics/state";
import { rocket } from "./World/World";
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
    this.fuelElement = document.getElementById('fuelWidget');
    this.fuelFillElement = this.fuelElement.querySelector('.fuel-fill');
    this.fuelPercentElement = document.getElementById('fuelPercent');
    this.fuelMassElement = document.getElementById('fuelMass');
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
  setFuel(){
    if(rocket){
      const percent = parseInt((rocket.fuelMass / rocket.maxFuelMass)*100)
      this.fuelFillElement.style.setProperty('--level',`${percent}%`)
      this.fuelPercentElement.textContent = `${percent}%`
      this.fuelMassElement.textContent = rocket.maxFuelMass;
      this.fuelElement.classList.remove('low', 'critical')
      if(percent <= 20){
        this.fuelElement.classList.add('critical')
      }
      else if(percent <= 60){
        this.fuelElement.classList.add('low')
      }

    }
  }
  update(){
    /*
  const massText = 

  if (!widget || !fill) return;

  // clamp between 0 and 100
  const clamped = Math.max(0, Math.min(100, percent));

  // update bar width via CSS variable
  fill.style.setProperty('--level', `${clamped}%`);

  // update percentage text
  if (percentText) {
    percentText.textContent = `${clamped.toFixed(0)}%`;
  }

  // update fuel mass text if provided
  if (massText && mass !== undefined) {
    massText.textContent = `${mass.toFixed(1)} kg`;
  }

  // remove old state classes
  widget.classList.remove('low', 'critical');

  // add new state class depending on thresholds
  if (clamped <= 20) {
    widget.classList.add('critical'); // red pulse
  } else if (clamped <= 50) {
    widget.classList.add('low'); // yellow-green
    */
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
    //fuel
    this.setFuel();
  }
}