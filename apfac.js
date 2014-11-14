/**
 * @author Scott Farley
 */
//////Var defs
var types = undefined;
var normFileData = undefined;
var weight = undefined;
var volume = undefined;
var influx = undefined;
var weightResult = "";
var volumeResult = "";
var influxResult = "";
var allDepths


/////message passing functions
function debug(msg){
	postMessage(JSON.stringify({type:'debug', msg:msg}))
}
function respond(msg){
	postMessage(JSON.stringify({type:'response', msg:msg}))
}
/////////define functions do do the work
function calcWeight(){
	debug('Calculating Weight')
	weightReturn = []
	data = normFileData['data']
	for (i in data){
		var row = data[i]
		var depth = row[0]
		var counted = row[1]
		var expected = row[2]
		var sampleWeight = row[3]
		var result = counted * sampleWeight / expected
		weightReturn.push(result)
		i +=1
	}
	return weightReturn
}
function calcVolume(){
	debug('Calculating Volume')
	volumeReturn = []
	data = normFileData['data']
	for (i in data){
		var row = data[i]
		var depth = row[0]
		var counted = row[1]
		var expected = row[2]
		var sampleVolume = row[4]
		var result = counted * sampleVolume/ expected
		volumeReturn.push({'depth': depth, 'value':result})
	}
	return volumeReturn
}
function calcInflux(){
	debug('calculating influx')
	influxReturn = []
	data = normFileData['data']
	for (i in data){
		var row = data[i]
		var depth = row[0]
		var counted = row[1]
		var expected = row[2]
		var sampleVolume = row[4]
		var sampleYears = row[5]
		var result = counted * sampleVolume * sampleYears/ expected
		influxReturn.push({'depth': depth, 'value':result})
	}
	return influxReturn
}

function Interpolate(x1, x3, y1, y3, x2){ ///interpolatation function to find y2
	var result = ((x2 - x1)(y3-y1)/(x3-x1)) + y1
	return result
}

function interpolateToDepths(set){
	debug('Interpolating')
	var countedDepths = []
	var countedValues = []
	for (i in set){
		countedDepth = set[i]['depth']
		countedDepths.push(countedDepth)
		countedValue = set[i]['value']
		countedValues.push(countedValue)
	}
	
}
////dispatching function
function doNormalization(){
	debug('---Doing Normalizations-----')
	if (weight == 'true'){
		weightResult = calcWeight()
		
	}
	if (volume == 'true'){
		volumeResult = calcVolume()
		
	}
	if (influx == 'true'){
		influxResult = calcInflux()
		
	}
	//respond({'influxReturn': influxResult})
	//respond({'volumeReturn': volumeResult})
	//respond({'weightReturn': weightResult})
	respond({'message': 'dataReturn', 'InfluxReturn':influxResult, 'VolumeReturn': volumeResult, 'WeightReturn':weightResult})
	respond('-----DONE-----')
}

////////Message passing interface
self.addEventListener('message', function(e){
	debug('-- New Message Recieved -- ')
	data = JSON.parse(e.data);
	if (data['message'] == 'types'){
		types = data
		weight = types['weight']
		volume = types['volume']
		influx = types['influx']
		debug('Types Recieved')
	}else if (data['message'] == 'Depths'){
		allDepths = data
	}
	else if (data['message'] = 'data'){///if its not types or depths it must be data
		debug('Data Recieved')
		normFileData = data
		doNormalization()
	}
	
}, false)
