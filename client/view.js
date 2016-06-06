/*
var viewModel = {
    data: {} // viewModel.data[feature][country][year] e ℝ
    keys: {
        features:  {'gdp':'is Da', ...} {k:v, k:v} [v,v,v,]
        countries: {'austria', ...} counrtys aus ALLEN files
        years:     { 1907, } years aus ALLEN files
    },

    selection: {
        features: {'gsp'}
        countries: {'austria'}
        years:    { 1970-1990 } macht es an unterschied wenn nur eins?
    }
}
*/

var viewModel = {
    data: {},
    keys: {
        countries: {},
        features:  {},
        years:     {}
    },
    selection: {
        features:  {},
        countries: {},
        years:     {}
    }
}

var vis = {}

var features = ["Exports (p of GDP)", "Agriculture (p of GDP)"]
var featureId = features[1]

var onLoad = function()
{
    vis.groups = new vis.DataSet()
    vis.dataset = new vis.DataSet()
    createGraph('2dplot')

    var load = function(featureKey)
    {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = ()=>
        {
            if (xhttp.readyState == 4 && xhttp.status == 200)
            {
                var newFile = JSON.parse(xhttp.responseText)
                viewModel.data[featureKey] = newFile

                viewModel.keys.features[featureKey] = newFile

                for (var countryId in newFile)
                {
                    viewModel.keys.countries[countryId] = newFile[countryId]
                    for (var yearId in newFile[countryId])
                    {
                        viewModel.keys.years[yearId] = newFile[countryId][yearId]
                    }
                }

                drawTagCloud()
            }
        }
        xhttp.open("GET", "../data/"+featureKey+".json", true)
        xhttp.send()
    }

    for (var i = 0; i < features.length; i++)
        load(features[i])

    $("#features").autocomplete({
        source:features,
        select: (ev, ui)=> {
            featureId = ui.item.value
            vis.groups.clear()
            vis.dataset.clear()

            for (var countryId in viewModel.selection.countries)
                vis.addCountry(countryId)
        }
    })
    $('div.left .histogram')[0].appendChild(createPlotly1dGraph())
}

var drawTagCloud = function()
{
    //for (country in model)
    //    model[country].weight = Math.random()

    //model[country].sort((a,b)=> a.weight < b.weight)

    var selectCountry = function(tag, country)
    {
        if (viewModel.selection.countries[country])
        {
            delete viewModel.selection.countries[country]
            tag.style.backgroundColor = 'white'
            vis.removeCountry(country)
        }
        else
        {
            viewModel.selection.countries[country] = viewModel.data[featureId][country]
            tag.style.backgroundColor = 'red'
            vis.addCountry(country)
        }

        console.log(viewModel.selection)
        vis.currentGraph.fit()
        //drawGraph('2dplot', viewModel.selection)
    }

    $('div.left .tagCloud').empty()

    var cloudModel = viewModel.keys.countries
    var l = Object.keys(cloudModel).length
    var i = l

    for (country in cloudModel) // todo: use viewmodel.keys.countries
    {
        let tagName = country
        let tagWeight = i--/l
        let tag = document.createElement('span')
            tag.innerHTML = tagName
            tag.onclick = function() { selectCountry(tag, tagName) }
            tag.style.fontSize = 0.01 + (1.3 * tagWeight) + 'em'
            tag.style.marginRight = 0.3 + 'em'
            tag.style.float = 'left'

        $('div.left .tagCloud')[0].appendChild(tag)
    }
}

var createGraph = function(/* div */graphType)
{
    //todo if (graphType === 'bar')    $('div.right')[0].appendChild(createVis2dGraph());
    if (graphType === '2dplot') $('div.right')[0].appendChild(createVis2dGraph());
    //if (graphType === '3dplot') $('div.right')[0].appendChild(createVis3dGraph());
    //if (graphType === 'map')    $('div.right')[0].appendChild(createD3Map());
}

// ∀ coutry ∊ model:
//     ∀ year ∊ country:
//         ∀ value ∊ features:
//             group=country, x=year, y=value

var createPlotly1dGraph = function()
{
    var x = [];
    for (var i = 0; i < 500; i ++)
    	x[i] = Math.random();

    var data = { x: x, type: 'histogram' }
    var layout = {
      autosize: true,
      width: 300,
      height: 200,
      margin: { l: 0, r: 0, b: 0, t: 40, },
    };

    var container = document.createElement('div')
        container.className = 'visContainer'
    Plotly.newPlot(container, [data], layout)
    return container;
}

// ∀ coutry   ∀ years: { group:countryId, x:model[countryId][YearId], y:model[countryId][YearId]['exports']  }   // länder vergleichten
// ∀ features ∀ years: { group:featureId, x:model['autria'] [YearId], y:model['autria'] [YearId][featureId]  }   // features von einem land

var createVis2dGraph = function()
{
    var options = { legend: true, height: '100%' }
    var container = document.createElement('div')
        container.className = 'visContainer'

    vis.currentGraph = new vis.Graph2d(container, vis.dataset, vis.groups, options)

    vis.removeCountry = function(country)
    {
        vis.dataset.remove(vis.dataset.get({ filter: item=> item.group == country }).map(i=> i.id))
        vis.groups.remove(country)
    }

    vis.addCountry = function(country)
    {
        vis.groups.add({
            id: country,
            content: country,
            interpolation: { enabled:true } ,
            options: { drawPoints: { style: 'circle' } }
        })

        var items = []
        for (year in viewModel.data[featureId][country])
        {
            if (viewModel.data[featureId][country][year] != "")
            {
                var value = viewModel.data[featureId][country][year]
                if (!isNaN(value))
                {
                    items.push({ x:year, y:value, group:country })
                }
            }
        }
        vis.dataset.update(items)
    }

    return container;
}
