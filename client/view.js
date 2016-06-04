var onLoad = function()
{
    $("#features").autocomplete({ source:["ActionScript", "AppleScript"] });

    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = ()=> {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var featureData = JSON.parse(xhttp.responseText)
            drawGraph('2dplot', featureData)
            drawTagCloud(featureData)
        }
    }
    xhttp.open("GET", "../data/Exports (p of GDP).json", true)
    xhttp.send()
}

var drawTagCloud = function(model)
{
    for (country in model)
        model[country].weight = Math.random()

    //model[country].sort((a,b)=> a.weight < b.weight)

    for (country in model)
    {
        var tagName = country
        var tagWeight = Math.random()
        var tag = document.createElement('span')
            tag.innerHTML = tagName
            tag.style.fontSize = 0.01 + (2 * tagWeight) + 'em'

        $('div.left')[0].appendChild(tag)
    }
}

var drawGraph = function(graphType, model)
{
    $('div.right').empty()
    if (graphType === '2dplot') $('div.right')[0].appendChild(createVis2dGraph(model));
    //todo if (graphType === 'bar')    $('div.right')[0].appendChild(createVis2dGraph());
    //if (graphType === '3dplot') $('div.right')[0].appendChild(createVis2dGraph());
    //if (graphType === 'map')    $('div.right')[0].appendChild(createVis2dGraph());
}

var createVis2dGraph = function(model)
{
    var items = [];
    var groups = new vis.DataSet();
    console.log(model)
    // ∀ coutry ∊ model:
    //     ∀ year ∊ country:
    //         ∀ value ∊ year:
    //             group=country, x=year, y=value

    var count = 0
    for (country in model)
    {
        if (count++ < 16)
        {
            groups.add({
                id: country,
                content: country,
                options: { drawPoints: { style: 'square' } }
            })

            for (year in model[country]){
                //var value = Number(model[country][year])
                if (model[country][year] != "")
                {
                    var value = Number(model[country][year])
                    if (!isNaN(value))
                    {
                        items.push({ x:year, y:value, group:country })
                    }
                }
            }
        }
    }

  var dataset = new vis.DataSet(items);
  var options = {
      defaultGroup: 'ungrouped',
      legend: true,
      //start: '2014-06-10',
      //end: '2014-07-04',
      height: '100%',
  };

  var container = document.createElement('div');
      container.className = 'visContainer'
  var graph2d = new vis.Graph2d(container, dataset, groups, options);
  return container;
}
