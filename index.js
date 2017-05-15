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
    sleep = require('sleep',)
    options = {
        keepAlive:true,
        maxSockets:10
    };

var agent = new http.Agent(options);
var postUrl = process.env.POST_URl + ':' + process.env.POST_PORT + '/' + process.env.DB_NAME + '/'
options = {
    url: postUrl,
    headers: {
        "content-type": "application/json"
    },
    method: "POST",
    agent: agent
};
var getStream = function () {
    var jsonData = process.env.FILE_RESTORE_NAME,
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
    return stream.pipe(parser);
};
getStream()
    .pipe(es.mapSync(function (data) {
        var count = 0;
        if (Array.isArray(data)) {
            console.log('Beginning import of', data.length, ' json objects into')

            data.forEach(function (item) {
                options.body = JSON.stringify(item[process.env.DB_JSON_NODE]);
                request.post(options,function(error,response,body){
                    if (error) console.log(error);
                    count++
                    console.log('Imported item', count);
                })
            })

        }

    }));