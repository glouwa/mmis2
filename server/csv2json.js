var fs = require('fs')
var csv = require('fast-csv')

var result = {}

//var feature = 'Exports (p of GDP)'
var feature = 'Agriculture (p of GDP)'
var stream = fs.createReadStream('../data/' + feature + '.csv')
csv .fromStream(stream, { headers:true })
    .on("data", data => processsCsvLine(data))
    .on("end", () => saveToFile())

var processsCsvLine = function(data)
{
    for(var name in data)


    var country = undefined
    for(var name in data)
    {
        var asNumber = Number(name)
        data[name] = data[name].replace(',', '.')
        if (isNaN(asNumber)) {
            country = data[name]
            delete data[name]
        }
    }
    //console.log({ [country]:data })
    result[country] = data
}

var saveToFile = function()
{
    fs.writeFileSync('../data/' + feature + '.json', JSON.stringify(result, null, 2))
}
