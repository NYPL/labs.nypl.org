/*globals describe, it, before, beforeEach, afterEach */
var testUtils = require('../../utils'),
    should = require('should'),
    errors = require('../../../server/errorHandling'),

    // Stuff we are testing
    Models = require('../../../server/models');

describe("Permission Model", function () {

    var PermissionModel = Models.Permission;

    should.exist(PermissionModel);

    before(function (done) {
        testUtils.clearData().then(function () {
            done();
        }, done);
    });

    beforeEach(function (done) {
        testUtils.initData().then(function () {
            done();
        }, done);
    });

    afterEach(function (done) {
        testUtils.clearData().then(function () {
            done();
        }, done);
    });

    it("can browse permissions", function (done) {
        PermissionModel.browse().then(function (foundPermissions) {
            should.exist(foundPermissions);

            foundPermissions.models.length.should.be.above(0);

            done();
        }).then(null, done);
    });

    it("can read permissions", function (done) {
        PermissionModel.read({id: 1}).then(function (foundPermission) {
            should.exist(foundPermission);

            done();
        }).then(null, done);
    });

    it("can edit permissions", function (done) {
        PermissionModel.read({id: 1}).then(function (foundPermission) {
            should.exist(foundPermission);

            return foundPermission.set({name: "updated"}).save();
        }).then(function () {
            return PermissionModel.read({id: 1});
        }).then(function (updatedPermission) {
            should.exist(updatedPermission);

            updatedPermission.get("name").should.equal("updated");

            done();
        }).then(null, done);
    });

    it("can add permissions", function (done) {
        var newPerm = {
            name: "testperm1",
            object_type: 'test',
            action_type: 'test'
        };

        PermissionModel.add(newPerm).then(function (createdPerm) {
            should.exist(createdPerm);

            createdPerm.attributes.name.should.equal(newPerm.name);

            done();
        }).then(null, done);
    });

    it("can delete permissions", function (done) {
        PermissionModel.read({id: 1}).then(function (foundPermission) {
            should.exist(foundPermission);

            return PermissionModel['delete'](1);
        }).then(function () {
            return PermissionModel.browse();
        }).then(function (foundPermissions) {
            var hasRemovedId = foundPermissions.any(function (permission) {
                return permission.id === 1;
            });

            hasRemovedId.should.equal(false);

            done();
        }).then(null, done);
    });
});
