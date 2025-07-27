export const constants = {
  dragCoefficient: 0.5,
  diameter: 0.3,                       //m
  frontalArea(){                       //m^2
    const radius = this.diameter/2;
    return Math.PI*radius*radius;
  },
  seaLevelDensity: 1.225,              //kg/m^3
  scaleHeight: 8500,                   //m

  GravitationalContant: 6.67430e-11, 
  earthMass: 5.972e24,                 // kg
  earthRadius: 6.371e6                 // m

}