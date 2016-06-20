var viewModel = {
    data: {},          // viewModel.data[feature][country][year] e ℝ
    keys: {            // union aus ALLEN files
        features:      {},
        countries:     {},
        years:         {},
    },
    selection: {
        features:  { 'Arms_imports[$]':true, 'Arms_exports[$]':true },
        countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
        years:     undefined
    },
    density: {
        features:  {},
        countries: {},
        years:     {},
    },
    currentGraph: undefined,
}


var updateView = function()
{
    console.log('updateView')
    updateMeta()
    $('.tagCloud')    .children().each((index, value)=> value.update())
    $('.featureCloud').children().each((index, value)=> value.update())
    $('#fSel').text("∀ featureKey ∊ "+ toString(viewModel.selection.features))
    $('#cSel').text("∀ countryKey ∊ "+ toString(viewModel.selection.countries))
    $('#ySel').text("∀ yearKey ∊ *")
    $('#keysInfo').text(len(viewModel.keys.features) + '⨯' + len(viewModel.keys.countries) + '⨯' +  len(viewModel.keys.years))

    viewModel.currentGraph.update()
}

var updateMeta = function()
{
    var dim1 = viewModel.selection.features  || viewModel.keys.features
    var dim2 = viewModel.selection.countries || viewModel.keys.countries
    var dim3 = viewModel.selection.years     || viewModel.keys.years

    viewModel.density = {
        features:{},
        countries:{},
        years:{}
    }

    var l1 = 0, l2 = 0, l3 = 0
    var e1 = 0, e2 = 0, e3 = 0
    var i = 0, e = 0
    for (var featureKey in viewModel.keys.features) if (viewModel.data[featureKey]) {
        l1++
        for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
            l2++
            for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                l3++
                i++
            }
            else { e3++; e++ }
        }
        else e2++

        viewModel.density.features[featureKey] = i/(i+e)
        i = 0
        e = 0
    }
    else e1++


    for (var countryKey in viewModel.keys.countries) {
        var i = 0, e = 0
        for (var featureKey in dim1) if (viewModel.data[featureKey] && viewModel.data[featureKey][countryKey])
            for (var yearKey in dim3)
                if (viewModel.data[featureKey][countryKey][yearKey])
                    i++
                else
                    e++

        viewModel.density.countries[countryKey] = i/(i+e)
        if (isNaN(viewModel.density.countries[countryKey]))
            viewModel.density.countries[countryKey] = 0
    }

    $('#selInfo').text(len(dim1) + '⨯' + len(dim2) + '⨯' +  len(dim3))
    $('#itInfo').text(l1 + '+' + l2 + '+' +  l3)
    var dens = l1/(l1+e1) + '+' + l2/(l2+e2) + '+' +  l3/(l3+e3)
    $('#elseInfo').text('- ' + e1 + '-' + e2 + '-' +  e3+ '   ------     ' + dens)
}

var onLoad = function()
{
    // setup tabcontrole by adding graph factorys
    viewModel.tabControl = tabControl({
        '1D Hist':createPlotly1dGraph,
        '2D Scatter':createPlotly2dScatterGraph,
        '2D+ Line':createPlotly2dGraph,
        '2D+ Bar':createPlotlyBarGraph,
        '2D+ Map':createPlotlyMapGraph,
        '2D+ Bubble':createPlotlyBubbleGraph,
        '3D Scatter':createPlotly3dScatterGraph,
        '3D+ Ribbon':createPlotly3dGraph,
        'Vis 2D':createVis2dGraph,
        //'Vis 3D':createVis2dGraph,
    })

    $('#view')[0].appendChild(viewModel.tabControl)

    // loading jsons and add to viewModel.data viewModel.keys
    var todosCount = features.length
    var load = function(featureKey) {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = ()=> {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var newFile = JSON.parse(xhttp.responseText)
                viewModel.data[featureKey] = newFile
                viewModel.keys.features[featureKey] = viewModel.keys.features[featureKey]+1 || 1
                for (var countryId in newFile) {
                    viewModel.keys.countries[countryId] = viewModel.keys.countries[countryId]+1 || 1
                    for (var yearId in newFile[countryId]) {
                        if (yearId == '') console.assert('empty year');
                        viewModel.keys.years[yearId] = viewModel.keys.years[yearId]+1 || 1
                    }
                }
                if (--todosCount == 0) {
                    drawTagCloud('.tagCloud', 'countries', s=> $('#cSel').text("∀ countryKey ∊ "+s))
                    drawTagCloud('.featureCloud', 'features', s=> $('#fSel').text("∀ featureKey ∊ "+s))

                    // setup ui data dependencys
                    new Awesomplete('#query', {
                        list: features
                              .concat(Object.keys(viewModel.keys.years))
                              .concat(Object.keys(viewModel.keys.countries))
                              .map(i => "'" + i + "'")
                              .concat(['viewModel.data[featureKey][countryKey][yearKey]']),
                        autoFirst: true,
                        minChars: 1,
                    	filter: function(text, input) {
                    		return Awesomplete.FILTER_CONTAINS(text, input.match(/[^\s]*$/)[0])
                    	},
                    	replace: function(text) {
                    		var before = this.input.value.match(/^.+\s*|/)[0]
                    		this.input.value = before + text + " "
                    	}
                    });

                    loadProject(0)
                }
            }
        }
        xhttp.open("GET", "../data/"+escape(featureKey)+".json", true)
        xhttp.send()
    }

    for (var i = 0; i < features.length; i++)
        load(features[i])

    $('#query').on('input', e=> updateView())
}

var setYear = function(year)
{
    if (!year){
        $('#selectedYear').text('')
        $('.time > span')[0].style.backgroundColor = str2Color('All', 0.4)
    }
    else{
        $('.time > span')[0].style.backgroundColor = 'white'
    }
    viewModel.selection.years = year
    updateView()
}

onSliderChange = function()
{
    var yearStr = $('#currentYearSlider').val()
    $('#selectedYear').text(yearStr)
    setYear({ [yearStr]:true })
}

var currentProject = 0
var loadProject = function(inc)
{
    currentProject = (currentProject + projects.length + inc) % projects.length
    var p = projects[currentProject]
    viewModel.selection = p.selection
    $('#query').val(p.script)
    viewModel.tabControl.setGraph(p.defView)
    updateView()
}

var projects = [
    {   // life expectancy histogram
        script: "x:viewModel.data[featureKey][countryKey][yearKey]",
        selection: {
            features:  { 'Life_expectancy_at_birth[years]':true },
            countries: undefined,
            years:     { '2010':true }
        },
        defView: '1D Hist'
    },
    {
        script: "x:yearKey, y:viewModel.data[featureKey][countryKey][yearKey], group:countryKey + '-' + featureKey",
        selection: {
            features:  { 'Arms_imports[$]':true, 'Arms_exports[$]':true },
            countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
            years:     undefined
        },
        defView: '2D+ Line'
    },
    {
        script: "x:viewModel.data['Country_GDP[$]'][countryKey][yearKey], y:viewModel.data['Suicides[#]'][countryKey][yearKey], group:countryKey, r:viewModel.data['Urbanpopulation[%]'][countryKey][yearKey]",
        selection: {
            features:  { 'Arms_imports[$]':'not used'},
            countries: undefined,
            years:     undefined
        },
        defView: '2D Scatter'
    },
    {
        script: "x:yearKey, y:featureKey, z:yearKey, group:featureKey",
        selection: {
            features:  undefined,
            countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
            years:     undefined
        },
        defView: '2D+ Line'
    },
    {
        script: 'x:featureKey, y:countryKey, z:yearKey, group:countryKey',
        selection: {
            features:  undefined,
            countries: { 'United States':true, 'China':true, 'Saudi Arabia':true, Austria:true, Aruba:true },
            years:     undefined
        },
        defView: '3D Scatter'
    },
    {
        script: 'x:countryKey, y:viewModel.data[featureKey][countryKey][yearKey], group:featureKey',
        selection: {
            features:  { 'Arms_imports[$]':true, 'Arms_exports[$]':true },
            countries: undefined,
            years:     undefined
        },
        defView: '2D+ Bar'
    },
    {
        script: 'x:countryKey, y:viewModel.data[featureKey][countryKey][yearKey], group:featureKey',
        selection: {
            features:  { 'Arms_imports[$]':true },
            countries: undefined,
            years:     undefined
        },
        defView: '2D+ Map'
    },
    {
        script: 'x:yearKey, y:viewModel.data[featureKey][countryKey][yearKey], group:countryKey',
        selection: {
            features:  { 'Arms_exports[$]':true },
            countries: { 'United States':true, 'Russia':true },
            years:     undefined
        },
        defView: '2D+ Line'
    },
]
