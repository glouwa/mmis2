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
    var WIDTH_IN_PERCENT_OF_PARENT = 100, HEIGHT_IN_PERCENT_OF_PARENT = 90;
    var gd3 = d3.select('body')
        .append('div')
        .style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            marginLeft: (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
            marginTop: '0em'
        })

    var view = gd3.node()
        view.deactivate = ()=> view.update = undefined
        view.update = ()=> draw(view)

    window.onresize = ()=> Plotly.Plots.resize(view)
    return view
}

/*
var updatePlotly = function(loayout, onNewTrace, onValue)
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
                    traces[item.group] = onNewTrace(item)

                onValue(item)
            }
        }
    }

    Plotly.newPlot(view, objValues2Array(traces), { barmode: 'overlay' })
}*/

var createPlotly1dGraph = function()
{
    return createPlotlyBase(view=>
    {
        /*updatePlotly({
            barmode: 'overlay', title:":(" },
            ['x'],
            i=> {
                x:[],
                type:'histogram',
                bins:20,
                marker: { line: { width:1 } },
                name:item.group,
                opacity: 0.6
            },
            i=>
        )*/
        var asso = $('#query').val()

        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {

                    var item = eval('({' + asso + '})')
                    if (!traces[item.group])
                        traces[item.group] = {
                            x:[],
                            type:'histogram',
                            bins:20,
                            marker: { line: { width:1 } },
                            name:item.group,
                            opacity: 0.6
                        }

                    traces[item.group].x.push(item.x)
                }
            }
        }

        Plotly.newPlot(view, objValues2Array(traces), { barmode: 'stack', title:/*toString(viewModel.selection.features)*/"" })
    })
}

var createPlotlyBarGraph = function(draw){


    return createPlotlyBase(view=>
    {
        var asso = $('#query').val()

        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {

                    var item = eval('({' + asso + '})')
                    if (!traces[item.group])
                        traces[item.group] = {
                            x:[],
                            y:[],
                            type:'bar',
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

        Plotly.newPlot(view, objValues2Array(traces), {barmode: 'stack'})
    })
}

var createPlotlyMapGraph = function()
{
    return createPlotlyBase(view=>
    {
        var asso = $('#query').val()

        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                    try {
                        var item = eval('({' + asso + '})')
                        if (!traces[item.x])
                            traces[item.x] = item.y
                        }
                    catch(e) {}
                }
            }
        }

        var data = [{
            type:'choropleth',
            locationmode:'country names',
            locations:Object.keys(traces),
            z:objValues2Array(traces),
            autocolorscale:true
        }]

        Plotly.newPlot(view, data, { geo: { projection: { type: 'robinson' }}})
    })
}

var createPlotly2dGraph = function()
{
    return createPlotlyBase(view=>
    {
        var asso = $('#query').val()

        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {

                    var item = eval('({' + asso + '})')
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

        Plotly.newPlot(view, objValues2Array(traces), { hovermode:'closest' })
    })
}

var createPlotly3dGraph = function()
{
    return createPlotlyBase(view=>
    {
        var asso = $('#query').val()
    })
}

var createPlotlyBubbleGraph = function()
{
    return createPlotlyBase(view=>
    {
        var asso = $('#query').val()

        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1)    if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                    try
                    {
                        var item = eval('({' + asso + '})')
                        if (!traces[item.group])
                            traces[item.group] = {
                                x:[],
                                y:[],
                                type:'scatter',
                                mode: 'markers',
                                opacity: 0.5,
                                name:item.group,
                                marker: { size:[], sizemode: 'area' }
                            }

                        traces[item.group].x.push(item.x)
                        traces[item.group].y.push(item.y)
                        traces[item.group].marker.size.push(item.r)
                    }
                    catch(e) { console.log('scatterplot warning') }
                }
            }
        }

        var layout = {
            hovermode:'closest',
            xaxis: {
                type: 'log',
                autorange: true
            },
            yaxis: {
                type: 'log',
                autorange: true
            }
        }

        Plotly.newPlot(view, objValues2Array(traces), layout)
    })
}

var createPlotly2dScatterGraph = function()
{
    return createPlotlyBase(view=>
    {
        var asso = $('#query').val()

        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1)    if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                    try
                    {
                        var item = eval('({' + asso + '})')
                        if (!traces[item.group])
                            traces[item.group] = {
                                x:[],
                                y:[],
                                type:'scatter',
                                mode: 'markers',
                                opacity: 0.5,
                                name:item.group,
                            }

                        traces[item.group].x.push(item.x)
                        traces[item.group].y.push(item.y)
                    }
                    catch(e) { console.log('scatterplot warning') }
                }
            }
        }

        var layout = {
            hovermode:'closest',
            xaxis: {
                type: 'log',
                autorange: true
            },
            yaxis: {
                type: 'log',
                autorange: true
            }
        }

        Plotly.newPlot(view, objValues2Array(traces), layout)
    })
}

// legend: {"orientation": "h"}

var createVis2dGraph = function()
{
    var view = createViewBase('div', 'graphView', ()=> {
        var items = []
        var groups = {}
        var g =1

        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1) if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {
                    try
                    {
                        var item = eval('({' + $('#query').val() + '})')

                        if (!groups[item.group]) {
                            var countryColor = str2Color(countryKey)
                            var featureColor = /*countryColor*/ str2Color(featureKey)
                            var strokeColor = 'white'
                            var groupOptions = { drawPoints: { size:8, style:'circle', styles:'stroke:'+strokeColor+';fill:'+featureColor+';' } }
                            //var group = { id:item.group, content:item.group, style:'stroke:'+countryColor+';', options:groupOptions }
                            var group = { id:''+g++, content:item.group, style:'stroke:'+countryColor+';', options:groupOptions }
                            groups[item.group] = group
                        }

                        var i = { x:Number(item.x), y:item.y,  group:groups[item.group].id }
                        items.push(i)

                        console.assert(typeof(i.x) == 'number' && !isNaN(i.x) &&
                                       typeof(i.y) == 'number' &&  !isNaN(i.y) &&
                                       groups[item.group])
                    }
                    catch(e) {}
                }
            }
        }

        console.log(objValues2Array(groups))
        console.log(items)

        groupset.clear()
        dataset.clear()
        groupset.update(objValues2Array(groups))
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
        var asso = $('#query').val()

        var traces = {}
        var dim1 = viewModel.selection.features  || viewModel.keys.features
        var dim2 = viewModel.selection.countries || viewModel.keys.countries
        var dim3 = viewModel.selection.years     || viewModel.keys.years
        for (var featureKey in dim1)    if (viewModel.data[featureKey]) {
            for (var countryKey in dim2) if (viewModel.data[featureKey][countryKey]) {
                for (var yearKey in dim3) if (viewModel.data[featureKey][countryKey][yearKey]) {

                    var item = eval('({' + $('#query').val() + '})')
                    var group = item.group

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

                    traces[group].x.push(item.x)
                    traces[group].y.push(item.y)
                    traces[group].z.push(item.z)
                }
            }
        }

        Plotly.newPlot(view, objValues2Array(traces))
    })
}
