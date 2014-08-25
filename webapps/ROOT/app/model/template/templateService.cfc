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

	public function deleteTemplate(required numeric id){
		return variables.templateDAO.deleteTemplate(arguments.id);
	}

}