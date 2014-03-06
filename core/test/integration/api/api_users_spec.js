/*globals describe, before, beforeEach, afterEach, it */
var testUtils = require('../../utils'),
    should    = require('should'),

    // Stuff we are testing
    DataGenerator = require('../../utils/fixtures/data-generator'),
    UsersAPI       = require('../../../server/api/users');

describe('Users API', function () {

    before(function (done) {
        testUtils.clearData().then(function () {
            done();
        }, done);
    });

    beforeEach(function (done) {
        testUtils.initData()
            .then(function () {
                return testUtils.insertDefaultFixtures();
            })
            .then(function () {
                done();
            }, done);
    });

    afterEach(function (done) {
        testUtils.clearData().then(function () {
            done();
        }, done);
    });

    it('can browse', function (done) {
        UsersAPI.browse().then(function (results) {
            should.exist(results);
            results.length.should.be.above(0);
            testUtils.API.checkResponse(results[0], 'user');
            done();
        }).then(null, done);
    });
});