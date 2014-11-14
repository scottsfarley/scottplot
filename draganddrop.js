function handleFiles(file){
	console.log(files)
}
$('#draganddrop').on('dragenter', function(e){
	console.log('drag')
	e.stopPropagation();
	e.preventDefault();
});
$('#draganddrop').on('dragover', function(){
	console.log('dragover')
	e.stopPropagation();
	e.preventDefault();
});
$('#draganddrop').on('drop', function(){
	console.log('drop!')
	e.preventDefault()
	var files = e.originalEvent.dataTransfer.files;
	handleFiles(files);
})

/**
 * @author Scott Farley
 */
