<cfoutput>

<!doctype html>
<html class="no-js" lang="en"> 
	<head>
	  	<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

		<title>Code Development Test</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/app/assets/css/style.css?v=2">
		<link rel="stylesheet" href="/app/assets/css/jquery.modal.css">

		<script type="text/javascript" src="/app/assets/js/jquery-1.11.1.min.js"></script>
		<script type="text/javascript" src="/app/assets/js/jquery.modal.js"></script>
	</head>

	<body>

	  	<div id="container">

	  		<cfinclude template="/app/partials/header.cfm">
	    
	  		#body#

		    <cfinclude template="/app/partials/footer.cfm">
	  	</div> <!-- eo ##container -->

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

	</body>
</html>

</cfoutput>


<id>7124</id>
		<title>My Great Template</title>
		<description>This is a template suited for a professional business site. Original layered Photoshop .psd is included.</description>
		<cost>$45</cost>
		<thumbnail>7124-m.jpg</thumbnail>
		<large>7124-b.jpg</large>