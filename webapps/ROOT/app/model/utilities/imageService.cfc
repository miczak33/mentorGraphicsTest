/**
*
* @file  imageService.cfc
* @author  MZ
* @description Image service for manipulation and saving
*
*/

component output="false" accessors="true"  {

	//-------------- CONSTRUCTOR ------------//
	public function init(){
		return this;
	}

	//----------- PUBLIC METHODS ------------//
	public function createThumbnail(required string thumbSource, required string thumbDestination, numeric width=141, numeric height=121){
		var thumbWidth = arguments.width;
		var thumbHeight = arguments.height;
		var template = readImage(arguments.thumbSource);
		imageScaleToFit(template, thumbWidth, thumbHeight);
		saveImage(template, arguments.thumbDestination);
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

	public function saveImage(required any image, required string imagePath, boolean overwrite=true, numeric quality=.95){
		var result = "success";
		try{
			imageWrite(arguments.image, arguments.imagePath, arguments.overwrite, arguments.quality);
		}catch(any e){
			//TODO: Log and report error
			throw "An error occurred while trying to save image - #e.message#";
		}
		return result;
	}
		
}