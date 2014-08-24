<cfoutput>

<!doctype html>
<html class="no-js" lang="en"> 
	<head>
	  	<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

		<title>Code Development Test</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/app/assets/css/style.css?v=2">

		<script type="text/javascript" src="/app/assets/js/jquery-1.11.1.min.js"></script>

	</head>

	<body>

	  	<div id="container">

	  		<cfinclude template="/app/partials/header.cfm">
	    
	  		#body#

		    <cfinclude template="/app/partials/footer.cfm">
	  	</div> <!-- eo ##container -->

	</body>
</html>

</cfoutput>
