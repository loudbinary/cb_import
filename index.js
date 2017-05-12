var fs = require('fs'),
    JSONStream = require('JSONStream'),
    es = require('event-stream'),
    fs = require('fs'),
    uuidV1 = require('uuid/v1'),
    path = require('path'),
    async = require('async');
var getStream = function () {
    var jsonData = 'flight_restrictions.json',
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
    return stream.pipe(parser);
};
async.series([
    function(callback){
        fs.mkdir(path.join(__dirname,'import'), function(err) {
            if (err) console.log('Export directory existed, continuing')
            else {
                console.log('Export directory created, continuing');
            }
            callback(null);
        })
    },
    function(callback){
        fs.mkdir(path.join(__dirname,'import','docs'), function(err) {
            if (err) console.log('Docs directory existed, continuing')
            else {
                console.log('Docs directory created, continuing');
            }
            callback(null);
        })
    },
    function(callback){
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
                        let file = path.join(__dirname, 'import','docs', uuidV1() + '.json');
                        fs.writeFileSync(file, JSON.stringify(item['flight-restrictions']), 'utf-8');
                    })

                }

            }));
    },
    function (callback) {
        // /opt/couchbase/bin/cbdocloader -u admin -p rWxyyZnBPajATs2K2NV5 -b facilities -n 127.0.01:8091 __dirname/import
    }
])



