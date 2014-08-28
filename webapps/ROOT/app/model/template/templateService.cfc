/**
*
* @file  templateService.cfc
* @author  MZ
* @description Service for interacting with bean and dao from the controller or other agent (API)
*
*/

component accessors="true" {

	//------------ DEPENDENCY INJECTION ------------//
	property name="templateDAO" getter="false";
	property name="fileService" getter="false";
	property name="imageService" getter="false";

	//-------------- CONSTRUCTOR -------------------//
	public function init(){
		return this;
	}

	//-------------PUBLIC FUNCTIONS ----------------//
	public function addTemplate(required numeric id, string title="", string description="", string cost="", string templateFile=""){
		//check to see if upload was populated
		if(!len(arguments.templateFile)){
			return {successful = false, errorMsg = "No template was uploaded"};
		}

		//put image
		variables.fileService.uploadFile(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"), arguments.templateFile);
		//now create a thumbnail version of the image 141x121
		variables.imageService.createThumbnail(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"), expandPath("/app/assets/img/thumbnails/#arguments.id#-m.jpg"));

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
			//put image
		variables.fileService.uploadFile(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"), arguments.templateFile);
		//now create a thumbnail version of the image 141x121
		variables.imageService.createThumbnail(expandPath("/app/assets/img/large/#arguments.id#-b.jpg"), expandPath("/app/assets/img/thumbnails/#arguments.id#-m.jpg"));
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

	public function getAllTemplates(){
		var allTemplates = [];
		//get all the templates for app
		allTemplates = variables.templateDAO.getTemplates();
		//if there are no templates, append blank bean to array
		if(!arrayLen(allTemplates)){
			arrayAppend(allTemplates, new app.model.template.templateBean());
		}
		return allTemplates;
	}

	public function getTemplate(required numeric id){
		return variables.templateDAO.getTemplate(arguments.id);
	}

}
