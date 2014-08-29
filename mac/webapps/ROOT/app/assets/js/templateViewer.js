var templateViewer = {

	/*
	* App settings
	*/
	settings: {
		numberImagesToDisplay : 4,
		largeImageFolder : "/app/assets/img/large",
		thumbImageFolder : "/app/assets/img/thumbnails",
		imageMargin : 8,
		scrollSpeed : 500
	},

	/*
	* Makeshift constructor for templateViewer module
	*/
	init: function(){
		this.cacheElements();
		this.bindUIElements();
		//disable right arrow if total thumbs <= 4
		if(this.$thumbnails.length <= 4){
			templateViewer.$nextLink.addClass("disabled");
		}
	},

	/*
	* Cache elements on page for better performance
	*/
	cacheElements: function(){

		this.$thumbnails = $(".thumbnails .group a");
		this.$mainImage = $("#mainImage");
		this.$thumbnailGroup = $(".thumbnails .group");
		this.$previousLink = $(".previous");
		this.$nextLink = $(".next");
		this.$currentDisplay = 1;
		this.$deleteLink = $(".delete");
		this.$editLink = $("#edit");
		this.$addLink = $("#add");
		this.$mainImageTitle = $("#large-title");
		this.$mainImageDescription = $("#large-description");
		this.$mainImageCost = $("#large-cost");
		this.$mainImageId = $("#large-id");
		this.$mainImageThumb = $("#large-thumb");
		this.$mainImageSrc = $("#large-image");
		this.$messageResult = $("#messageResult");
		this.$templateModal = $("#templateModal");
		this.$modalId = $("#modalId");
		this.$modalTitle = $("#modalTitle");
		this.$modalDescription = $("#modalDescription");
		this.$modalCost = $("#modalCost");
		this.$modalImage = $("#modalImage");
		this.$modalFileUpload = $("#templateFile");
		this.$modalFiles = "";
		this.$templateForm = $("#templateForm");
		this.$modalType = $("#modalType");
		this.$modalIdGroup = $("#idGroup");
		this.$placeHolder = $("#placeHolderImage");
		this.$placeHolderAdd = $("#addTemplate");
		this.$cloneItem = $("#cloneFileItem a");

	},

	/*
	* Bind elements for use 
	*/
	bindUIElements: function(){

		$(document).on("click", ".thumbnails .group a", this.setMainImage);
		this.$previousLink.on("click", this.scrollLeft);
		this.$nextLink.on("click", this.scrollRight);
		this.$deleteLink.on("click", this.deleteTemplate);
		this.$editLink.on("click", this.editTemplate);
		this.$addLink.on("click", this.addTemplate);
		this.$templateForm.on("submit", this.uploadFiles);
		this.$placeHolderAdd.on("click", this.addTemplate);

	},

	/*
	* Triggers the modal and clears the form for new template
	*/
	addTemplate: function(){
		templateViewer.$modalId.val("");
		templateViewer.$modalIdGroup.show();
		templateViewer.$modalTitle.val("");
		templateViewer.$modalDescription.val("");
		templateViewer.$modalCost.val("");
		templateViewer.$modalImage.html("");
		templateViewer.$templateModal.find("h1").text("Add Template");
		templateViewer.$modalType.val("add");
		templateViewer.$templateModal.modal();
		templateViewer.clearFileinput();
	},

	/*
	* Click event when delete button is pressed
	*/
	deleteTemplate: function(){
		if(confirm("Are you sure you want to delete this template?")){
			$.get("/index.cfm?action=main.deleteTemplate", {id : templateViewer.$mainImageId.html()}, function(response){
				var objResult = $.parseJSON(response);
				if(objResult.RESULT == "successful"){
					templateViewer.removeTemplate();
				}else{
					templateViewer.displayErrorMessage("There was an error deleting the template");
				}
			});
		}
		return false;
	},

	/*
	* Display error message when template is saved or edited unsuccessfully
	*/
	displayErrorMessage: function(message){
		this.$messageResult.removeClass("success no-display").addClass("error").find("span").html(message);
		setTimeout(function(){
			templateViewer.$messageResult.addClass("no-display");
		}, 3000);
	},

	/*
	* Display successful message when template is saved or edited successfully
	*/
	displaySuccessMessage: function(message){
		this.$messageResult.removeClass("error no-display").addClass("success").find("span").html(message);
		setTimeout(function(){
			templateViewer.$messageResult.addClass("no-display");
		}, 3000);
	},

	/*
	* Triggers the modal and populates the form with appropriate data
	*/
	editTemplate: function(){
		//populate the modal
		templateViewer.$modalId.val(templateViewer.$mainImageId.html());
		templateViewer.$modalIdGroup.hide();
		templateViewer.$modalTitle.val(templateViewer.$mainImageTitle.html());
		templateViewer.$modalDescription.val(templateViewer.$mainImageDescription.html());
		templateViewer.$modalCost.val(templateViewer.$mainImageCost.html());
		templateViewer.$modalImage.html(templateViewer.$mainImageSrc.html());
		templateViewer.$templateModal.find("h1").text("Edit Template");
		templateViewer.$modalType.val("edit");
		templateViewer.clearFileinput();
		templateViewer.$templateModal.modal();
	}, 

	/*
	* Handles view manipulation after a template is edited
	*/
	handleEditTemplateResult: function(objResult){
		if(objResult.RESULT == "success"){
			templateViewer.displaySuccessMessage("Template Successfully Updated");
			var currentLink = $("a[title='"+templateViewer.$mainImageId.html()+"']");
			var index = templateViewer.$thumbnails.index(currentLink);
			templateViewer.$thumbnails.eq(index).trigger("click");
		}else{
			templateViewer.displayErrorMessage("Error Saving Template");
		}
	},

	/*
	* Handles view manipulation after a new template is submitted and created
	*/
	handleNewTemplateResult: function(objResult){
		if(objResult.RESULT == "success"){
			templateViewer.displaySuccessMessage("Template SuccessFully Created");
			//create the filmstrip item from clone, if none then use template
			if(templateViewer.$thumbnails.length > 0){
				var clone = templateViewer.$thumbnails.first().clone();
			}else{
				var clone = templateViewer.$cloneItem.clone();
			}
			clone.attr("title", objResult.ID).removeClass("active");
			clone.find("img").attr("src", templateViewer.settings.thumbImageFolder + "/" + objResult.ID + "-m.jpg?" + templateViewer.timenow()).attr("alt", objResult.ID + "-m");
			clone.find("span").html(objResult.ID);
			console.log(clone);
			$(".thumbnails .group").append(clone);
			//Refresh the cached variable
			templateViewer.$thumbnails = $(".thumbnails .group a");
			//Move to the last item (created)
			templateViewer.moveToLastItem();
			//select and trigger
			templateViewer.$thumbnails.last().trigger("click");	

		}else{
			templateViewer.displayErrorMessage(objResult.MESSAGE);
		}
	},

	/*
	* Moves the filmstrip to last item, triggered when new image is created 
	*/
	moveToLastItem: function(){
		var distance = templateViewer.calculateAnimationLastItem();
		if(distance > 0){
			templateViewer.$thumbnailGroup.animate({"left":-1*distance}, 500, function(){
				templateViewer.$nextLink.addClass("disabled");
				templateViewer.$previousLink.removeClass("disabled");
			});
		}
	},

	/*
	* Remove Template from the view
	*/
	removeTemplate: function(){
		var currentLink = $("a[title='"+templateViewer.$mainImageId.html()+"']");
		var index = templateViewer.$thumbnails.index(currentLink);
		currentLink.remove();
		//refresh the cached element
		templateViewer.$thumbnails = $(".thumbnails .group a");
		if(templateViewer.$thumbnails.length == 0){
			templateViewer.$mainImage.addClass("hide");
			templateViewer.$placeHolder.removeClass("hide");
		}else if(templateViewer.$thumbnails.length < (index + 1)){
			templateViewer.$thumbnails.eq(index - 1).trigger("click");
		}else{
			templateViewer.$thumbnails.eq(index).trigger("click");
		}
		//set the next image
	},

	/*
	* Sets the main image in the main display when thumb click event is triggered
	*/
	setMainImage: function(e){
		var main = $(this);

		//make sure we have thumbnails!
		if(templateViewer.$thumbnails.length > 0){

			templateViewer.$thumbnails.removeClass("active");
			main.addClass("active");
			//make call to template controller to get data
			$.get("/index.cfm?action=main.getTemplate", {id: main.attr("title")}, function(response){
				templateViewer.$placeHolder.addClass("hide");
				templateViewer.$mainImage.removeClass("hide");
				var objResult = $.parseJSON(response);
				templateViewer.$mainImageTitle.html(objResult.TITLE);
				templateViewer.$mainImageDescription.html(objResult.DESCRIPTION);
				templateViewer.$mainImageCost.html(objResult.COST);
				templateViewer.$mainImageId.html(objResult.ID);
				templateViewer.$mainImageThumb.html(objResult.THUMBNAIL);
				templateViewer.$mainImageSrc.html(objResult.LARGE);
				templateViewer.$mainImage.attr("src", templateViewer.settings.largeImageFolder + "/" + main.attr("title") + "-b.jpg?" + templateViewer.timenow() );
				main.find("img").attr("src", templateViewer.settings.thumbImageFolder + "/" + main.attr("title") + "-m.jpg?" + templateViewer.timenow() );
			});
		}else{
			templateViewer.$mainImage.addClass("hide");
			templateViewer.$placeHolder.removeClass("hide");
		}

		
		return false;
	},

	/*
	* Scrolls the filmstrip right when next arrow is clicked
	*/
	scrollRight: function(e){

		e.preventDefault();

		//make sure link is not disabled
		if(!$(this).hasClass("disabled")){
			var distance = templateViewer.calculateAnimationDistance("right");
			var totalImg = templateViewer.$thumbnails.length;
			templateViewer.$thumbnailGroup.animate({"left":distance}, 500, function(){
				templateViewer.$currentDisplay++;
				if(totalImg <= (templateViewer.settings.numberImagesToDisplay * templateViewer.$currentDisplay)){
					templateViewer.$nextLink.addClass("disabled");
				}
				templateViewer.$previousLink.removeClass("disabled");
			});
		}

		return false;

	},

	/*
	* Scrolls the filmstrip left when previous arrow is clicked
	*/
	scrollLeft: function(e){

		e.preventDefault();

		//make sure link is not disabled
		if(!$(this).hasClass("disabled")){
			var distance = templateViewer.calculateAnimationDistance("left");
			templateViewer.$thumbnailGroup.animate({"left":distance}, 500, function(){
				templateViewer.$currentDisplay--;
				if(templateViewer.$currentDisplay == 1){
					templateViewer.$previousLink.addClass("disabled");
				}
				templateViewer.$nextLink.removeClass("disabled");
			});
		}

		return false;

	},

	/*
	* Uploads template file and saves the relevant information, using a nifty iframe trick
	*/
	uploadFiles: function(e){
		//Inspiration from Ben NAdel
		var submitType = (templateViewer.$modalType.val() == "add") ? "addTemplate" : "editTemplate";
		//validate the form
		if(!templateViewer.validateForm()){
			alert("The Id must be a valid integer");
			return false;
		}
		var jThis = $(this);
		var strName = ("uploader" + (new Date()).getTime());
		var jFrame = $( "<iframe name=\"" + strName + "\" src=\"about:blank\" />" );
		jFrame.css( "display", "none" );
		jFrame.load(function (objEvent){
			var objUploadBody = window.frames[ strName ].document.getElementsByTagName( "body" )[ 0 ];
			var jBody = $( objUploadBody );
			
			var objData = $.parseJSON(jBody.text());
			console.log(jBody);
			$.modal.close();

			if(submitType == "addTemplate"){
				templateViewer.handleNewTemplateResult(objData);
			}else{
				templateViewer.handleEditTemplateResult(objData);
			}
			
			setTimeout(function(){
				jFrame.remove();
			}, 100);
		});
        // Attach to body.
        $( "body:first" ).append( jFrame );
 		
        jThis.attr( "action", "/index.cfm?action=main." + submitType ).attr( "method", "post" ).attr( "enctype", "multipart/form-data" ).attr( "encoding", "multipart/form-data" ).attr( "target", strName );          

	},

	/*
	* Validate the template form
	*/
	validateForm: function(){
		//Only validate the Id for now
		var success = true;
		if(isNaN(templateViewer.$modalId.val()) || templateViewer.$modalId.val() == ""){
			success = false;
		}
		return success;
	},

	/*
	* Calculate the amount of distance to scroll to either forward or backward
	*/
	calculateAnimationDistance : function(direction){
		var groupWidth = (this.$thumbnails.outerWidth() + (templateViewer.settings.imageMargin * 2)) * templateViewer.settings.numberImagesToDisplay;
		if(direction == "left"){
			return parseInt(this.$thumbnailGroup.css("left")) + groupWidth;
		}else{
			return parseInt(this.$thumbnailGroup.css("left")) - groupWidth;
		}
	},

	/*
	* Calculates the amount of distance to scroll to get to last film item
	*/
	calculateAnimationLastItem: function(){
		var groupWidth = (templateViewer.$thumbnails.outerWidth() + (templateViewer.settings.imageMargin * 2)) * templateViewer.settings.numberImagesToDisplay;
		var timesToScroll = (templateViewer.$thumbnails.length / templateViewer.settings.numberImagesToDisplay);
		if( timesToScroll > 1){
			if(templateViewer.$thumbnails.length % templateViewer.settings.numberImagesToDisplay == 0){
				templateViewer.$currentDisplay += (timesToScroll - 1);
				return parseInt(templateViewer.$thumbnailGroup.css("left")) + (groupWidth * (timesToScroll - 1));
			}else{
				templateViewer.$currentDisplay += (Math.floor(timesToScroll));
				return parseInt(templateViewer.$thumbnailGroup.css("left")) + (groupWidth * (Math.floor(timesToScroll)));
			}
		}else{
			return 0;
		}
	},

	/*
	* Clears the file input from the dialog box
	*/
	clearFileinput: function(){
        this.$modalFileUpload.replaceWith(this.$modalFileUpload.clone());
	    this.$modalFileUpload = $("#templateFile");
	},

	/*
	* Generates a timestamp for use to combat browser image caching
	*/
	timenow: function(){
		var now = new Date(),
			ampm = "am",
			h = now.getHours(),
			m = now.getMinutes(),
			s = now.getSeconds();
		if(h >= 12){
			if(h > 12) h -= 12;
			ampm = "pm";
		}
		if(m < 10) m = "0" + m;
		if(s < 10) s = "0" + s;
		return now.toLocaleDateString()+ h + m + s + ampm;
	}

};