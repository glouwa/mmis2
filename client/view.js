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

var onLoad = function()
{
    // setup tabcontrols by adding graph factories
    viewModel.tabControl = tabControl({
        'Map':createPlotlyMapGraph,
        'Bar':createPlotlyBarGraph,
        'Histogram':createPlotly1dGraph,
        'Line':createPlotly2dGraph,
        '2D Scatter':createPlotly2dScatterGraph,
        '3D':createPlotly3dGraph,
        '3D Scatter':createPlotly3dScatterGraph,
        'Bubble':createPlotlyBubbleGraph,
        'Vis 2D':createVis2dGraph,
        'Vis 3D':createVis2dGraph,
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
                // if (--todosCount == 0) {
                //     drawTagCloud('div.left .tagCloud', 'countries', s=> $('#cSel').text("∀ countryKey ∊ "+s))
                //     drawTagCloud('div.left .featureCloud', 'features', s=> $('#fSel').text("∀ featureKey ∊ "+s))
                //     updateView()
                // }
            }
        }
        xhttp.open("GET", "../data/"+escape(featureKey)+".json", true)
        xhttp.send()
    }

    for (var i = 0; i < features.length; i++)
        load(features[i])

    // setup ui data dependencys
    new Awesomplete('#query', {
        list: features,
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

    $('#query').on('input', e=> updateView())
    //updateView()
}

var setYear = function(year)
{
    viewModel.selection.years = year
    updateView()
}

onSliderChange = function()
{
    setYear({ [$('#currentYearSlider').val()]:true })
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
        script: "x:yearKey, y:viewModel.data[featureKey][countryKey][yearKey], group:countryKey + '-' + featureKey",
        selection: {
            features:  { 'Arms_imports[$]':true, 'Arms_exports[$]':true },
            countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
            years:     undefined
        },
        defView: '2D'
    },
    {
        script: "x:yearKey, y:featureKey, z:yearKey, group:featureKey",
        selection: {
            features:  undefined,
            countries: { 'United States':true, 'China':true, 'Saudi Arabia':true },
            years:     undefined
        },
        defView: '2D'
    }
]
