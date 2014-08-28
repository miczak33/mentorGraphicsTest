component accessors="true" {
	
	public function init(fw){
		variables.fw = arguments.fw;
		return this;
	}

	public function renderJSONAsHTML(required struct output){
		var fileContent = toBinary(toBase64(serializeJSON(arguments.output)));
		var context = getPageContext();
       
        try{
        	//Try Coldfusion server version first
        	var response = context.getResponse().getResponse();
        } catch(any e){
        	//Must be Railo
        	var response = context.getResponse();
        }
        response.reset();
        response.setContentType("text/html");   
        response.setContentLength(len(fileContent));       
       
        var out = response.getOutputStream();     
        out.write(ToBinary(ToBase64(fileContent)));       
        out.flush();       
        out.close();
	}

	
}