component extends="lib.framework" {

	this.name = "mentor-graphics-testapp";
	this.sessionManagement = true;
	this.sessiontimeout = createTimeSpan(0,2,0,0);

	this.mappings["/app/model"] = getDirectoryFromPath(getCurrentTemplatePath()) & "app/model";

	//setup FW1 vars
	variables.framework = {
		reloadApplicationOnEveryRequest = true,
		home="main.index",
		base="/app"
	};

	function setupApplication(){

		//setup bean factory using DI/1 --> Corfield's dependency injection model
		var beanfactory = new lib.ioc("/app/model", {singletonPattern="(Service|DAO)$"});
		setBeanFactory(beanfactory);
		
	}

	public function setupRequest(){
		request.context.startTime = getTickCount();
	}

}


