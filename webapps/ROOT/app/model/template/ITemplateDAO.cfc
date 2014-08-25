interface {

	public any function deleteTemplate(required numeric id);
	public any function getTemplate(required numeric id);
	public array function getTemplates();
	public struct function saveTemplate(required struct template);

}