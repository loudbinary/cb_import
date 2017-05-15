/*
    Within the root of cloned repository, create a .env file
    Within that file:
        POST_URL="HTTP://COUCHBASE-GATEWAY-SYNC-URL"
        DB_NAME="COUCHBASE GATEWAY SYNC DB NAME"
 */
require('dotenv').config();
var fs = require('fs'),
    JSONStream = require('JSONStream'),
    es = require('event-stream'),
    fs = require('fs'),
    uuidV1 = require('uuid/v1'),
    path = require('path'),
    async = require('async'),
    http = require("http"),
    request = require("request"),
    options = {
        keepAlive:true,
        maxSockets:10
    };

var agent = new http.Agent(options);

options = {
    url: process.env.POST_URL + ':' + '4984' + process.env.DB_NAME,
    headers: {
        "content-type": "application/json"
    },
    method: "POST",
    agent: agent
};
var getStream = function () {
    var jsonData = 'flight_restrictions.json',
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
    return stream.pipe(parser);
};
getStream()
    .pipe(es.mapSync(function (data) {
        if (Array.isArray(data)) {

            data.forEach(function (item) {
                options.body = JSON.stringify(item['flight-restrictions']);
                var cbPost = http.request(options);
                cbPost.end();
                cbPost.on("response", function(incomingMessage){
                    incomingMessage.on("readable", function(){
                        var message = incomingMessage.read();
                    });
                });
            })

        }

    }));
/*
 var request = require("request");

 var options = { method: 'POST',
 url: 'http://couchbase-gateway-sync-1473293852.us-east-1.elb.amazonaws.com:4984/facilities/',
 headers:
 { 'postman-token': 'e49629ea-37ce-2286-d050-474731e84af3',
 'cache-control': 'no-cache',
 'content-type': 'application/json' },
 body:
 { Category: 'HELIPORT',
 Classification: '',
 Contact: { Name: 'SABEY CORPORATION', Phone: '    206-281-8700' },
 Name: 'ELLIOTT PARK',
 NotamsId: '',
 Owner: 'SABEY CORPORATION',
 Shape: { Points: [ 47.61982027777778, -122.3606825 ] },
 TimePeriod: { UtcEnd: '', UtcStart: '' } },
 json: true };

 request(options, function (error, response, body) {
 if (error) throw new Error(error);

 console.log(body);
 });

 */
