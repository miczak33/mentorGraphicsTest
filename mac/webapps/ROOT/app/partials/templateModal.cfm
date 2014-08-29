<div id="templateModal" class="modal">
     <h1>Add Template</h1>

     <div class="templateInputGroup">
     	<form name="templateForm" id="templateForm" enctype="multipart/form-data">
     	 <input type="hidden" id="modalType" name="modalType" value="add">
     	 <div id="idGroup">
     	 Id:<br/>
	     <input type="text" id="modalId" name="modalId"><br/>
	     </div>
	     Title:<br/>
	     <input type="text" id="modalTitle" name="modalTitle"><br/>
	     Description:<br/>
	     <input type="text" id="modalDescription" name="modalDescription"><br/>
	     Cost:<br/>
	     <input type="text" id="modalCost" name="modalCost"><br/>
	     Current Template: <span id="modalImage"></span><br/>
	     <input type="file" name="templateFile" id="templateFile"><br/><br/>
	     <input type="submit" name="submit" value="Submit" id="submit">
	     </form>
     </div>
</div>