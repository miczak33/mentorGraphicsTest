/**
*
* @file  /Users/miczak33/Desktop/mentorgraphics/mentorGraphicsTest/webapps/ROOT/app/utilities/imageService.cfc
* @author  
* @description
*
*/

component output="false" accessors="true"  {

	public function init(){
		return this;
	}

	public function createThumbnail(required string thumbSource, required string thumbDestination, numeric width=141, numeric height=121){
		var thumbWidth = arguments.width;
		var thumbHeight = arguments.height;
		var template = readImage(arguments.thumbSource);
		imageScaleToFit(template, thumbWidth, thumbHeight);
		saveImage(template, arguments.thumbDestination);
	}

	public function saveImage(required any image, required string imagePath, boolean overwrite=true, numeric quality=.95){
		var result = "success";
		try{
			imageWrite(savedTemplate, expandPath("/app/assets/img/thumbnails/#arguments.id#-m.jpg"), true, .95);
		}catch(any e){
			//TODO: Log and report error
			throw "An error occurred while trying to save image";
		}
		return result;
	}

	public any function readImage(required string imagePath){
		var imageResult="";
		try{
			imageResult = imageRead(arguments.imagePath);
		}catch(any e){
			//TODO: Log and report error
			throw "An error occurred while trying to read image";
		}
		return imageResult;
		
	}
		
}