const Homey = require('homey');
const model = "motion";

class MiMotionSensor extends Homey.Driver {

  onInit() {
    this.triggers = {
    }
    this.conditions = {

    }
    this.actions = {

    }
  }

  onPairListDevices(data, callback) {
    Homey.app.mihub.getDevicesByModel(model)
      .then(devices => callback(null, this.deviceList(devices)))
      .catch(() => callback(Homey.__('pair.no_devices_found')))
  }   

  deviceList(devices) {
    let sortDevices = []
    for (var sid in devices) {
      let device = devices[sid]
      let deviceList = {
        "name": device.name,
        "data": { 
          "sid": device.sid
        }
      }
      sortDevices.push(deviceList)
    }
    return sortDevices
  }
}

module.exports = MiMotionSensor;