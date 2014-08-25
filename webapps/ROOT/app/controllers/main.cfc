component accessors="true" {

	property name="templateService" getter="false";

	public function init(fw){
		variables.fw = arguments.fw;
		return this;
	}

	public function index(rc){
		rc.templates = variables.templateService.getAllTemplates();
	}

	public function getTemplate(rc){
		var template = variables.templateService.getTemplate(rc.id);
		var templateData = {
			id = template.getId(),
			title = template.getTitle(),
			description = template.getDescription(),
			thumbnail = template.getThumbnail(),
			large = template.getLarge(),
			largeFilePath = template.getLargeFilePath(),
			thumbnailFilePath = template.getThumbnailFilePath()
		};
		variables.fw.renderData("JSON", serializeJSON(templateData));	
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
			}
		}
		variables.fw.renderData("JSON", serializeJSON(jsonOutput));
	}

}