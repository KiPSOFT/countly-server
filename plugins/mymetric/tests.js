var request = require('supertest');
var should = require('should');
var testUtils = require("../../test/testUtils");
request = request(testUtils.url);

var APP_KEY = "";
var API_KEY_ADMIN = "";
var APP_ID = "";
var DEVICE_ID = "1234567890";

describe('Testing My Metric metrics', function() {
    describe('Writing metrics', function() {
        it('should success', function(done) {
            request
                .get('/i/mymetric?device_id=' + DEVICE_ID + '&app_key=' + APP_KEY + '&my_metric=2020-01-08&my_metric_count=55')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', '');
                    setTimeout(done, 300 * testUtils.testScalingFactor);
                });
        });
    });
    describe('Verify metric', function() {
        it('should have density', function(done) {
            request
                .get('/o/mymetric?t1=2020-1-01&t2=2020-1-31')
                .expect(200)
                .end(function(err, res) {
                    var ob = JSON.parse(res.text);
                    ob.length.should.be.above(0);
                });
        });
    });
});