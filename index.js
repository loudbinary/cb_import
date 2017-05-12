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
        run(function(err){
            console.log('Export completed');
        })
    }
])


function run(callback) {
    getStream()
        .pipe(es.mapSync(function (data) {
            if (Array.isArray(data)) {

                data.forEach(function (item) {
                    let file = path.join(__dirname, 'import', uuidV1() + '.json');
                    fs.writeFileSync(file, JSON.stringify(item), 'utf-8');
                })

            }

        }));
    callback(null);
}