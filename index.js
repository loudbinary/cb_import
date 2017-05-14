var fs = require('fs'),
    JSONStream = require('JSONStream'),
    es = require('event-stream'),
    fs = require('fs'),
    uuidV1 = require('uuid/v1'),
    path = require('path'),
    async = require('async');
/*
var getStream = function () {
    var jsonData = 'flight_restrictions.json',
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
    return stream.pipe(parser);
};
*/
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
	console.log('Creating flight restriction json files.');
        var getStream = function () {
            var jsonData = path.join(__dirname,'flight_restrictions.json'),
                stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
                parser = JSONStream.parse('*');
            return stream.pipe(parser);
        };
        getStream()
            .pipe(es.mapSync(function (data) {
		console.log(data);
                if (Array.isArray(data)) {

                    data.forEach(function (item) {
                        let file = path.join(__dirname, 'import','docs', uuidV1() + '.json');
                        //console.log('Processing',file);
			fs.writeFileSync(file, JSON.stringify(item['flight-restrictions']), 'utf-8');
                    })

                }

            }));
//        callback(null);
    },
    function (callback) {
        console.log('Complete, please run:');
        console.log('/opt/couchbase/bin/cbdocloader -u admin -b facilities -n 127.0.01:8091 -p <password> ' + path.join(__dirname,'import'));
        callback(null)
        // '/opt/couchbase/bin/cbdocloader -u admin -b facilities -n 127.0.01:8091 -p <password> ' + path.join(__dirname,'import'));
    }
], function(){
    process.exit('0');
})
