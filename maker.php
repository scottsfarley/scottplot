<?php
	if($_POST['plotwidth'] != 0){
		$plotwidth = $_POST['plotwidth'];
	}else{
		$plotwidth = 'Auto';
	}
	if($_POST['plotheight'] != 0){
		$plotheight = $_POST['plotheight'];
	}else{
		$plotheight = 'Auto';
	}
	if($_POST['factor_levels'] != 0){
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
	$datafile = $_POST['file'];
	$loifile = $_POST['loifile'];
	$subtotals =(string) $_POST['subtotals'];
	$subtotals = (array)json_decode($subtotals, TRUE);
	
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
		</style>
	</head>
	<body>
		<h1 class='page-header'>You've successfully requested a pollen diagram!</h1>
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
	</body>
</html>