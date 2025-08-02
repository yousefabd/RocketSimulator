export const constants = {
  //rocket constants
  dragCoefficient: 0.5,
  finDragCoefficient : 1.8,
  angularDampingCoefficient: 100.2,
  diameter: 7.6,                        //m
  length : 45.8,                        //m
  frontalArea(){                       //m^2
    const radius = this.diameter/2;
    return Math.PI*radius*radius;
  },
  dampingArea(){
    return this.diameter * this.length;
  },

  //environment constants
  seaLevelDensity: 1.225,              //kg/m^3
  scaleHeight: 8500,                   //m

  GravitationalContant: 6.67430e-11, 
  earthMass: 5.972e24,                  // kg
  earthRadius: 6.371e6,                 // m
  molarAirMass: 0.0289644,              //kg/mol
  gasConstant: 8.31432,                 //N.m/(mol.K)
  airTemperature: 305,                  //K
  groundAirPressure: 101325,            //Pa

}