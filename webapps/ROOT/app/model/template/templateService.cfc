component accessors="true" {

	property name="templateDAO" getter="false";

	public function init(){
		return this;
	}

	public function getAllTemplates(){
		return variables.templateDAO.getTemplates();
	}

	public function getTemplate(required numeric id){
		return variables.templateDAO.getTemplate(arguments.id);
	}

	public function addTemplate(required numeric id, string title="", string description="", string cost="", string templateFile=""){
		//check to see if upload was populated
		if(!len(arguments.templateFile)){
			return {successful = false, errorMsg = "No template was uploaded"};
		}

		//put image
		FileUpload(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"), arguments.templateFile, "image/jpg", "overwrite");
		//now create a thumbnail version of the image 141x121
		var thumbWidth = 141;
		var thumbHeight = 121;
		var savedTemplate = imageRead(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"));
		// imageSetAntialiasing(savedTemplate, "on");
		imageScaleToFit(savedTemplate, thumbWidth, thumbHeight);
		imageWrite(savedTemplate, expandPath("/app/assets/img/thumbnails/#arguments.id#-m.jpg"), true, .95);

		//now populate bean and pass it on
		var objTemplate = new app.model.template.templateBean();		
		objTemplate.setId(arguments.id);
		objTemplate.setTitle(arguments.title);
		objTemplate.setCost(arguments.cost);
		objTemplate.setDescription(arguments.description);
		objTemplate.setThumbnail(arguments.id & "-m.jpg");
		objTemplate.setLarge(arguments.id & "-b.jpg");

		var result = variables.templateDAO.addTemplate(objTemplate);
		//pass result struct back
		if(result.successful){
			result.data.id = arguments.id;
			result.data.title = arguments.title;
			result.data.cost = arguments.cost;
			result.data.description = arguments.description;
		}
		return result;
	}

	public function deleteTemplate(required numeric id){
		return variables.templateDAO.deleteTemplate(arguments.id);
	}

	public function editTemplate(required numeric id, string title="", string description="", string cost="", string templateFile=""){
		//check to see if upload is populated
		if(len(arguments.templateFile)){
			//put the image
			FileUpload(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"), arguments.templateFile, "image/jpg", "overwrite");
			//now create a thumbnail version of the image 141x121
			var thumbWidth = 141;
			var thumbHeight = 121;
			var savedTemplate = imageRead(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"));
			// imageSetAntialiasing(savedTemplate, "on");
			imageScaleToFit(savedTemplate, thumbWidth, thumbHeight);
			imageWrite(savedTemplate, expandPath("/app/assets/img/thumbnails/#arguments.id#-m.jpg"), true, .95);
		}
		//Now populate the bean and pass it to DAO
		var objTemplate = new app.model.template.templateBean();		
		objTemplate.setId(arguments.id);
		objTemplate.setTitle(arguments.title);
		objTemplate.setCost(arguments.cost);
		objTemplate.setDescription(arguments.description);
		objTemplate.setThumbnail(arguments.id & "-m.jpg");
		objTemplate.setLarge(arguments.id & "-b.jpg");

		return variables.templateDAO.editTemplate(objTemplate);
	}

}
