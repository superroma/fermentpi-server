module.exports = function(Fermenter) {
    Fermenter.afterUpdate = function(next) {
        this.TempReadings.create({When: this.LastDate, Value: this.LastTemp}, function(err) {
            if(!err) {
                next();
            }
        });
    }

};
