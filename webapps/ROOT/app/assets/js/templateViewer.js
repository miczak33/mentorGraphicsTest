var templateViewer = {

	settings: {
		numberImagesToDisplay : 4,
		largeImageFolder : "/app/assets/img/large",
		thumbImageFolder : "/app/assets/img/thumbnails",
		imageMargin : 8,
		scrollSpeed : 500
	},

	init: function(){
		this.cacheElements();
		this.bindUIElements();
	},

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

	},

	bindUIElements: function(){

		$(document).on("click", ".thumbnails .group a", this.setMainImage);
		this.$previousLink.on("click", this.scrollLeft);
		this.$nextLink.on("click", this.scrollRight);
		this.$deleteLink.on("click", this.deleteTemplate);
		this.$editLink.on("click", this.editTemplate);
		this.$addLink.on("click", this.addTemplate);
		this.$templateForm.on("submit", this.uploadFiles);

	},

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
	},

	deleteTemplate: function(){
		if(confirm("Are you sure you want to delete this template?")){
			//TODO -- Make call to delete method, and update view.
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

	displayErrorMessage: function(message){
		this.$messageResult.removeClass("success no-display").addClass("error").find("span").html(message);
	},

	displaySuccessMessage: function(message){
		this.$messageResult.removeClass("error no-display").addClass("success").find("span").html(message);
	},

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
		templateViewer.$templateModal.modal();
	},

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

	handleNewTemplateResult: function(objResult){
		if(objResult.RESULT == "success"){
			templateViewer.displaySuccessMessage("Template SuccessFully Created");
			//create the filmstrip item from clone
			var clone = templateViewer.$thumbnails.first().clone();
			clone.attr("title", objResult.ID).removeClass("active");
			clone.find("img").attr("src", templateViewer.settings.thumbImageFolder + "/" + objResult.ID + "-m.jpg?" + templateViewer.timenow()).attr("alt", objResult.ID + "-m");
			clone.find("span").html(objResult.ID);
			$(".thumbnails .group a:last").after(clone);
			//Refresh the cached variable
			templateViewer.$thumbnails = $(".thumbnails .group a");
			//Move to the last item (created)
			templateViewer.moveToLastItem();
			//select and trigger
			templateViewer.$thumbnails.last().trigger("click");	

		}else{
			templateViewer.displayErrorMessage("Error Creating Template");
		}
	},

	moveToLastItem: function(){
		var distance = templateViewer.calculateAnimationLastItem();
		if(distance > 0){
			templateViewer.$thumbnailGroup.animate({"left":-1*distance}, 500, function(){
				templateViewer.$nextLink.addClass("disabled");
				templateViewer.$previousLink.removeClass("disabled");
			});
		}
	},

	prepareUpload: function(e){
		templateViewer.$modalFiles = e.target.files;
	},

	removeTemplate: function(){
		var currentLink = $("a[title='"+templateViewer.$mainImageId.html()+"']");
		var index = templateViewer.$thumbnails.index(currentLink);
		currentLink.remove();
		//refresh the cached element
		templateViewer.$thumbnails = $(".thumbnails .group a");
		if(templateViewer.$thumbnails.length == 0){

		}else if(templateViewer.$thumbnails.length < (index + 1)){
			templateViewer.$thumbnails.eq(index - 1).trigger("click");
		}else{
			templateViewer.$thumbnails.eq(index).trigger("click");
		}
		//set the next image
	},

	setMainImage: function(e){
		var main = $(this);

		templateViewer.$thumbnails.removeClass("active");
		main.addClass("active");
		//make call to template controller to get data
		$.get("/index.cfm?action=main.getTemplate", {id: main.attr("title")}, function(response){
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
		return false;
	},

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

	uploadFiles: function(e){
		//Inspiration from Ben NAdel
		var submitType = (templateViewer.$modalType.val() == "add") ? "addTemplate" : "editTemplate";
		var jThis = $(this);
		var strName = ("uploader" + (new Date()).getTime());
		var jFrame = $( "<iframe name=\"" + strName + "\" src=\"about:blank\" />" );
		jFrame.css( "display", "none" );
		jFrame.load(function (objEvent){
			var objUploadBody = window.frames[ strName ].document.getElementsByTagName( "body" )[ 0 ];
			var jBody = $( objUploadBody );
			var objData = $.parseJSON(eval("(" + jBody.text() + ")" ));
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

	calculateAnimationDistance : function(direction){
		var groupWidth = (this.$thumbnails.outerWidth() + (templateViewer.settings.imageMargin * 2)) * templateViewer.settings.numberImagesToDisplay;
		if(direction == "left"){
			return parseInt(this.$thumbnailGroup.css("left")) + groupWidth;
		}else{
			return parseInt(this.$thumbnailGroup.css("left")) - groupWidth;
		}
	},

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
			return parseInt(templateViewer.$thumbnailGroup.css("left")) + groupWidth;
		}
	},

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