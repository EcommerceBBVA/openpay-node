var assert = require('assert');
var _ = require('underscore');
var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m1qp3av1ymcfufkuuoah', '***REMOVED***');
openpay.setTimeout(50000);
var enableLogging = true;
var customerId = '';
var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com"
};

describe('Get all transfers with creation filter', function () {
    it('should return statusCode 200', function (done) {
        var searchParams = {
            'creation[lte]': '2021-01-01',
            'limit':1
        };
        openpay.customers.create(testCreateCustomer, function (error, body) {
            openpay.customers.transfers.list(body.id, searchParams, function (error, body, response) {
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, 'Status code != 400');
                done();
            });
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
