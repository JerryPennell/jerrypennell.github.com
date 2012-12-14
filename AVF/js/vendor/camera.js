var desiredWidth;
function goBack()
    {
      window.history.back();
    }
	function picFail(e) {
		navigator.notification.alert("Sorry, we failed...");
	}

	function getSwatches(){
		var colorArr = createPalette($("#yourimage"), 5);
		for (var i = 0; i < Math.min(5, colorArr.length); i++) {
			$("#swatch"+i).css("background-color","rgb("+colorArr[i][0]+","+colorArr[i][1]+","+colorArr[i][2]+")");
			console.log($("#swatch"+i).css("background-color"));
		}
	}	

	function picSuccess(imageURI) {
		console.log(imageURI);
		$("#yourimage").attr("src",imageURI);
		console.log("Done...");
	}
	
	function takePic(e){
		navigator.camera.getPicture(picSuccess, picFail, {quality:75, targetWidth:desiredWidth, targetHeight:desiredWidth, sourceType:Camera.PictureSourceType.CAMERA, destinationType:Camera.DestinationType.FILE_URI});
	}

	function selectPic(e) {
		navigator.camera.getPicture(picSuccess, picFail, {quality:75, targetWidth:desiredWidth, targetHeight:desiredWidth, sourceType:Camera.PictureSourceType.PHOTOLIBRARY, destinationType:Camera.DestinationType.FILE_URI});
	}
	
	
	function onDeviceReady() {
		$("#takePictureBtn").click(takePic);
		$("#picPictureBtn").click(selectPic);
		$("#yourimage").load(getSwatches);
		desiredWidth = window.innerWidth;
		
	};
	
	function init() {
		document.addEventListener("deviceready", onDeviceReady, true);
	}   