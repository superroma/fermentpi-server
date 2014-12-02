describe('API', function () {
    var loopback = require('loopback');
    var request = require('supertest');
    var server = require('../server/server');
    var app;
    
    beforeEach(function(){
        app = server;
        //app.use(app.rest());
    });
    
    it('should list controllers', function (done) {
        request(app).get('/api/Controllers')
        .expect(200);
    });
})