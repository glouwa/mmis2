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
        $('div.left')[0].appendChild(tag); // native html
        //$('div.left').append(tag);    // jquery
    }
}

var drawGraph = function(graphType, model)
{
    $('div.right').empty()
    if (graphType === '2dplot') $('div.right')[0].appendChild(createVis2dGraph(model));
    if (graphType === 'bar')    $('div.right')[0].appendChild(createVis2dGraph());
    if (graphType === '3dplot') $('div.right')[0].appendChild(createVis2dGraph());
    if (graphType === 'map')    $('div.right')[0].appendChild(createVis2dGraph());
}

var createVis2dGraph = function(model)
{
    var items = [];
    var groups = new vis.DataSet();
    // var groups = new vis.DataSet();

    //     groups.add({
    //     id: 0,
    //     content: names[0],
    //     options: {
    //         drawPoints: {
    //             style: 'square' // square, circle
    //         }
    //     }});
    //
    // groups.add({
    //     id: 1,
    //     content: names[1],
    //     options: {
    //         drawPoints: {
    //             style: 'square' // square, circle
    //         }
    //     }});

    var count = 0
    for (country in model)
    {
        if (count++ < 4)
        {
            groups.add({
                id: country,
                content: country,
                options: { drawPoints: { style: 'square' } }
            })
            for (x in model[country]){
                var y = Number(model[country][x])
                if (!isNaN(y))
                    items.push({x:Number(x), y:y, group: country})
            }
            console.log(items[items.length-1])
        }
    }


  // var items = [
  //   {x: '2014-06-13', y: 60, group: 1},
  //   {x: '2014-06-14', y: 40, group: 1},
  //   {x: '2014-06-15', y: 55, group: 1},
  //   {x: '2014-06-16', y: 40, group: 1},
  //   {x: '2014-06-17', y: 50, group: 1},
  //   {x: '2014-06-13', y: 30, group: 1},
  //   {x: '2014-06-14', y: 10, group: 0},
  //   {x: '2014-06-15', y: 15, group: 0},
  //   {x: '2014-06-16', y: 30, group: 0}
  // ];

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
