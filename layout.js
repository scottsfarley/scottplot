var mouseX; //keeps track of mouse location
var thisRect; //keeps tack of drag rectangles
var replaceRect; // keeps track of rectangle to replace with dragging

//replace the rectangles -->reorder
var dragRect = d3.behavior.drag()
	.on('dragstart', function(){
		//change color to show active state
		thisRect = d3.select(this)
		thisRect
			.attr('stroke', 'yellow')
			.attr('stroke-width', 5)
	})
	.on('drag', function(){
		//update position of mouse
		mouseX = d3.event.x
	})
	.on('dragend', function(){
		//get rid of active coloring
		thisRect.attr('stroke', 'black')
			.attr('stroke-width', 1) 
		//get mins/maxes
		thisStart = +thisRect.attr('x')
		thisWidth =  +thisRect.attr('width')
		thisMax = thisStart + thisWidth
		console.log(replaceRect)
		replaceRect = d3.select(replaceRect)
		replaceStart = replaceRect.attr('x')
		repalceStart = parseInt(replaceStart)
		replaceWidth = replaceRect.attr('width')
		replaceWidth = parseInt(replaceWidth)
		replaceMax = replaceStart + replaceWidth
		//get labels from layout Data
		thisRectNum = +thisRect.attr('rectNum')
		replaceRectNum = +replaceRect.attr('rectNum')
		thisLabel = layoutData[thisRectNum]['labelText']
		thisPercent = layoutData[thisRectNum]['percentText']
		replaceLabel = layoutData[replaceRectNum]['labelText']
		replacePercent = layoutData[replaceRectNum]['percentText']
		//text positions
		thisTextPos = thisLabel.attr('x')
		replaceTextPos = replaceLabel.attr('x')	
		//do the replacement on dragend
		if ((mouseX > thisStart) & (mouseX < thisMax)){
			console.log('inside this rectangle')
		}else{
			//replace the rectangles
			replaceRect.attr('x', thisStart)
			thisRect.attr('x', replaceStart)
			//replace the labels -->need to rotate relative to new position
			thisLabel.attr('x', replaceTextPos)
				.attr('transform', 'rotate(-90 ' + replaceTextPos + ',' + (100) + ')')
			replaceLabel.attr('x', thisTextPos)
				.attr('transform', 'rotate(-90 ' + thisTextPos + ',' + (100) + ')')
			//replace the percents -->horizontal -->no transformation required
			thisPercent.attr('x', replaceTextPos)
			thisPercentContent = thisPercent.text()
			replacePercent.attr('x', thisTextPos)
			//replace in graphing order
			thisID = layoutData[thisRectNum]['taxonID']
			replaceID = layoutData[replaceRectNum]['taxonID']
			thisIndex = graphingOrder.indexOf(thisID)
			replaceIndex= graphingOrder.indexOf(replaceID)
			graphingOrder.splice(thisIndex, 1, replaceID)
			graphingOrder.splice(replaceIndex,1, thisID)
		}

	})
//resize the rectangles
var dragLine = d3.behavior.drag()
	.on('drag', function(){
		//current is the rectangle that owns the line -->next is rectangle to the right
		thisLine = d3.select(this)
		mouseX = d3.event.x
		lineNum = +thisLine.attr('lineNum')
		currentRect = layoutData[lineNum]['rectangle']
		nextRect = layoutData[(lineNum + 1)]['rectangle']
		//get current dimensions
		currentRectStart = currentRect.attr('x')
		currentRectWidth = currentRect.attr('width')
		nextRectStart = +nextRect.attr('x')
		nextRectWidth = +nextRect.attr('width')
		nextRectEnd = nextRectStart + nextRectWidth
		//calculate new dimensions
		newCurrentWidth = (mouseX - currentRectStart)
		newCurrentPercent = (newCurrentWidth / canvasArea) * 100
		newCurrentPercentLabel = Math.round(newCurrentPercent) + '%'
		newNextWidth = nextRectEnd - mouseX
		newNextPercent = (newNextWidth / canvasArea) * 100
		newNextPercentLabel = Math.round(newNextPercent) + '%'
		if ((newCurrentPercent > 5) & (newNextPercent > 5) & (newCurrentPercent < 95) & (newNextPercent < 95)){
			thisLine.attr('x1', (mouseX-3))
			thisLine.attr('x2', (mouseX-3))
			nextRect.attr('x', mouseX)
			nextRect.attr('width', newNextWidth)
			currentRect.attr('width', newCurrentWidth)
			currentTextPos = (+newCurrentWidth)/2 + +currentRectStart
			nextTextPos = (+nextRectEnd - mouseX)/2 + mouseX
 			currentPercentElement = layoutData[lineNum]['percentText']
 			currentPercentElement.attr('x', currentTextPos).text(newCurrentPercentLabel)
 			nextPercentElement = layoutData[(lineNum + 1)]['percentText']
 			nextPercentElement.attr('x', nextTextPos).text(newNextPercentLabel)
 			currentLabelElement = layoutData[lineNum]['labelText']
 			currentLabelElement.attr('x', currentTextPos).attr('transform', 'rotate(-90 ' + currentTextPos + ',' + (100) + ')')
 			nextLabelElement = layoutData[(lineNum+1)]['labelText']
 			nextLabelElement.attr('x', nextTextPos).attr('transform', 'rotate(-90 ' + nextTextPos + ',' + (100) + ')')
		}
		
	})
var mouseLine = function(){
	theLine = d3.select(this)
	theLine.attr('stroke', 'blue').attr('stroke-width', 10)
}

colors = ['lightyellow', 'blue', 'green', 'red', 'lightorange', 'purple', 'cyan']
graphingOrder = []
function selectTaxonForGraphing(){
	d3.selectAll('.t').remove() //delete any existing lines so we can add new ones to the layout plot
	id = this['id']
	label = $(this).html()
	layoutLabels.push(label)
	file = $(this).data('file')
	var plainID = id.split('mainSelect').join('')
	graphingIndex = graphingOrder.indexOf(plainID)
	$(this).toggleClass('selectedTaxa')
	if (($(this).hasClass('selectedTaxa'))&(graphingIndex==-1)){///active
		numTaxa +=1
		$('#taxaBadge').html(numTaxa)
		$('select-menu-item').addClass('menu-completed')
		
		if (graphingIndex == -1){
			graphingOrder.push(plainID)
		}
		var OptionsID = id.split('mainSelect').join('Options')
		var i = 0;
		var offset = layoutAxis
		oldx = offset
		///divide the diagram based on number of curves needed
		while (i < numTaxa){
			xPos = (canvasArea)/numTaxa + offset
			textPos = (xPos - oldx)/2 + oldx
			width = xPos - oldx
			percent = (width / canvasArea) * 100
			percentRound = Math.round(percent * 100) / 100
			taxBox = layout.append('g')
			tax = taxBox.append('rect')
				.attr('x', offset)
				.attr('y', 0)
				.attr('height', layoutHeight)
				.attr('width', width)
				.attr('fill', colors[i])
				.attr('stroke', 'black')
				.attr('class', 't')
				.attr('opacity', .5)
				.attr('rectNum', i)
				.call(dragRect)
			if (i != (numTaxa-1)){
				dragline = taxBox.append('line')
					.attr('y1', 0)
					.attr('y2', layoutHeight)
					.attr('stroke', 'lightyellow')
					.attr('stroke-width', 12)
					.attr('class', 'dragline t')
					.attr('x1', (xPos-5))
					.attr('x2', (xPos-5))
					.attr('lineNum', i)
					.attr('opacity', 0.75)
					.call(dragLine)
			}
			labelText = layout.append('text')
				.text(layoutLabels[i])
				.attr('x', textPos)
				.attr('y', (layoutHeight/2))
				.attr('class', 't')
				.attr('transform', 'rotate(-90 ' + textPos + ',' + (100) + ')')
				.attr('text-anchor', 'middle')
			percentText = layout.append('text')
				.text(percentRound + '%')
				.attr('x', textPos)
				.attr('y', 20)
				.attr('class', 't')
				.attr('text-anchor', 'middle')
			taxonID = graphingOrder[i]
			layoutData[i] = {'rectangle': tax, 'percentText':percentText, 'labelText':labelText, 'taxonID': taxonID}
			offset += (canvasArea)/numTaxa 
			oldx = xPos
			i+=1
			tax.on('mouseover', function(){
				replaceRect = this
			})
			tax.on('click', function(){ //show the extra controls
				alert(this)
			})
		}
	}
}

 
 
 
 
 var numTaxa = 0;
 var taxaIDs = []
 ////select for graphing is fired from the file handling functions
 function OLD(){
 	input = this
 	label = $(input).html()
 	id = this['id']
 	file = $(input).data('file')
 	$(input).toggleClass('selectedTaxa')
 	if ($(input).hasClass('selectedTaxa')){ //if it has the class it is actively selected for graphing...GO!
 		numTaxa +=1
 		$('#taxaBadge').html(numTaxa)
 		$('#select-menu-item').addClass('menu-completed')
 		index = taxaIDs.indexOf(id)
 		if (index != -1){
 			taxaIDs.push(id)
 		}
 		var optionsID = id.split('_mainSelect').join('_Options')
 		$('#taxaContent').append('<div id="' + optionsID + '" class="taxaOptions"></div>')

 		$('#' + optionsID).append('<h4 class="page-header">' + label + '   </h4><span><i>From File: ' + filenames[file] + '<i><span>' )
 			.append('<ul class="list-group">')
 			.append('<li class="list-group-item">Curve Fill <input type="color" id="' + optionsID + '_Fill" value="3366FF"/>')
 			.append('<li class="list-group-item">Curve Outline <input type="color" id="' + optionsID + '_Stroke" value="3366FF"/>')
 			.append('<li class="list-group-item">Group <select id="' + optionsID + '_Group" name="taxagroups"> <option value="None">No Group</option><option value="Trees">Trees</option><option value="Shrubs">Shrubs</option><option value="Herbs">Herbs</option><option value="Ferns">Ferns</option><option value="Aquatics">Aquatics</option><option value="H&S">Herbs and Shrubs</option></select>')
 			var normtype = "<option value='none'>None</option>"
 			$('#' + optionsID).append("<li class='list-group-item'>Normalization Type <select id='"+optionsID +"_Norm' name='normType' class='normSelect'>" + normtype + "</select>")
 			$('#' + optionsID).append('<li class="list-group-item">Curve Width <input type="number" id="' + optionsID + '_UserWidth" step="0.01"/> ' + '<i>or...</i>Autoscale <input type="checkbox" id="' + optionsID + '_Autoscale" checked/></li>')
 			$('#' + optionsID).append('<li class="list-group-item">Curve Width <input type="number" id="' + optionsID + '_UserScale" step="0.01"/> ' + '<i>or...</i>Autoscale <input type="checkbox" id="' + optionsID + '_ScaleAutoscale" checked/></li>')
 			$('#' + optionsID).append('<li class="list-group-item">Bottom Label <input type="text" id="' + optionsID + '_btmLab" placeholder="None"/>')
 			$('#' + optionsID).append('</ul>')
 			main_id = optionsID.split('_Options').join("")
 			dataProps[numTaxa] = {'file':file, 'id':main_id}
 			

 	}else{
 		numTaxa -=1
 		delete dataProps[id]
 		if (numTaxa != 0){
 			$('#taxaBadge').html(numTaxa)
 		}else{
 			$('#taxaBadge').html("")
 			$('#select-menu-item').removeClass('menu-completed')
 		}
 		$('#'+OptionsID).remove()
 	}
 }