/**
 * @author Scott Farley
 */

function trimToId(string){
	s = string.trim()
	s = s.split('/').join('_')
	s = s.split(' ').join('_')
	s = s.split('&').join('_')
	s = s.split('?').join('_')
	s = s.split('%').join('_')
	s = s.split(')').join('_')
	s = s.split('(').join('_')
	s = s.split('.').join('_')
	s = s.split('#').join('_')
	s = s.split(':').join('_')
	return s
}
var data = {}
numfiles = 0;
var filenum = 0
var filenames = []
var allDepths = []
var plotTitle = "";
var dataProps = {}
var IdsToNames = []



function loadTaxa(data){
	console.log('called')
	$('#taxa').html("")//clear on the prepare page
	$('#subtotalTaxa').html("")///clear the subtotals box
	$('#toggleTaxa').show()
	////Alert user to fileload
	$("#filestatus").html(function(){
		var output = ""
		var i = 0
		var listlength = filenames.length
		while (i < listlength){
			console.log(i, listlength)
			output += filenames[i]
			if (i == (listlength - 1)){
				output += " "
			}else{
				output += ", "
			}
			i +=1
		}
		output += "Loaded"
		return output;
	})
	$('#filestatus').show(function(){$(this).fadeOut(5000)})
	var i = 0
	data_length = Object.keys(data).length
	while(i < data_length){
		////Do it for the prepare tab
		id = trimToId(filenames[i])
		console.log(id)
		$('#taxa').append('<div id="' + id + '_taxaDiv" class="taxadiv"></div>')
		var theDiv = $('#' + id + "_taxaDiv")
		theDiv.append('<h4 class="page-header">' + filenames[i] + "</h4>" )
		var j = 0;
		dname = 'datafile_' + (i)
		var dataset = data[dname]
		var names = []
		var x = 0
		/////And also add a checkbox in the subtotals area
		$('#subtotalTaxa').append('<div id="' + id + '_subtotalDiv" class="taxadiv"></div>')
		var subtotalDiv = $('#' + id + "_subtotalDiv")
		subtotalDiv.append('<br /><hr />')
		while (x < dataset[0].length){
			name = dataset[0][x]
			if ((name != "") & name != " "){
				names.push(name)
				name_id = trimToId(name)
				name_html = $("<a class='taxonName' id='" + name_id + "_mainSelect' data-file='" + i + "'>" + name + "</a>").on('click', selectTaxonForGraphing).css('color', 'black')
				theDiv.append(name_html)
				subtotalDiv.append('<div id="' + name_id +'_subtotalSelect" class="subtotal_select"></div>')
				taxonSubtotalDiv = $('#' + name_id + '_subtotalSelect')
				st_input = "<input id='" + name_id + "_stInput' type='checkbox' name='"+ name_id + "'/>"
				label ="<label for='" + name_id + "'>" + name + "</label>"
				box = $(st_input + label)
				box.on('change', addToSubtotal)
				taxonSubtotalDiv.append(box)
				subtotalDiv.append(taxonSubtotalDiv)
				id2name = {'Id':name_id, 'name': name}
				IdsToNames.push(id2name)
			}
		
			x +=1
		} // end of names loop
		depthIndex = 0
		while (depthIndex < dataset.length){
			depth = dataset[depthIndex][0];
			depth = parseInt(depth)
			checkDepth = allDepths.indexOf(depth)
			if ((checkDepth == -1) & $.isNumeric(depth)){
				allDepths.push(depth)
			}
			depthIndex +=1
		}//end of depths loop
		i+=1 //advance to the next file
	}
	theDiv.append('<br />')
	$('#datafilesBadge').html(data_length)
}

///////Handle file reader stuff and delegate to other functions////////
function handleFiles(files){
	for (var i=0, f; f=files[i]; i++ ){
		numfiles +=1
		file = files[i]
		if (filenames.indexOf(file['name']) == -1){
		filenames.push(file['name'])
		}
		var reader = new FileReader();
		
		reader.onload = function(e){
			updata = e.target.result
			var name = 'datafile_' + i
			var d = d3.csv.parseRows(updata)
			q = 'datafile_' + filenum
			data[q] = d
			filenum +=1
			loadTaxa(data)
		}
		reader.readAsText(file)
	}
	$('#datafile-menu-item').addClass('menu-completed')
}
////////////////Drag and Drop Files///////////////////////
$('#dd').on('dragenter', function(e){
	e.stopPropagation();
	e.preventDefault();
});
$('#dd').on('dragover', function(e){
	e.stopPropagation();
	e.preventDefault();
});
$('#dd').on('drop', function(e){
	e.preventDefault()
	var files = e.originalEvent.dataTransfer.files;
	handleFiles(files);
})
//prevent default drag/drop behavior on whole document
$(document).on('dragenter', function (e) 
{
    e.stopPropagation();
    e.preventDefault();
});
$(document).on('dragover', function (e) 
{
  e.stopPropagation();
  e.preventDefault();
});
$(document).on('drop', function (e) 
{
    e.stopPropagation();
    e.preventDefault();
});
//////////Handle if the user doesn't want do do D&D//////
$('#datafiles').on('change', function(e){
	var obj = document.getElementById('datafiles')
	var files = obj.files
	handleFiles(files)
})
////hide taxa on click/////
$('#toggleTaxa').hide()
$('#toggleTaxa').on('click', function(){
	$('#taxa').slideToggle();
})


/////tooltips/////
$('.tt').tooltip()

////Message Fading////////
$('#filestatus').hide()

///////////NORMALIZATION Tab//////////////////////////////////////////////////
////Subtotals
var numSubtotals = 0;
var current_subtotal = numSubtotals;
var subtotals = {}
var subtotalColors = ['red', 'green', 'aqua', 'chartreuse', 'chocolate', 'cornflowerBlue', 'darkMagenta', 'DarkSlateBlue', 'DeepPink', 'Green', 'Salmon']
$('#subtotalTaxa').hide()
$('#makeNewSubtotal').on('click', addSubtotal)
function addSubtotal(){
	console.log('adding subototal')
	$('#subtotalTaxa').show()
	numSubtotals +=1
	current_subtotal = +current_subtotal + 1
	color = subtotalColors[(numSubtotals -1)]
	var textinput = '<input type="text" name="subtotal_' + numSubtotals + '" id="subtotal_' + numSubtotals + '" class="st_entry" size=125/>'
	var label = '<label for="subtotal_"' + numSubtotals + '" style="color:' + color + '">Subtotal ' + numSubtotals + ': </label>' 
	var add = '<div>' + label + textinput + '</div>'
	subtotals[numSubtotals] = []
	$('#subtotals').append(add)
	$('.st_entry').on('click', updateSubtotal)
	$('#subtotalsBadge').html(numSubtotals)
	$('#subtotal-menu-item').addClass('menu-completed').css('font-size', 'smaller')
	$('.normSelect').append('<option value="subotal"' + numSubtotals + '">Subtotal ' + numSubtotals + '</option>')
}
function updateSubtotal(){ 
	id = this['id'];
	num1 = id.slice(-1).toString()
	num2 = id.slice(-2,-1).toString()
	console.log("num1 " + num1)
	console.log(num2)
	if (num2 == "_"){
		console.log('_')
		num = num1
	}else{
		num = num2 + num1
	}
	current_subtotal = num 
}
function addToSubtotal(){
	var theLabel = $('label[for=' + this.name + ']')
	console.log(theLabel)
	var name = theLabel.html()
	console.log(name)
	input = this
	checked = input.checked
	st = '#subtotal_' + current_subtotal
	if (checked){
		color = subtotalColors[current_subtotal - 1]
		console.log(color)
		$(theLabel).css('color', color)
		console.log(theLabel)
		if(!$.isEmptyObject(subtotals)){
			subtotals[current_subtotal].push(name)
			current_val = $(st).val()
			new_val = current_val + name + ', '
			$(st).val(new_val)
		}
	}else if(!checked){
		$(theLabel).css('color', 'black')
		current_val = subtotals[current_subtotal]
		index = subtotals[current_subtotal].indexOf(name)
		subtotals[current_subtotal].splice(index, 1)
		console.log(subtotals[current_subtotal])
		i = 0
		val = ""
		while (i < subtotals[current_subtotal].length){
			val += subtotals[current_subtotal][i] + ', '
			i+=1
		}
		$(st).val(val)
	}			
}
$('#toggleSubtotals').on('click', function(){
	$('#subtotalTaxa').slideToggle()
	$('#toggleSubtotals').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus')
})
$('#normalizationContent').hide()
$('#toggleNormalization').on('click', function(){
	$('#concentrationSelection').slideToggle()
	$('#toggleNormalization').toggleClass('glyphicon-minus').toggleClass('glyphicon-plus')
})
////////Menu Bar status changes//////////////
///datafiles completion occurs in the handleFiles function
$('#chronofile').on('change', function(){
	$('#chrono-menu-item').addClass('menu-completed')
	var obj = document.getElementById('chronofile')
	var file = obj.files[0]
	handleChronoFile(file)
})
$('#normfile').on('change', function(){
	$('#normfile-menu-item').addClass('menu-completed')
	$('#normalizationContent').show()
})
////update class of project title menu item and change the left hand title to the project name
$('#titleInput').on('change', function(){
	var title = $('#titleInput').val()
	$('#projectTitle').html(title)
	$('#name-menu-item').addClass('menu-completed')
	plotTitle = title;
})
/////////////////
var normFileData;
$('#normfile').on('change', function(e){
	var obj = document.getElementById('normfile')
	var file = obj.files[0]
	handleNormData(file)
})
function handleNormData(file){
	var reader = new FileReader();
	reader.onload = function(e){
			updata = e.target.result
			var d = d3.csv.parseRows(updata)
			normFileData = d
		}
	reader.readAsText(file)
}

var allTime = []
function handleChronoFile(file){
	var reader = new FileReader();
	reader.onload = function(e){
		updata = e.target.result
		var d = d3.csv.parseRows(updata)
		var i = 0
		while (i < d.length){
			var time = {}
			time['depth'] = d[i][0]
			time['chrono'] = d[i][1]
			time['date'] = d[i][2]
			allTime.push(time)
			i+=1
		}
	}
	reader.readAsText(file)
}



////apfac globals
var weightApfac ="";
var volumeApfac ="";
var influxApfac=[];
var numNorms = 0


///THIS FUNCTION DELEGATES A NEW PARALLEL WORKER THREAD TO CALCULATE APFAC NORMALIZATIONS
 $('#calcApfac').on('click', function(){
 	
 	var worker = new Worker('apfac.js'); // spawn worker thread
 	var types = {'message':'types', 'weight':"false", 'volume': "false", 'influx': "false"}
 	var weightInput = $('#doConcentrationWeight')
 	weightChecked = weightInput.prop('checked')
 	var volumeInput = $('#doConcentrationVolume')
 	var volChecked = volumeInput.prop('checked')
 	var influxInput = $('#doInflux')
 	var influxChecked = influxInput.prop('checked')
 	if (weightChecked){
 		console.log('weight checked')
 		types['weight'] = 'true'
 	}
 	if (volChecked){
 		console.log('volume checked')
 		types['volume'] = 'true'
 	}
 	if (influxChecked){
 		console.log('influx checked')
 		types['influx'] = 'true'
 	}
 	
 	///////////send messages
	var typeMSG = JSON.stringify(types)
	worker.postMessage(typeMSG); //tell the worker which types of normalization are requested
	
	///pass over the required depths
	var depthsMSG = {'message': 'Depths','Depths':allDepths}
	console.log(depthsMSG)
	var depthsMSG = JSON.stringify(depthsMSG)
	worker.postMessage(depthsMSG)
	
	////pass the values of the normalization file
	var normdata = {'message': 'data', 'data': normFileData}
	var normdata = JSON.stringify(normdata)
	worker.postMessage(normdata)
	

	///respond to worker messages
	 worker.onmessage = function (e) {
	  	var result = JSON.parse(e.data);
	  	if(result.type == 'debug') {
	    	console.log("Worker DEBUG: " , result.msg);
	  	} else if(result.type == 'response') { ///we can use the results here...right now just logging to console
	    	if (result.msg['message'] == 'dataReturn'){
	    		returnData = result.msg
	    		weightApfac = returnData['WeightReturn']
	    		volumeApfac = returnData['VolumeReturn']
	    		///somehow this one is different...fix when possible
	    		for (i in returnData['InfluxReturn']){
	    			val = returnData['InfluxReturn'][i]['value']
	    			influxApfac.push(val)
	    		}
	    		console.log('apfacs recieved....shutting down worker thread')
	    		worker.terminate()
	    		if (weightApfac != ""){
	    			$('.normSelect').append('<option value="weightNorm">Grains per weight</option>')
	    			numNorms +=1
	    		}
	    		if (volumeApfac != ""){
	    			$('.normSelect').append('<option value="volumeNorm">Grains per volume</option>')
	    			numNorms +=1
	    		}
	    		if (influxApfac != ""){
	    			$('.normSelect').append('<option value="influxNorm">Grains per area per year</option>')
	    			numNorms +=1
	    		}
	    		$('#influxBadge').html(numNorms)
	    	}
	  	}
	}
	$('#influx-menu-item').addClass('menu-completed').css('font-size', 'smaller')
	
 })
 
 /////////////BUILD TAB//////////////////////
 ///Plot Dimensions
 var plotWidth = 800
 var plotHeight = 800
 $('#plotAutoscale').on('change', function(){ ////disable use of manual inputs on autoscale
 	input = this
 	checked = input.checked
 	if (checked){
 		$('#plotHeight').prop('disabled', true)
 		$('#plotWidth').prop('disabled', true)
 		$('#plotHeight').val('')
 		$('#plotWidth').val('')
 		plotWidth = 700
 		plotHeight = 800
 	}else{
 		$('#plotWidth').prop('disabled', false)
 		$('#plotHeight').prop('disabled', false)
 	}
 })
 //////convert from inches to points
 $('#plotWidth').on('change', function(){
 	val = $('#plotWidth').val()
 	plotWidth = val * 72
 })
 $('#plotHeight').on('change', function(){
 	val = $('#plotHeight').val()
 	plotHeight = val * 72
 })
 $('#plotDimToggle').on('click', function(){
 	$('#plotDimContent').slideToggle()
 	$('#plotDimToggle').toggleClass('glyhpicon-minus').toggleClass('glyphicon-plus')
 })
 
 
 ////Automatically disable scale on time until a chronology file has been uploaded
 $('#scaleOnTime').prop('disabled', true)
 $('#scaleOnTimeItem').css('color', 'gray')
 $('#chronofile').on('change', function(){
 	$('#scaleOnTime').prop('disabled', false)
 	$('#scaleOnTimeItem').css('color', 'black')
 })
 
 //////////Taxa tab
 var numTaxa = 0;
 var taxaIDs = []
 ////select for graphing is fired from the file handling functions
 function selectTaxonForGraphing(){
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
 ////////////////Plot on Button Click//////////////////
 $('#working').hide()
 
 $('#go').on('click', function(){
 	log('STARTING NEW RUN', datetime, 'success')
 	
 	addRuler = $('#addRuler').prop('checked')
 	smoothOnClick = $('#add3PointToggle').prop('checked')
 	

 	d3.selectAll('svg').remove()
 	var plotBottom = plotHeight - 100
 	var plotTop = 150
 	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
 	
 	
 	
 	////Deal with the tabs --> makes the user know something is going on...
 	$('#working').show(function(){
 		$(this).fadeOut(3000)
 	})
 	setTimeout(function(){$('#plotTab').addClass('menu-completed')}, 1000)
 	$('#working').addClass('glyphicon-refresh-animate').addClass('label').addClass('label-warning')
 	
 	log('Starting up', 'Creating Plot....', 'success')
 	plot = d3.select('#thePlot').append('svg')
 		.attr('height', plotHeight)
 		.attr('width', plotWidth)
 	log('Initializing Plot',('Plot Height: ' + plotHeight), 'info')
 	log('Initializing Plot',('Plot Width: ' + plotWidth), 'info')
 	
 	
 	///add title -->should scale with user size eventually
 	plot.append('text')
 		.attr('x', 50)
 		.attr('y', 100)
 		.text(plotTitle)
 		.attr('font-size', 'x-large' )
 	
 	
 	///////////////////y-axis scaling////////////////////////////////////
 	log('Initializing Axes','Calculating depth  min/max', 'success')
 	////find depth min/max
 	minDepth= d3.min(allDepths)
 	maxDepth = d3.max(allDepths)
 	log('Min Depth: ' , minDepth, 'info')
 	log('Max Depth: ', maxDepth, 'info')

 		minTime = Infinity
 		maxTime = -Infinity
 	if ($('#chronofile').val() != ""){//Find chrono min/max if a file is uploaded
 		log('Initializing Axes','Calculating chrono min/max', 'success')
 		
		numTimes = allTime.length
		var i = 0
 		while ( i < numTimes){
 			time = +allTime[i]['chrono']
 			if (($.isNumeric(time)) & (time > maxTime)){
 				maxTime = time
 			}
 			if (($.isNumeric(time)) & (time < minTime)){
 				minTime = time
 			}
 			i +=1
 		}
 		log('Max Age', maxTime, 'info')
 		log('Min Age', minTime, 'info')
 	}else{
 		log('Initializing Axes','No time file specified', 'warning')
 	}
 	///////Determine Primary Axis
 	var scaleOnDepth = $('#scaleOnDepth').prop('checked')
 	var scaleOnTime= $('#scaleOnTime').prop('checked')
 	if (scaleOnDepth){
 		////Scale on depth
 		log('Depth Axis','scaling on depth requested', 'info')
 		var depthScale = d3.scale.linear()
 			.domain([minDepth, maxDepth])
 			.range([plotTop, plotBottom])
 		
 		var depthTest1 = depthScale(minDepth)
 		var depthTest2 = depthScale(maxDepth)
 		if (($.isNumeric(depthTest1)) & ($.isNumeric(depthTest2))){
 			log('Testing Depth Scale', 'PASSED', 'success')
 		}else{
 			log('Testing Depth Scale', 'FAILED', 'danger')
 			//throw "Depth Scale Test Failed"
 		}
 		var depthAxis = d3.svg.axis()
 			.scale(depthScale)
 			.orient('left')
 			.ticks(20)
 		var depth = plot.append('g')
 			.attr('class', 'axis')
 			.attr('transform', 'translate(100,0)')
 			.call(depthAxis)
 			//////Scale on Chronology
 	}else if(scaleOnTime){ 
 		log('Chronology Axis', 'Scaling on Time Requested', 'info')
 		var chronScale = d3.scale.linear()
 			.domain([minTime, maxTime])
 			.range([plotTop, plotBottom])
 		var chronTest1 = chronScale(minTime)
 		var chronTest2 = chronScale(maxTime)
 		if (($.isNumeric(chronTest1)) & ($.isNumeric(chronTest2))){
 			log('Testing Chronology Scale', 'PASSED', 'success')
 		}else{
 			log('Testing Chronology Scale', 'FAILED', 'danger')
 			//throw "Chronology Scale Test Failed"
 		}
 		var chronAxis = d3.svg.axis()
 			.scale(chronScale)
 			.orient('left')
 			.ticks(20)
 		var chron = plot.append('g')
 			.attr('class', 'axis')
 			.attr('transform', 'translate(100,0)')
 			.call(chronAxis)
 	}
 	////////////////////////y-axis scaling complete/////////////////
 	
 	////////////////////////Gather taxa curve properties/////////////////////
	log('Preparing Data', "Gathering Data Properties...", 'success')
	var numTaxa = Object.keys(dataProps).length
	var x_offset = 100
 	for (taxon in dataProps){
 		var xmin;
 		var xmax;
 		
 		OptionsID = dataProps[taxon]['id'] + '_Options'
 		fillColor = $('#' + OptionsID + '_Fill').val()
 		strokeColor = $('#' + OptionsID + '_Stroke').val()
 		group = $('#'+OptionsID+'_Group').val()
 		Norm = $('#'+OptionsID+"_Norm").val()
 		UserWidth = $('#'+OptionsID+'_UserWidth').val()
 		UserScale = $('#'+OptionsID+'_UserScale').val()
 		WidthAutoscale = $('#'+OptionsID + '_Autoscale').prop('checked')
		ScaleAutoscale =  $('#'+OptionsID+'_ScaleAutoscale').prop('checked')
		btmLab = $('#'+OptionsID + '_btmLab').val()
		dataProps[taxon]['fill'] = fillColor
		dataProps[taxon]['stroke'] = strokeColor
		dataProps[taxon]['group']= group
		dataProps[taxon]['normType'] = Norm
		dataProps[taxon]['Width'] = UserWidth * 72
		dataProps[taxon]['Scale'] = UserScale
		dataProps[taxon]['Auto_Width'] = WidthAutoscale
		dataProps[taxon]['Auto_Scale'] = ScaleAutoscale
		dataProps[taxon]['btmLab'] = btmLab
		console.log(dataProps[taxon]['normType'])
		 	
		 	
		log(('Data gathered for ' + theName), 'Success', 'success')
		////get the file///////
		filenum = dataProps[taxon]['file']
		datafileName = 'datafile_' + filenum
		datafile = data[datafileName]
		namesInFile = datafile[0]
		
		///get the name
		var theName;
		for (item in IdsToNames){
			namesID = IdsToNames[item]['Id']
			namesName = IdsToNames[item]['name']
			if (namesID == dataProps[taxon]['id']){
				dataProps[taxon]['name'] = namesName
				theName = namesName
			}
		}
		indexOfName = namesInFile.indexOf(theName)
		///set x_offset and curve min/max
		
		console.log('auto width? ', dataProps[taxon]['Auto_Width'])
		if (dataProps[taxon]['Auto_Width']){
				xmin = x_offset
				xmax = ((plotWidth + x_offset - 100) / numTaxa) 
				console.log('xmax0 ', xmax)
		}else{
				xmin = x_offset
				xmax = dataProps[taxon]['Width'] 
		}
		console.log('xmax1', xmax)
		
		///Figure out which normalization to do
		var normalizer = 1;
		if (dataProps[taxon]['normType']!= 'None'){
			switch (dataProps[taxon]['normType']){
				case 'volumeNorm':
					normalizer = volumeApfac
					break
				case 'weightNorm':
					normalizer = weightApfac
					break
				case 'influxNorm':
					normalizer = influxApfac
					break
				}
			}
		console.log(normalizer)
		
		///get the values and scale according to instructions
		vals = []
		scaledVals = []
		minDepth = Infinity
		maxDepth = -Infinity
		if (indexOfName != -1){
			i = 1
			while (i < datafile.length){//iterate through the datafile
				depth = +datafile[i][0]
				//check min /max
				if (depth > maxDepth){
					maxDepth = depth
				}
				if (depth < minDepth){
					minDepth = depth
				}
				
				//scale depths according to time or depth
				if (scaleOnDepth){
					scaledY = depthScale(depth)
				}
				if(scaleOnTime){
					scaledY = chronScale(depth)
				}
				value = +datafile[i][indexOfName]
				
				///normalization via subtotals or apfac
				if (dataProps[taxon]['normType'] != 'none'){
					n = normalizer[i]
					value = value / n
				}
				
				
				point = {'x':value, 'depth':depth, 'scaledY':scaledY}
				vals.push(point)
				i+=1
			}
			////XScale
			var taxMax = d3.max(vals, function(d){return d['x']})
			console.log('xmin', xmin, 'xmax', xmax)
			console.log('taxmax', taxMax)
			var xScale = d3.scale.linear()
				.domain([0, taxMax])
				.range([xmin, xmax])
			var taxTest1 = xScale(0)
			console.log('test1: ', taxTest1 )
			console.log('@test1, min, max ', xmin, xmax)
			var taxTest2 = xScale(xmax)
			if (($.isNumeric(taxTest1)) & ($.isNumeric(taxTest2))){
	 			log('Taxa Scale Testing', 'PASSED', 'success')
	 		}else{
	 			log('Taxa Scale Testing', 'FAILED', 'danger')	 		}
	 		////iterate again and scale x vals
	 		
	 		X = xScale(0)
	 		if (scaleOnDepth){
	 			minY = depthScale(minDepth)
	 		}else if(scaleOnTime){
	 			minY = chronScale(minDepth)
	 		}
	 		scaledVals.push({'x':X, 'y':minY})
			for (i in vals){ /////////Normalization can be implemented here
				yval = vals[i]['scaledY']
				oldX = vals[i]['x']
				scaledX = xScale(oldX)
				scaledVals.push({'x':scaledX, 'y': yval})
			}
			if (scaleOnDepth){
	 			maxY = depthScale(maxDepth)
	 		}else if(scaleOnTime){
	 			maxY = chronScale(maxDepth)
	 		}
			bottom = {'x':X, 'y':maxY}
			scaledVals.push(bottom)
			
			
		}

		dataProps[taxon]['vals'] = vals
		log('Drawing Plot', 'Taxa Curves', 'info')
		////////////////////Do rawing////////////////////////////
		///Draw x-axis
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom')
		var taxAxis = plot.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate (0,' + plotBottom + ')')
			.call(xAxis)
			.selectAll('text')
				.style('text-anchor', 'end')
				.attr('dx', '-.8em')
				.attr('dy', '.15em')
				.attr('transform', function(d){
					return 'rotate(-45)'
				});
		log('Drawing Plot', "X-Axis Complete", 'success')
		pathFunction = d3.svg.line()
			.x(function(d){return d.x})
			.y(function(d){return d.y})
			.interpolate('linear')
		
		pathvals = pathFunction(scaledVals)
		console.log(pathvals)
		var curve = plot.append('path')
			.attr('d', pathvals) ///THIS IS NOT NORMALIZED
			.attr('stroke', dataProps[taxon]['stroke'])
			.attr('fill', dataProps[taxon]['fill'])
		
		///Add the label below the graph
		dataProps[taxon]['btmLab']
		plot.append('text')
			.attr('x', xmin)
			.attr('y', plotBottom + 45)
			.text(btmLab)

		x_offset += xmax + 10
		}
 })
 
 
 
 
 
 
 
 $('#plotTab').on('click', function(){
 	$(this).removeClass('menu-completed')
 })
 
 function log(task, message, c){
 	html = '<li class="list-group-item">' + task + ' : ' + message + '</li>'
 	list_class = 'list-group-item-'+c
 	a = $(html).addClass(list_class)
 	$('#theLog').append(a)
 }
 
 

 	
 

/**
 * @author Scott Farley
 */
