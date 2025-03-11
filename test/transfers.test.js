var assert = require('assert');
var _ = require('underscore');
var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m1qp3av1ymcfufkuuoah', 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
openpay.setTimeout(3000)

var enableLogging = true;
var customerId = '';
var testCreateCustomer = {
    "name": "Juan",
    "email": "juan@nonexistantdomain.com"
};

describe('Get all transfers with creation filter', function () {
    this.timeout(0);
    it('should return statusCode 200', function (done) {
        var searchParams = {
            'creation[lte]': '2021-01-01',
            'limit': 10000
        };
        console.log('timeout:', openpay.timeout)
        openpay.customers.create(testCreateCustomer, function (error, body) {
            openpay.customers.transfers.list(body.id, searchParams, function (error, body, response) {
                console.log('timeout', response.timeout)
                printLog(response.statusCode, body, error);
                assert.equal(response.statusCode, 200, 'Status code != 400');
                done();
            });
        });
    })
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
