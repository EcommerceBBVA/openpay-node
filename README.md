![Bbva nodejs](http://www.bbva.mx/img/github/nodejs.jpg)

## Installation

`npm install bbva`

## Documentation

Full API documentation available at http://docs.bbva.mx/.

## Overview

```js
//class
var BbvaApi = require('openpay');
//instantiation
var bbvaApi = new BbvaApi(' your merchant id ', ' your private key ', [ isProduction ]);
//use the api
bbvaApi.< resource_name >.< method_name >( ... )
```

All methods accept an optional callback as last argument. 

The callback function should follow the format: function(error, body, response) {...}.
* error: null if the response status code is 200, 201, 204
* body: null if the response status code is different from 200, 201, 204

## Examples

### Creating a customer
```js
var newCustomer = {
  "name":"John", 
  "affiliation_bbva":"997866",
  "email":"johndoe@example.com",
  "last_name":"Doe",
  "address":{
    "city":"Queretaro", 
    "state":"Queretaro",
    "line1":"Calle Morelos no 10",
    "line2":"col. san pablo",
    "postal_code":"76000",
    "country_code":"MX"
  },
  "phone_number":"44209087654"
};

bbvaApi.customers.create(newCustomer, function(error, body, response) {
    error;    // null if no error occurred (status code != 200||201||204)
    body;     // contains the object returned if no error occurred (status code == 200||201||204)
    response; // contains the complete response including the status, statusCode, statusMessage, and more information
});
```

### Charging
```js
var newCharge = {
    "method": "card", 
    "affiliation_bbva":"1234567",
    "card": {
        "card_number": "4111111111111111",
        "holder_name": "John Doe", 
        "expiration_year": "20", 
        "expiration_month": "12", 
        "cvv2": "110",
    },
    "amount" : 200.00,
    "description" : "Service Charge",
    "order_id" : "oid-00721"
};
bbvaApi.charges.create(testCreateCharge, function (error, body, response){
  // ...
});
```

## Configuration
Before use the library will be necessary to set up your Merchant ID and Private key.

```js
var BbvaApi = require('bbvaApi');
var bbvaApi = new BbvaApi('your merchant id', 'your private key', '138.85.61.94', false);
bbvaApi.setTimeout(30000);
```

In addition, you can set the merchant id, private key, and the mode like this

```js
bbvaApi.setMerchantId(' your merchant id ');
bbvaApi.setPrivateKey(' your private key ');
bbvaApi.setProductionReady(true)
```

Once configured the library, you can use it to interact with Openpay API services.

## Development

To run the tests you'll need your sandbox credentials: merchant id and private key from your [Dashboard](https://sandbox-dashboard.bbvaApi.mx/):

```bash
$ npm install -g mocha
$ npm test
```

# Implementation

## Usage for Mexico
### Charges
#### Create a charge
###### With customer
```js
var customerId = 'Customer ID';
var newCharge = {
    "affiliation_bbva":"1234567",
    "method": "card",
    "source_id": "",
    "amount": 20,
    "description": "Test Charge",
    "currency": "MXN",
    "device_session_id": "kR1MiQhz2otdIuUlQkbEyitIqVMiI16f"
}
bbvaApi.customers.charges.create(
    customerId,
    newCharge,
    function (error, body, response) {
        // ...
    });
```

#### Refund a charge
Only card charges can be refunded.

```js
var chargeId = 'Charge ID';
var data = {
    "description": "testing refound",
    "amount": 200
}
bbvaApi.charges.refund(
    chargeId,
    data,
    function (error, body, response) {
        // ...
    });
```
#### Get a charge

###### Without customer
```js
var chargeId = 'Charge ID';
bbvaApi.charges.get(
    chargeId,
    function (error, body, response) {
        // ...
    });
```
###### With customer
```js
var customerId = 'Customer ID';
var chargeId = 'Charge ID';
bbvaApi.customers.charges.get(
    customerId,
    chargeId,
    function (error, body, response) {
        // ...
    });
```
#### List charges
###### Without customer
```js
var searchParams = {
    'order_id': 'Order ID',
    'creation': 'yyyy-mm-dd',
    'offset': 1,
    'limit': 1,
    'amount': 100,
    'status': 'IN_PROGRESS'
}
bbvaApi.charges.list(searchParams,
    function (error, body, response) {
        // ...
    });
```

Instead of the 'creation' field in the 'searchParams' object, you can use:
* "creation[gte]" : "2021-10-22" to find charges created after the given date
* "creation[lte]" : "2021-10-22" to find charges created before the given date

Instead of the 'amount' field in the 'searchParams' object, you can use:
* "amount[gte]" : 100 to find charges with amount bigger than the amount given
* "amount[lte]" : 100 to find charges with amount smaller than the amount given

Allowed statuses:
* IN_PROGRESS
* COMPLETED
* REFUNDED
* CHARGEBACK_PENDING
* CHARGEBACK_ACCEPTED
* CHARGEBACK_ADJUSTMENT
* CHARGE_PENDING
* CANCELLED
* FAILED
### Customers
