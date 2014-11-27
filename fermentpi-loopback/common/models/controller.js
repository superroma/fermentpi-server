module.exports = function(Controller) {

    Controller.report = function(controllerStatus, cb) {
        if(!controllerStatus){
            err = "no controllerStatus or bad format";
            cb(err);
            return;
        }
        debugger;
        var stepup = require('stepup');
        var app = require('../../server/server');
        var Fermenter = app.models.Fermenter;

        function updateSensor(sensor, fermenter, callback) {
            if(fermenter.OneWireAddress === sensor.Address && fermenter.TempSetting) {
                sensor.SetValue = fermenter.TempSetting;
            }
            callback(null);
        }
        stepup([
            function findOrCreateController(context) {
                console.log("incoming report. controllerStatus:", controllerStatus);
                console.log("1. finding-controller:"+controllerStatus.ControllerName);
                Controller.findOrCreate(
                    {where: {Name: controllerStatus.ControllerName}},
                    {Name: controllerStatus.ControllerName},
                    context.first()
                );
            },
            function findOrCreateFermeneters(context, controller) {
                console.log("2. found: ",controller);
                var group = context.group('first');
                controllerStatus.Sensors.forEach(function(sensor) {
                    console.log("2.1 sensor:", sensor);
                    Fermenter.findOrCreate(
                        {where: {ControllerID: controller.id, OneWireAddress: sensor.Address}},
                        {ControllerID: controller.id, OneWireAddress: sensor.Address, Name: sensor.Address}, 
                        group()
                    );
                });
            },
            function updateSensors(context, fermenters) {
                console.log("3. found fermenters:", fermenters.length);
                var group = context.group();
                fermenters.forEach(function(fermenter) {
                    controllerStatus.Sensors.forEach(function(sensor) {
                        console.log("updating "+ sensor.Address, fermenter.Name);
                        updateSensor(sensor, fermenter, group());
                    });                                                     
                });
            },
            function done(context) {
                console.log("reply. controllerStatus:", controllerStatus);
                return controllerStatus;
            }
        ], cb);
    }

    Controller.remoteMethod(
        'report', {
            accepts: {arg:'controllerStatus', type:'ControllerStatus'},
            returns: {arg:'controllerStatus', type:'ControllerStatus'}
        }
    );
};
//{"ControllerName":"ddddd", "Sensors":[{"Address":"123", "CurrentValue":23}]}