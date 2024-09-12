var assert = require('assert');
var _ = require('underscore');

var BbvaApi = require('../lib/BbvaAPI');
/*Sandbox*/
var bbva = new BbvaApi('mwsz37ilxhx1ejjlxfme', 'sk_736dff4696b240f6b9351a75e797a6c0', "138.85.61.94");
bbva.setTimeout(30000);
var enableLogging = true;

describe('Get cards list with creation[lte] filter', function () {
    this.timeout(0);
    it('should return cards list and 200 status code', function (done) {
        var searchParams = {
            'creation[gte]': '2021-01-01',
            'limit': 1
        };
        bbva.cards.list(searchParams, function (error, body, response) {
            printLog(response.statusCode, body, error);
            assert.equal(response.statusCode, 200, '');
            done();
        });
    })
})

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
