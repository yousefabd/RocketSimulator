import EventEmitter from './Utils/EventEmitter.js'

export default class ExperimentSetupUI extends EventEmitter {
  constructor() {
      super()
      this.container = document.querySelector('.experiment-overlay')
      this.button = this.container.querySelector('#startExperiment')

      this.button.addEventListener('click', () => {
          const values = {
              dryMass: parseFloat(this.container.querySelector('#dryMass').value),
              fuelMass: parseFloat(this.container.querySelector('#fuelMassInput').value),
              exhaustVelocity: parseFloat(this.container.querySelector('#exhaustVelocity').value),
              massFlowRate: parseFloat(this.container.querySelector('#massFlow').value),
              fuelExitPressure: parseFloat(this.container.querySelector('#exitPressure').value),
              nozzleExitArea: parseFloat(this.container.querySelector('#exitArea').value),
          }

          this.trigger('experimentStart', [values])
          this.hide()
      })
  }

  show() {
      this.container.style.display = 'flex'
  }

  hide() {
      this.container.style.display = 'none'
  }
}