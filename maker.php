<?php
	echo $_POST['plotwidth'];
	if($_POST['plotwidth'] != ""){
		$plotwidth = $_POST['plotwidth'];
	}else{
		$plotwidth = 800;
	}
	if($_POST['plotheight'] != ""){
		$plotheight = $_POST['plotheight'];
	}else{
		$plotheight = 800;
	}
	if($_POST['factor_levels'] != ""){
		$factor_levels = $_POST['factor_levels'];
	}else{
		$factor_levels = 1;
	}
	if($_POST['datafilename'] != ""){
		$datafilename = $_POST['datafilename'];
	}else{
		$datafilename = "No data file specified";	
	}
	if($_POST['loifilename'] != ""){
		$loifilename = $_POST['loifilename'];
	}else{
		$loifilename= "No LOI file specified";
	}
	

	$curve_attributes = (string)$_POST['data'];
	$curve_attributes = (array)json_decode($curve_attributes, TRUE);
	$datafile = $_FILES['datafile_upload'];
	$loifile = $_FILES['loifile_upload'];
	$subtotals =(string) $_POST['subtotals'];
	$subtotals = (array)json_decode($subtotals, TRUE);
	$depths = $_POST['depths'];
	$depths = json_decode($depths);
	$depths = array_map('intval', $depths);
	$row = 1;
	$names;
	$depth_length = count($depths);
	if (($handle = fopen($datafile['tmp_name'], "r")) !== FALSE) {
		  while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		  	if ($row == 1){
		  		$names = $data;
		  	}else{
			    $num = count($data);
				$depth = $data[0];
				//echo '<b>'.$depth . '</b>';		
				${'Depth' . $depth} = $data;
				//print_r( ${'Depth' . $depth});
			}
			$row++;
		  }
		  fclose($handle);
		}
	$minDepth = floatval(min($depths));
	$maxDepth = floatval(max($depths));
	echo $minDepth, $maxDepth
	
?>
<html>
	<head>
		<title>Pollen Plot</title>
		<meta author='Scott Farley' />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css">
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
		<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
		<style>
			.attributes{
				font-family: "Courier New", Courier, monospace;
				padding-left: 2%;
			}
			#plot{padding-left:2%
			}
			.axis path,
		.axis line {
		    fill: none;
		    stroke: black;
		    shape-rendering: crispEdges;
		}
		
		.axis text {
		    font-family: sans-serif;
		    font-size: 11px;
		}
				</style>
	</head>
	<body>
		<h1 class='page-header'>You've successfully requested a pollen diagram!</h1>
		<div id='plot'>
		</div>
		
		<h5>Here is a summary of the attributes that were recorded:</h5>
		<div class='attributes'>
		<p>Datafile: <?php echo $datafilename?></p>
		<p>Width: <?php echo $plotwidth?></p>
		<p>Height: <?php echo $plotheight?></p>
		<p>Level Factoring: <?php echo $factor_levels?></p>
		<p>----Begin Normalization Return----</p>
		<p> Subtotals:</p>
		<p>LOI File: <?php echo $loifilename?></p>
		<p><?php 
			foreach($subtotals as $key=>$kvalue){
				echo '<b> Subtotal: ' . $key . '</b>';
				foreach($kvalue as $subkey=>$value){
					echo '<p>' .$subkey . ' || ' . $value . '</p>';
				}
			}?></p>
		<p>----END NORMALIZATION RETURN----</p>
		<p>----Begin Curve Attribute Return----</p>
		<p><?php 
			foreach($curve_attributes as $key=>$kvalue){
				echo '<b>Taxon: ' . $key . '</b>';
				foreach($kvalue as $subkey=>$value){
					echo '<p>' .$subkey . ' || ' . $value . '</p>';
				}
			}?></p>
		<p>----END CURVE ATTRIBUTE RETURN----</p>
		</div>
		<script>
		console.log(<?php $plotwidth?>)
			plot = d3.select('#plot').append('svg')
				.attr('height', <?php echo $plotheight ?>)
				.attr('width', <?php echo $plotwidth?>)
			plot.append('line')
				.attr('x1', 0)
				.attr('x2', <?php echo $plotwidth?>)	
				.attr('y1', 0)
				.attr('y2', <?php echo $plotheight?>)
				.attr('stroke', 'red')
			plot.append('line')
				.attr('x1', <?php echo $plotwidth?>)
				.attr('x2', 0)
				.attr('y1', 0)
				.attr('y2', <?php echo $plotheight?>)
				.attr('stroke', 'red')
			//var maxDepth = <?php $maxDepth?>;
			//var minDepth = <?php $minDepth?>;
			//console.log(maxDepth, minDepth)
			depthScale = d3.scale.linear()
				.domain([<?php echo $minDepth?> ,<?php $maxDepth?>])
				.range([150, <?php echo $plotheight?>]) //150 point margin
			console.log(depthScale)
			depthAxis = d3.svg.axis()
				.scale(depthScale)
				.orient('left')
				.ticks(20)
			depth = plot.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(50,0)')
				.call(depthAxis)
						
			
			
		</script>
	</body>
</html>