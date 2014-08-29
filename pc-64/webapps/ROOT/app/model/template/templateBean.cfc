/**
*
* @file  templateBean.cfc
* @author  MZ
* @description Template bean that is utilized by template service and dao
*
*/

component accessors="true" {

	//------------ BEAN PROPERTIES -------------//
	property name="id";
	property name="title";
	property name="cost";
	property name="description";
	property name="thumbnail";
	property name="large";
	property name="largeFilePath";
	property name="thumbnailFilePath";

	//------------- CONSTRUCTOR ----------------//
	public function init(){
		setLargeFilePath("/app/assets/img/large/");
		setThumbnailFilePath("/app/assets/img/thumbnails/");
		return this;
	}

	//------------- PUBLIC METHODS -------------//
	public function constructLargeImageFilepath(){
		return getLargeFilePath() & getLarge();
	}

	public function constructThumbnailImageFilepath(){
		return getThumbnailFilePath() & getThumbnail();
	}

}
