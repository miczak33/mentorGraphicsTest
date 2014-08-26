interface {

	public struct function addTemplate(required any template);
	public any function deleteTemplate(required numeric id);
	public any function editTemplate(required any template);
	public any function getTemplate(required numeric id);
	public array function getTemplates();
	public struct function saveTemplate(required struct template);

}