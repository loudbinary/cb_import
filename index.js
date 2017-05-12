var fs = require('fs'),
    JSONStream = require('JSONStream'),
    es = require('event-stream'),
    fs = require('fs'),
    uuidV1 = require('uuid/v1'),
    path = require('path');
var getStream = function () {
    var jsonData = 'flight_restrictions.json',
        stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
        parser = JSONStream.parse('*');
    return stream.pipe(parser);
};

getStream()
    .pipe(es.mapSync(function (data) {
        if (Array.isArray(data)){

            data.forEach(function(item){
                let file = path.join(__dirname,'export',uuidV1()+'.json');
                fs.writeFileSync(file,JSON.stringify(item),'utf-8');
            })

        }

    }));
