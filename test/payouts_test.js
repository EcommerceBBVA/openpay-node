var assert = require('assert');
var _ = require('underscore');

var Openpay = require('../lib/openpay');
/*Sandbox*/
var openpay = new Openpay('m1qp3av1ymcfufkuuoah', '***REMOVED***');
openpay.setTimeout(20000);
var enableLogging = true;

describe('Get all payouts with filters creation and amount', function(){
    it('should return statusCode 200', function (done){
        var searchParams = {
            'amount[lte]': 1000,
            'creation[gte]': '2020-01-01',
            'limit':1
        };
        openpay.payouts.list(searchParams, function (error, body, response){
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, 'Status code == 200');
            done();
        });
    });
});

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
