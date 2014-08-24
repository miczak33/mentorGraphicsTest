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

	},

	bindUIElements: function(){

		this.$thumbnails.on("click", this.setMainImage);
		this.$previousLink.on("click", this.scrollLeft);
		this.$nextLink.on("click", this.scrollRight);

	},

	setMainImage: function(e){
		templateViewer.$thumbnails.removeClass("active");
		$(this).addClass("active");
		templateViewer.$mainImage.attr("src", templateViewer.settings.largeImageFolder + "/" + $(this).attr("title") + "-b.jpg");
		return false;
	},

	scrollRight: function(e){

		e.preventDefault();

		//make sure link is not disabled
		if(!$(this).hasClass("disabled")){
			var distance = templateViewer.calculateAnimationDistance("right");
			var totalImg = templateViewer.$thumbnailGroup.length;
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