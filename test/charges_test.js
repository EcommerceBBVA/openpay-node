var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m1qp3av1ymcfufkuuoah', 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
openpay.setTimeout(30000);
var enableLogging = true;

describe('Get charges list with amount[lte] filter', function () {
    this.timeout(0);
    it('should return charges list and 200 status code', function(done) {
        var searchParams = {
            'amount[lte]': 10000,
            'creation[gte]': '2021-01-01',
            'limit':1
        };
        openpay.charges.list(searchParams, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
        });
    })
})

function printLog(code, body, error){
    if(enableLogging){
        console.log(code, _.isUndefined(body) || _.isNull(body) ? '' : _.isArray(body) ? _.pluck(body, 'id') : body.id);
    }
    if(code>=300){
        console.log(' ');
        console.log(error);
        console.log(' ');
    }
}
