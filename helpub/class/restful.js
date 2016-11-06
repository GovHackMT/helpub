var rest  = require('restler');

var HOST = "http://172.16.14.146:5001";
var serverAuthKeys = {
  apiKey:"621e36a9-4d62-4d0d-9e84-c8a61577598b",
  apiSecretkey:"69534a5b-28aa-40f5-909a-447ef1e3e645"
};

var Restful = function (req,res) {

    this.request = req;
    this.response = res;
    thiz = this;
    
    //get
    this.get = function (uri, data, callback) {
        var options = {
            headers: {
                "Content-Type": "application/json",
                "Api-Key": serverAuthKeys.apiKey,
                "Api-Secret-Key": serverAuthKeys.apiSecretkey
            }
        };

        rest.json(HOST + uri, data, options).on('success', function (data, res) {
            callback(data, res);
        }).on('fail', function (data, res) {
            if (!data) {
                data = {
                    status: false,
                    data: {},
                    statusCode: res.statusCode
                }
            }
            callback(data, res);
        }).on('error', function (error, res) {
            console.log('Error:', error);
        });
    };

    //post
    this.post = function (uri, data, callback) {
        var options = {
            headers: {
                "Content-Type": "application/json",
                "Api-Key": serverAuthKeys.apiKey,
                "Api-Secret-Key": serverAuthKeys.apiSecretkey
            }
        };
        rest.postJson(HOST + uri, data, options).on('success', function (data, res) {
            callback(data, res);

        }).on('fail', function (data, res) {
            if (!data) {
                data = {
                    status: false,
                    data: {},
                    statusCode: res.statusCode
                }
            }
            callback(data, res);
        }).on('error', function (error, res) {
            console.log('Error:', error);
        });
    };

};

module.exports = function (req,res) {
    return new Restful(req,res);
};
