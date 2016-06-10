var fs = require('fs')
var csv = require('fast-csv')

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        var nameOhneExt = files[i].substr(0, files[i].lastIndexOf('.'))
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(nameOhneExt);
        }
    }
    return files_;
}

var convertFile = function(filenameOhneExt)
{
    console.log('converting ' + filenameOhneExt)
    var stream = fs.createReadStream('../data/csv/' + filenameOhneExt + '.csv');
    var result = {}
    csv .fromStream(stream, { headers:true })
        .on("error", e => console.log(e))
        .on("end", () => fs.writeFileSync('../data/' + filenameOhneExt + '.json', JSON.stringify(result, null, 2)))
        .on("data", data =>
        {
            for(var name in data)
                data[name] = data[name].replace(',', '.')

            var country = undefined
            for(var name in data)
            {
                var asNumber = Number(name)
                if (isNaN(asNumber)) {
                    country = data[name]
                    delete data[name]
                }
            }
            //console.log({ [country]:data })
            result[country] = data
        })
}

var filesOhneExt = getFiles('../data/csv/')
console.log(filesOhneExt)
for (var i = 0; i < filesOhneExt.length; i++)
    convertFile(filesOhneExt[i])
