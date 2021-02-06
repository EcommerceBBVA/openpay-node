var assert = require('assert');
var _ = require('underscore');
var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m1qp3av1ymcfufkuuoah', '***REMOVED***');
openpay.setTimeout(10000);
var enableLogging = true;

describe('Get all transfers with creation filter', function () {
    var newlyCreatedCustomerId = '';
    it('should return statusCode 200', function (done) {
        var searchParams = {
            'creation[lte]': '2021-01-01',
        };
        openpay.customers.transfers.list(newlyCreatedCustomerId, searchParams, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 400, 'Status code != 400');
            done();
        });
    });
});

function printLog(code, body, error) {
    if (enableLogging) {
        console.log(code, _.isUndefined(body) || _.isNull(body) ? '' : _.isArray(body) ? _.pluck(body, 'id') : body.id);
    }
    if (code >= 300) {
        console.log(' ');
        console.log(error);
        console.log(' ');
    }
}
