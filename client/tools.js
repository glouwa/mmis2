var features = [
    'Agriculture (p of GDP)', 'Arms exports', 'Arms imports', 'Exports (p of GDP)', 'Foreign investment inflow',
    'Indicator_Energyproductionpercapita', 'Number of billionaires per M',
    'agriculture land', 'broadband per 100', 'broadband total', 'cell phone per 100', 'cell phone total',
    'energy use per person', 'energy use total', 'expenditure primary', 'expenditure secondary', 'expenditure tertiery',
    'indicator SI_POV_NAHC.xls',
    'hiv estimated 15-49',
    'indicator pwt7.1', 'indicator_t 15-24 unemploy', 'indicator_t 25-54 unemploy', 'indicator_t above 15 unemploy',
    'indicator_t agriculture employ' ]

var plotLineColors = [ '#37d8e6', '#ff0100', '#8c50cf', '#75c840', '#f79646', '#3f51b5',  '#607d8b', '#03a9f4']
var len = o=> Object.keys(o).length
var toString = o=> {
    if (o === undefined) return '*'
    return '{ ' + Object.keys(o).reduce((i, a)=> "'" + a +"', " + i, '') + ' }'
}

//var str2Color = s=> plotLineColors[Math.abs(hashCode(s))%plotLineColors.length]
var str2Color = function(s, a)
{
     return hexToRgba(plotLineColors[Math.abs(hashCode(s))%plotLineColors.length], a || 1)
}

function hexToRgba(hex, a)
{
    hex = hex.replace(/[^0-9A-F]/gi, '')
    var bigint = parseInt(hex, 16)
    var r = (bigint >> 16) & 255
    var g = (bigint >> 8) & 255
    var b = bigint & 255
    return 'rgba(' + [r, g, b, (a||0.4)].join() + ')'
}

var hashCode = function(s)
{
    var hash = 0, i, chr, len;
    if (s.length === 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
