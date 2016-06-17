var features = [
  'Agriculture[%GDP]',
  'Agriculture_employes[#]',
  'Agriculture_land[]',
  'Arms_exports[$]',
  'Arms_imports[$]',
  'Army[#]',
  'Average_billionares_age[years]',
  'Broadband[#]',
  'Broadband[per_100]',
  'Cell_phone[#]',
  'Cell_phone[per_100]',
  'Country_GDP[$]',
  'Energy_production[per_capita]',
  'Energy_use[]',
  'Energy_use[per_person]',
  'Expenditure_primary_education[%GDP_per_capita]',
  'Expenditure_secondary_education[%GDP_per_capita]',
  'Expenditure_tertiary_education[%GDP_per_capita]',
  'Exports[%GDP]',
  'Foreign_investment_inflow[$]',
  'GDP_per_employee[$]',
  'Government_expenditure_on_health_per_capita[$]',
  'Income[$_per_person]',
  'Inflation[%]',
  'Life_expectancy_at_birth[years]',
  'New_births[#]',
  'Number_billionaires[per_1M_inhabitants ]',
  'Population[#]',
  'Population_growth[%]',
  'Poverty_ratio_at_$1,25_a_day[%population]',
  'Self-employed[%]',
  'Self_employed[%]',
  'Suicides[#]',
  'Unemployed_15-24[%]',
  'Unemployed_25-54[%]',
  'Unemployed_above_15[%]',
  'Urbanpopulation[%]',
  'Working_hours_per_week[hours_per_week]'
]



var plotLineColors = [ '#37d8e6', '#ff0100', '#8c50cf', '#75c840', '#f79646', '#3f51b5',  '#607d8b', '#03a9f4']
var len = o=> Object.keys(o).length
var toString = o=> {
    if (o === undefined) return '*'
    return '{ ' + Object.keys(o).reduce((i, a)=> "'" + a +"', " + i, '') + ' }'
}

var objValues2Array = function(o){
    var a = []
    for (var k in o)
        a.push(o[k])
    return a
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
