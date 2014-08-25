component accessors="true" implements="ITemplateDAO" {

	property name="filePath";
	property name="fileName";

	public function init(string xmlPath="#expandPath('/app/model/persistence/xml/')#") {
		setFilePath(arguments.xmlPath);
		setFileName("template.xml");
		return this;
	}

	public any function deleteTemplate(required numeric id){
		var result = {successful = true};
		try{
			//Load the file
			var objFile = fileRead(constructFilePath());
			//Parse the file
			var xmlTemplates = xmlParse(objFile);
			//Search for the Id using xpath
			var selectedElement = xmlSearch(xmlTemplates, "//*[text()='#arguments.id#']/..");
			//Now delete the node
			deleteNodes(xmlTemplates, selectedElement);
			//save the file
			fileWrite(constructFilePath(), "#toString(xmlTemplates)#");

		} catch (any e){
			result.successful = false;
			result.errorMsg = e.detail;
		}

		return result;
	}

	public any function getTemplate(required numeric id){
		//Load the file
		var objFile = fileRead(constructFilePath());
		//Parse the file
		var xmlTemplates = xmlParse(objFile);
		//Search for the Id using xpath
		var selectedElement = xmlSearch(xmlTemplates, "//*[text()='#arguments.id#']/..");
		//Populate template bean
		var objTemplate = new app.model.template.templateBean();
		objTemplate.setId(selectedElement[1].xmlChildren[1].xmlText);
		objTemplate.setTitle(selectedElement[1].xmlChildren[2].xmlText);
		objTemplate.setDescription(selectedElement[1].xmlChildren[3].xmlText);
		objTemplate.setCost(selectedElement[1].xmlChildren[4].xmlText);
		objTemplate.setThumbnail(selectedElement[1].xmlChildren[5].xmlText);
		objTemplate.setLarge(selectedElement[1].xmlChildren[6].xmlText);
		return objTemplate;
	}

	public array function getTemplates(){

		var arrTemplates = [];
		//Load the file
		var objFile = fileRead(constructFilePath());
		//Parse the file
		var xmlTemplates = xmlParse(objFile);
		//search the file for all templates
		var selectedElements = XmlSearch(xmlTemplates, "/templates/template");
		//loop through and map object
		for(var template in selectedElements){
			var objTemplate = new app.model.template.templateBean();
			objTemplate.setId(template.xmlChildren[1].xmlText);
			objTemplate.setTitle(template.xmlChildren[2].xmlText);
			objTemplate.setDescription(template.xmlChildren[3].xmlText);
			objTemplate.setCost(template.xmlChildren[4].xmlText);
			objTemplate.setThumbnail(template.xmlChildren[5].xmlText);
			objTemplate.setLarge(template.xmlChildren[6].xmlText);

			arrayAppend(arrTemplates, objTemplate);
		}

		return arrTemplates;

	}

	public struct function saveTemplate(required struct template){

	}

	private function constructFilePath(){
		return getFilePath() & getFileName();
	}

	/**
	* @hint "deletes nodes from xml doc -- translated into cfscript from ben nadel's tage based solution"
	*/
	private function deleteNodes(required any xmlDoc, any nodes){
		var node = "";
		if(!isArray(arguments.nodes)){
			var node = arguments.nodes;
			arguments.nodes = [node];
		}
		for(var i=arrayLen(arguments.nodes); i >= 1; i--){
			node = arguments.nodes[i];
			if(structKeyExists(node, "XmlChildren")){
				node.xmlAttributes["delete-me-flag"] = "true";
			} else {
				arrayDeleteAt(arguments.Nodes, i);
			}
		}
		for(var theNode in arguments.nodes){
			var parentNodes = xmlSearch(theNode, "../");
			if(arrayLen(parentNodes) && structKeyExists(parentNodes[1], "xmlChildren")){
				var parentNode = parentNodes[1];
				for(var i = arrayLen(parentNode.xmlChildren); i >= 1; i--){
					theNode = parentNode.xmlChildren[i];
					if(structKeyExists(theNode.xmlAttributes, "delete-me-flag")){
						arrayDeleteAt(parentNode.xmlChildren, i);
						structDelete(theNode.xmlAttributes, "delete-me-flag");
					}
				}
			}
		}
	}

}