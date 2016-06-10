/*
* graph inteface:
* - ist ein htmlElement
* - hat eine updateFunktion (greift beim update auf viewmodel zu)
*/
var createViewBase = function(type, className, onUpdate)
{
    var view = document.createElement(type)
        view.className = className
        // function hält context mit pointer auf view -> view wird nicht gc
        view.deactivate = ()=> view.update = undefined
        view.update = onUpdate
    return view
}

var createPlotlyBase = function(draw)
{
    var d3 = Plotly.d3;
    var WIDTH_IN_PERCENT_OF_PARENT = 90, HEIGHT_IN_PERCENT_OF_PARENT = 65;
    var gd3 = d3.select('body')
        .append('div')
        .style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            marginLeft: (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
            marginTop: '2em'
        })

    var view = gd3.node()
        view.deactivate = ()=> view.update = undefined
        view.update = ()=> draw(view)

    window.onresize = ()=> Plotly.Plots.resize(view)
    return view
}

var createPlotly1dGraph = function()
{
    return createPlotlyBase(view=>
    {
        var x = []
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                    //var item = eval('({' + $('#query').val() + '})')
                    x.push(viewModel.data[featureKey][countryKey][yearKey])
                }
            }
        }

        var data = {
            x:x,
            type:'histogram',
            bins:20,
            marker: { line: { width:1 } }
        }
        Plotly.newPlot(view, [data], { title:toString(viewModel.selection.features) })
    })
}

var createPlotlyBarGraph = function(draw)
{
    return createPlotlyBase(view=>
    {
        Plotly.plot(view,
            [{
                type: 'bar',
                x: ['giraffes', 'orangutans', 'monkeys', 'pandas'],
                y: [5, 10, 2, 8],
                marker: {
                    color: '#C8A2C8',
                    line: {
                        width:1
                    }
                }
            }],
            { title: 'title' }
        )
    })
}

var createPlotlyMapGraph = function()
{
    return createPlotlyBase(view=>
    {
    })
}

var createPlotly2dGraph = function()
{
    return createPlotlyBase(view=>
    {
        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                    var item = eval('({' + $('#query').val() + '})')

                    if (!traces[item.group])
                        traces[item.group] = {
                            x:[],
                            y:[],
                            type:'scatter',
                            mode: 'lines+markers',
                            name:item.group,
                            line: { shape: 'spline' },
                            marker: { opacity: 0.6, },
                            opacity: 0.6
                        }

                    traces[item.group].x.push(item.x)
                    traces[item.group].y.push(item.y)
                }
            }
        }

        var tracesArray = []
        for (var lineName in traces)
            tracesArray.push(traces[lineName])

        Plotly.newPlot(view, tracesArray)
    })
}

var createPlotly3dGraph = function()
{
    return createPlotlyBase(view=>
    {
    })
}

var createPlotlyBubbleGraph = function()
{
    return createPlotlyBase(view=>
    {
    })
}

var createPlotly2dScatterGraph = function()
{
    return createPlotlyBase(view=>
    {
        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1)    if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {

                    if (!traces[countryKey])
                        traces[countryKey] = {
                            x:[],
                            y:[],
                            type:'scatter',
                            mode: 'markers',
                            opacity: 0.5,
                            name:countryKey,
                            text:countryKey + ' - ' + yearKey,
                            //marker: { line: { width:1 } }
                        }

                    traces[countryKey].x.push(viewModel.data['Arms imports'][countryKey][yearKey])
                    traces[countryKey].y.push(viewModel.data['Arms exports'][countryKey][yearKey])
                }
            }
        }

        var tracesArray = []
        for (var lineName in traces)
            tracesArray.push(traces[lineName])

        Plotly.newPlot(view, tracesArray)
    })
}

var createVis2dGraph = function()
{
    var view = createViewBase('div', 'graphView', ()=> {
        var items = []
        var groups = []

        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                    var countryColor = str2Color(countryKey)
                    var featureColor = /*countryColor*/ str2Color(featureKey)
                    var strokeColor = 'white'
                    var groupOptions = { drawPoints: { size:8, style:'circle', styles:'stroke:'+strokeColor+';fill:'+featureColor+';' } }
                    var item = eval('({' + $('#query').val() + '})')
                    var group = { id:item.group, content:item.group, style:'stroke:'+countryColor+';', options:groupOptions }
                    groups.push(group)
                    items.push(item)
                }
            }
        }

        groupset.clear()
        dataset.clear()
        groupset.update(groups)
        dataset.update(items)
        visDing.fit()
    })

    var groupset = new vis.DataSet()
    var dataset = new vis.DataSet()
    var options = { legend:false, height: '100%' }
    var visDing = new vis.Graph2d(view, dataset, groupset, options)
    return view;
}

var createPlotly3dScatterGraph = function()
{
    return createPlotlyBase(view=>
    {
        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1)    if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {

                    var script = eval('({' + $('#query').val() + '})')
                    var group = script.group

                    if (!traces[group])
                        traces[group] = {
                            x:[],
                            y:[],
                            z:[],
                            name:group,
                            type:'scatter3d',
                            mode: 'markers',
                            marker: { size:4 },
                            opacity: 0.4
                        }

                    traces[group].x.push(script.x)
                    traces[group].y.push(script.y)
                    traces[group].z.push(script.z)
                }
            }
        }

        var tracesArray = []
        for (var lineName in traces)
            tracesArray.push(traces[lineName])

        Plotly.newPlot(view, tracesArray)
    })
}
