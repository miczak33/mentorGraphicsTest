/**
*
* @file  Main.cfc
* @author  MZ
* @description Main Controller for application
*
*/

component accessors="true" extends="controller" {

	//------------- DEPENDENCY INJECTION ----------//
	property name="templateService" getter="false";

	//------------- CONSTRUCTOR -------------------//
	public function index(rc){
		rc.templates = variables.templateService.getAllTemplates();
	}

	//------------- PUBLIC METHODS ----------------//
	public function addTemplate(rc){
		var jsonOutput = "";
		var response = variables.templateService.addTemplate(rc.modalId, rc.modalTitle, rc.modalDescription, rc.modalCost, rc.templateFile);
		if(response.successful){
			jsonOutput = {
				result = "success",
				id = response.data.id,
				title = response.data.title,
				description = response.data.description,
				cost = response.data.cost
			};
		}else{
			jsonOutput = {
				result = "error",
				message = response.errorMsg
			};
		}
		renderJSONAsHTML(jsonOutput);
	}

	public function deleteTemplate(rc){
		var jsonOutput = "";
		var response = variables.templateService.deleteTemplate(rc.id);
		if(response.successful){
			jsonOutput = {result = "successful"};
		}else{
			jsonOutput = {
				result = "error",
				message = response.errorMsg 
			};
		}
		variables.fw.renderData("JSON", serializeJSON(jsonOutput));
	}

	public function editTemplate(rc){
		var jsonOutput = {};
		var response = variables.templateService.editTemplate(rc.modalId, rc.modalTitle, rc.modalDescription, rc.modalCost, rc.templateFile);
		if(response.successful){
			var jsonOUtput = { result = "success" };
		}else{
			jsonOutput = {
				result = "error",
				message = response.errorMsg
			}
		}
		renderJSONAsHTML(jsonOutput);
	}

	public function getTemplate(rc){
		var template = variables.templateService.getTemplate(rc.id);
		var templateData = {
			id = template.getId(),
			title = template.getTitle(),
			description = template.getDescription(),
			cost = template.getCost(),
			thumbnail = template.getThumbnail(),
			large = template.getLarge(),
			largeFilePath = template.getLargeFilePath(),
			thumbnailFilePath = template.getThumbnailFilePath()
		};
		variables.fw.renderData("JSON", serializeJSON(templateData));	
	}

	public function testTemplate(rc){
		var template = variables.templateService.templateExists(7111);
		writeDump(template);
		abort;
	}

}