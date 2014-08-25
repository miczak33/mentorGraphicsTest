var templateViewer = {

	settings: {
		numberImagesToDisplay : 4,
		largeImageFolder : "/app/assets/img/large",
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
		this.$mainImageTitle = $("#large-title");
		this.$mainImageDescription = $("#large-description");
		this.$mainImageCost = $("#large-cost");
		this.$mainImageId = $("#large-id");
		this.$mainImageThumb = $("#large-thumb");
		this.$mainImageSrc = $("#large-image");
		this.$messageResult = $("#messageResult");

	},

	bindUIElements: function(){

		this.$thumbnails.on("click", this.setMainImage);
		this.$previousLink.on("click", this.scrollLeft);
		this.$nextLink.on("click", this.scrollRight);
		this.$deleteLink.on("click", this.deleteTemplate);

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

	displaySuccessMessage: function(){
		this.$messageResult.removeClass("error no-display").addClass("success").find("span").html(message);
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
			templateViewer.$mainImage.attr("src", templateViewer.settings.largeImageFolder + "/" + main.attr("title") + "-b.jpg");
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

	calculateAnimationDistance : function(direction){
		var groupWidth = (this.$thumbnails.outerWidth() + (templateViewer.settings.imageMargin * 2)) * templateViewer.settings.numberImagesToDisplay;
		if(direction == "left"){
			return parseInt(this.$thumbnailGroup.css("left")) + groupWidth;
		}else{
			return parseInt(this.$thumbnailGroup.css("left")) - groupWidth;
		}
	}
};