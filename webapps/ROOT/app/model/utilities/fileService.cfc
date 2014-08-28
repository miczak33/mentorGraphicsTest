component accessors="true" {

	public function init(){
		return this;
	}

	public function uploadFile(required string filePath, required any template, string accept="image/jpg", string duplicate="overwrite"){
		try{
			FileUpload(arguments.filePath, arguments.template, arguments.accept, arguments.duplicate);
		}catch(any e){
			//Log and notify error
			throw "An error occurred while uploading file";
		}
		
	}

}