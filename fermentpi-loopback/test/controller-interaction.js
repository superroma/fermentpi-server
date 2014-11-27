var expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://0.0.0.0:3000');

describe('Api check', function () {
    it('should list controllers', function (done) {
        api.get('/api/Controllers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });
})