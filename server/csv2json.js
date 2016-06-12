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
        .on("data", country => // country == one line in csv (one country)
        {
            for(var year in country)
                country[year] = country[year].replace(',', '.')

            var countryName = undefined
            for(var year in country)
            {
                var keyAsNumber = Number(year)

                if (isNaN(keyAsNumber)) { // if key is not a number (not a year) -> its the countryName, save it and delete from country
                    countryName = country[year]
                    delete country[year]
                }
                else if (country[year] === '') { // discard empty values
                    delete country[year]
                }
                else
                {
                    country[year] = Number(country[year])
                }
            }
            //console.log({ [countryName]:country })
            if (Object.keys(country).length > 0){
                result[countryName] = country
                console.assert(countryName,filenameOhneExt, country)
            }
        })
}

var filesOhneExt = getFiles('../data/csv/')
console.log(filesOhneExt)
for (var i = 0; i < filesOhneExt.length; i++)
    convertFile(filesOhneExt[i])
