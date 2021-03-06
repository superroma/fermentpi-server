module.exports = function (Controller) {
    Controller.report = function (controllerStatus, req, cb) {
        if (!controllerStatus) {
            err = "no controllerStatus or bad format";
            cb(err);
            return;
        }
        var stepup = require('stepup');
        var app = require('../../server/server');
        var Fermenter = app.models.Fermenter;
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        stepup([

            function findOrCreateController(context) {
                console.log("incoming report. controllerStatus:", controllerStatus);
                Controller.findOrCreate({
                        where: {
                            Name: controllerStatus.ControllerName
                        }
                    }, {
                        Name: controllerStatus.ControllerName
                    },
                    context.first()
                );
            },
            function updateController(context, controller) {
                controller.LastIP = ip;
                controller.save(context.first());
            },
            function findOrCreateFermeneters(context, controller) {
                var allDone = context.group();
                if (controllerStatus.Sensors) {
                    controllerStatus.Sensors.forEach(function (sensor) {
                        context.run([

                            function ensureFermenter(context1) {
                                context1.data.sensor = sensor;
                                Fermenter.findOrCreate({
                                        where: {
                                            controllerId: controller.id,
                                            OneWireAddress: sensor.Address
                                        }
                                    }, {
                                        controllerId: controller.id,
                                        OneWireAddress: sensor.Address,
                                        Name: sensor.Address
                                    },
                                    context1.first()
                                );
                            },
                            function processFermenter(context1, fermenter) {
                                if (fermenter.TempSetting) {
                                    context1.data.sensor.SetValue = fermenter.TempSetting;
                                }
                                fermenter.LastTemp = context1.data.sensor.CurrentValue;
                                fermenter.LastDate = new Date();
                                fermenter.save(context1.first());
                            }
                        ], allDone());
                    });
                }
            },
            function done(context) {
                console.log("reply. controllerStatus:", controllerStatus);
                return controllerStatus;
            }
        ], cb);
    }

    Controller.remoteMethod(
        'report', {
            accepts: [{
                arg: 'controllerStatus',
                type: 'ControllerStatus'
            }, {
                arg: 'req',
                type: 'object',
                http: {
                    source: 'req'
                }
            }],
            returns: {
                arg: 'controllerStatus',
                type: 'ControllerStatus'
            }
        }
    );
};
//{"Sensors": [{"CurrentValue": 22.0, "Address": "0000066d868f"}], "ControllerName": "brewferm1"}