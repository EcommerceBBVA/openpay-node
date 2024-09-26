var assert = require('assert');
var _ = require('underscore');
var urllib = require('urllib');

var BbvaApi = require('../lib/BbvaAPI');
/*Sandbox*/
var bbva = new BbvaApi('mwsz37ilxhx1ejjlxfme', 'sk_736dff4696b240f6b9351a75e797a6c0', '138.85.61.94');
bbva.setTimeout(10000);

var enableLogging = true;
var testCreateCharges = true;

// IMPORTANT NOTE ABOUT WEBHOOKS
// !! Future contributors, please read: !!
//
// The webhook url requires opening a new requestbin in https://opey-requestbin.herokuapp.com
// and entering the id as a parameter further down; otherwise the webhook check will fail.
// The current one will remain open for 60 days, according to the docs (starting Feb 3, 2021)
// If you test again after 60 days have passed, please update the url and the date
// in both comments, here and down below.
// (There should be a better way to do this)

// Defining a valid expiration year for cards, adding 5 years to the current one
var validExpirationYear = (new Date().getFullYear() + 5).toString().substr(2, 2);

describe('Testing whole API', function () {
    this.timeout(0);

    var testCreateCustomer = {
        "name": "Juan",
        "email": "juan@nonexistantdomain.com",
        // The customer requires an account to charge fees and receive transfers
        "requires_account": true
    };
    var testUpdateCustomer = {
        "name": "Juan",
        "email": "juan@nonexistantdomain.com",
        "phone_number": "123456789"
    };

    describe('Testing Webhook', function () {
        var webhook;
        var webhook_params = {
            // Update the requestbin url here. Last change: Feb 3, 2021
            'url': 'https://webhook.site/fbabe962-95c5-475c-9925-9f769ac3bc7e',
            'event_types': [
                'charge.refunded',
                'charge.failed',
                'charge.cancelled',
                'charge.created',
                'chargeback.accepted'
            ]
        };

        describe('Create Webhook', function () {
            it('Should return statusCode 201', function (done) {
                bbva.webhooks.create(webhook_params, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 201, '');
                    webhook = body;
                    done();
                });
            });
        });

        describe('Get webhook by id and status verified', function () {
            it('Should return status code 200', function (done) {
                bbva.webhooks.get(webhook.id, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    assert.equal(body.status, 'verified', '');
                    done();
                });
            });
        });


        describe('Get webhook by id and status verified', function () {
            it('Should return status code 200', function (done) {
                bbva.webhooks.get(webhook.id, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    assert.equal(body.status, 'verified', '');
                    done();
                });
            });
        });

        describe('List webhooks by id merchant', function () {
            it('Should return status code 200', function (done) {
                bbva.webhooks.list(function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    assert.equal(body.length, 1, '');
                    done();
                });
            });
        });

        describe('Delete webhook by id', function () {
            it('Should return statusCode 204', function (done) {
                // bbva.webhooks.delete("w2mejqm6eet6zkrgsl5s", function (error, body, response) {
                bbva.webhooks.delete(webhook.id, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 204, '');
                    done();
                });
            });
        });

    });


    describe('Testing merchant', function () {
        describe('Get merchant', function () {
            it('should return statusCode 200', function (done) {
                bbva.merchant.get(function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
    });

    var newlyCreatedCustomerId = '';
    describe('Testing customers', function () {
        describe('Create customer', function () {
            it('should return statusCode 200||201', function (done) {
                bbva.customers.create(testCreateCustomer, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
                    newlyCreatedCustomerId = body.id;
                    done();
                });
            });
        });
        describe('Get all customers without constraints', function () {
            it('should return statusCode 200', function (done) {
                bbva.customers.list({}, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
        describe('Get customer', function () {
            it('should return statusCode 200', function (done) {
                bbva.customers.get(newlyCreatedCustomerId, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
        describe('Update customer', function () {
            it('should return statusCode 200', function (done) {
                bbva.customers.update(newlyCreatedCustomerId, testUpdateCustomer, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
        describe('Get all customers with constraints', function () {
            it('should return statusCode 200', function (done) {
                bbva.customers.list({'creation': '2013-12-10'}, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
    });


    var testCard = {
        "card_number": "4111111111111111",
        "holder_name": "Juan Perez",
        "affiliation_bbva": "997866",
        "expiration_year": validExpirationYear,
        "expiration_month": "12",
        "cvv2": "111"
    };
    var newlyCreatedCardId = '';

    describe('Testing cards API', function () {
        describe('Add card', function () {
            it('should return statusCode 200||201', function (done) {
                bbva.cards.create(testCard, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode == 200 || response.statusCode == 201, true, '');
                    newlyCreatedCardId = body.id;
                    done();
                });
            });
        });
        describe('Get all cards without constraints', function () {
            it('should return statusCode 200', function (done) {
                bbva.cards.list({}, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
        describe('Get card', function () {
            it('should return statusCode 200', function (done) {
                bbva.cards.get(newlyCreatedCardId, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, '');
                    done();
                });
            });
        });
    });

    var testExistingCardCharge = {
        "source_id": '',
        "affiliation_bbva": "997866",
        "method": "card",
        "amount": 50,
        "description": "Test existing card charge",
        "customer": {
            "name": "Juan",
            "last_name": "Vazquez Juarez",
            "email": "juan.vazquez@empresa.com.mx",
            "phone_number": "555-444-3322"
        }
    };
    var testCreateCharge = {
        "method": "card",
        "affiliation_bbva": "997866",
        "card": {
            "card_number": "4111111111111111",
            "holder_name": "Aa Bb",
            "expiration_year": validExpirationYear,
            "expiration_month": "12",
            "cvv2": "110",
        },
        "customer": {
            "name": "Juan",
            "last_name": "Vazquez Juarez",
            "email": "juan.vazquez@empresa.com.mx",
            "phone_number": "555-444-3322"
        },
        "amount": 20,
        "description": "Test Charge"
    };
    var testCreateChargeWithoutCapture = {
        "method": "card",
        "affiliation_bbva": "997866",
        "card": {
            "card_number": "4111111111111111",
            "holder_name": "Aa Bb",
            "expiration_year": validExpirationYear,
            "expiration_month": "12",
            "cvv2": "110",
        },
        "customer": {
            "name": "Juan",
            "last_name": "Vazquez Juarez",
            "email": "juan.vazquez@empresa.com.mx",
            "phone_number": "555-444-3322"
        },
        "amount": 20,
        "description": "Test Charge",
        "capture": false
    };
    var testCreateBankAccountCharge = {
        "method": "bank_account",
        "amount": 50,
        "affiliation_bbva": "997866",
        "description": "Test bank account charge",
        "customer": {
            "name": "Juan",
            "last_name": "Vazquez Juarez",
            "email": "juan.vazquez@empresa.com.mx",
            "phone_number": "555-444-3322"
        }
    };

    describe('Testing charges', function () {
        describe('Get all charges without constraints', function () {
            it('should return statusCode 200', function (done) {
                bbva.charges.list({}, function (error, body, response) {
                    printLog(response.statusCode, body, error);
                    assert.equal(response.statusCode, 200, 'Status code == 200');
                    done();
                });
            });
        });
        if (testCreateCharges) {
            describe('Create charge with existing card', function () {
                it('should return statusCode 200||201', function (done) {
                    testExistingCardCharge.source_id = newlyCreatedCardId;
                    //console.log(testExistingCardCharge);
                    bbva.charges.create(testExistingCardCharge, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
                        done();
                    });
                });
            });
            var newlyCreatedTransactionId = '';
            describe('Create charge with new card', function () {
                it('should return statusCode 200||201', function (done) {
                    bbva.charges.create(testCreateCharge, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
                        newlyCreatedTransactionId = body.id;
                        done();
                    });
                });
            });
            describe('Get charge', function () {
                it('should return statusCode 200', function (done) {
                    bbva.charges.get(newlyCreatedTransactionId, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode, 200, '');
                        done();
                    });
                });
            });
            describe('Create charge without capture', function () {
                it('should return statusCode 200||201', function (done) {
                    bbva.charges.create(testCreateChargeWithoutCapture, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
                        newlyCreatedTransactionId = body.id;
                        done();
                    });
                });
            });
            describe('Create charge with new bank account', function () {
                it('should return statusCode 200||201', function (done) {
                    bbva.charges.create(testCreateBankAccountCharge, function (error, body, response) {
                        printLog(response.statusCode, body, error);
                        assert.equal(response.statusCode == 200 || response.statusCode == 201, true, 'Status code == 200');
                        newlyCreatedTransactionId = body.id;
                        done();
                    });
                });
            });
        }
    });

    describe('Openpay', function() {
        describe('constructor', function() {
            it('should throw error when publicIp is null', function() {
                assert.throws(() => new BbvaApi('merchantId', 'privateKey', null, 'mx', false),
                    new Error("Public Ip can't be null or empty"));
            });

            it('should throw error when publicIp is empty', function() {
                assert.throws(() => new BbvaApi('merchantId', 'privateKey', '', 'mx', false),
                    new Error("Public Ip can't be null or empty"));
            });

            it('should not throw error when publicIp is provided', function() {
                assert.doesNotThrow(() => new BbvaApi('merchantId', 'privateKey', '127.0.0.1', 'mx', false));
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

function getVerificationCode(url, callback) {
    urllib.request(url, function (err, body, res) {
        var resCode = res.statusCode;
        var error = (resCode != 200 && resCode != 201 && resCode != 204) ? body : null;
        var verification_code = null;
        console.info('error: ' + error);
        if (!error) {
            verification_code = body.toString().substring(body.indexOf('verification_code') + 28, body.indexOf('verification_code') + 28 + 8);
            console.info('verification_code: ' + verification_code);
        }
        callback(error, verification_code);
    });
}
