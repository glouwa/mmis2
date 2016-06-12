var drawTagCloud = function(htmlElementSelector, dim, callback)
{
    var onTagClick = function(tag, key) {
        viewModel.selection[dim] = viewModel.selection[dim] || {}
        if (viewModel.selection[dim][key])
            delete viewModel.selection[dim][key]
        else
            viewModel.selection[dim][key] = 'viewModel.data[featureId][label]'

        updateView()
    }

    var createTag = function(tagName, click) {
        let tag = document.createElement('span')
            tag.className = 'cloudTag'
            tag.innerText = tagName
            tag.onclick = click
            //tag.style.fontSize = 0.01 + (1.3 * tagWeight()) + 'em'
            tag.update = function() {
                //console.log(dim)

                if (!viewModel.selection[dim])
                        tag.style.backgroundColor = str2Color(tag.innerText, 0.4)
                else
                {
                    if (viewModel.selection[dim][tagName])
                        tag.style.backgroundColor = str2Color(tag.innerText, 0.4)
                    else
                        tag.style.backgroundColor = 'white'
                    var weight = viewModel.density[dim][tagName]
                    tag.style.fontSize = 0.01 + (1.3 * weight) + 'em'
                }
            }
        return tag
    }

    $(htmlElementSelector).empty()
    $(htmlElementSelector)[0].appendChild(createTag('ALL', ()=> {
        viewModel.selection[dim] = undefined
        updateView()
    }))
    $(htmlElementSelector)[0].appendChild(createTag('NONE', ()=> {
        viewModel.selection[dim] = {}
        updateView()
    }))

    //var sortedModel = model[country].sort((a,b)=> a.weight < b.weight)
    for (key in viewModel.keys[dim]) {
        let tagName = key
        let tag = createTag(tagName, ()=> onTagClick(tag, tagName))
        if (viewModel.selection[dim][key])
            tag.style.backgroundColor = str2Color(tagName, 0.4)
        $(htmlElementSelector)[0].appendChild(tag)
    }
}

var tabControl = function(tabs)
{
    var view = document.createElement('div')
        view.className = 'tabControl'

    view.setGraph = function(name) {
        console.log(name)
        if (viewModel.currentGraph)
            viewModel.currentGraph.deactivate()
        viewModel.currentGraph = tabs[name]()
        view.innerHTML = ''
        view.appendChild(viewModel.currentGraph)
        //console.log(viewModel.currentGraph)
    }

    view.setGraph('1D')

    for (let name in tabs) {
        var li = document.createElement('li')
            var a = document.createElement('a')
                a.innerText = name
                a.onclick = ()=> {
                    view.setGraph(name)
                    viewModel.currentGraph.update()
                }
            li.appendChild(a)
        $('graph-type')[0].appendChild(li)
    }
    return view
}
