component {

	public function init(fw){
		variables.fw = arguments.fw;
		return this;
	}

	public function index(rc){
		rc.when = now();
	}

}
