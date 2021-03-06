const Homey = require('homey');
const miio = require('miio');

const initFlowAction = (favoriteFlow) => ({
  favoriteFlow: new Homey.FlowCardAction(favoriteFlow).register()
})

function randomGUID() {
  function id() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return id() + id() + '-' + id() + '-' + id() + '-' + id() + '-' + id() + id() + id();
}

class YeelightColorBulb extends Homey.Driver {

  onInit() {
    this.actions = {
      favoriteFlow: initFlowAction('favorite_flow_color1_bulb')
    }
  }

  onPair( socket ) {
    let pairingDevice = {};
    pairingDevice.name = 'Yeelight Color Bulb';
    pairingDevice.settings = {};
    pairingDevice.data = {};

    socket.on('connect', function( data, callback ) {
        this.data = data;
        miio.device({
          address: data.ip,
          token: data.token
        }).then(device => {
          device.call("miIO.info", []).then(value => {
            if (value.model == this.data.model) {
              device.call("get_prop", ["bright"]).then(value => {
                let result = {
                  bright: value[0]
                }
                pairingDevice.settings.deviceIP = this.data.ip;
                pairingDevice.settings.deviceToken = this.data.token;
    
                callback(null, result);
              }).catch(function(error) {
                callback(null, error);
              });
            } else {
              let result = {
                notDevice: 'It is not Yeelight color bulb'
              }
              callback(null, result)
            }
          }).catch(function(error) {
            callback(null, error);
          });
        }).catch(function (error) {
          if (error == "Error: Could not connect to device, handshake timeout") {
            callback(null, 'timeout')
          } if (error == "Error: Could not connect to device, token might be wrong") {
            callback(null, 'wrongToken')
          } else {
              callback(error, 'Error');
          }
        });
    });
    socket.on('done', function( data, callback ) {
      pairingDevice.data.id = randomGUID();
      callback( null, pairingDevice );
    });
  }
}

module.exports = YeelightColorBulb;
