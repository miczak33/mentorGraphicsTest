component accessors="true" {

	property name="id";
	property name="title";
	property name="cost";
	property name="description";
	property name="thumbnail";
	property name="large";
	property name="largeFilePath";
	property name="thumbnailFilePath";

	public function init(){
		setLargeFilePath("/app/assets/img/large/");
		setThumbnailFilePath("/app/assets/img/thumbnails/");
		return this;
	}

	public function constructLargeImageFilepath(){
		return getLargeFilePath() & getLarge();
	}

	public function constructThumbnailImageFilepath(){
		return getThumbnailFilePath() & getThumbnail();
	}

}
