<cfoutput>

<div id="main" role="main">
	<div id="large">
		<div id="messageResult" class="success no-display">
			<span>Template Successfully Deleted</span>
		</div>
		<div class="group">
				<img id="mainImage" <cfif not len(rc.templates[1].getId())>class="hide"</cfif> src="#rc.templates[1].constructLargeImageFilepath()#" alt="Large Image" width="430" height="360" />
				<div id="placeHolderImage" <cfif len(rc.templates[1].getId())>class="hide"</cfif> style="width:430px; height:360px;background-color:##ddd; float:left;">
					<div><center><a href="##" class="crudButtons addTemplate" id="addTemplate">Add Template</a></center></div>
				</div>
			
			<div class="details">
				<p><strong>Title</strong> <span id="large-title">#rc.templates[1].getTitle()#</span></p>
				<p><strong>Description</strong> <span id="large-description">#rc.templates[1].getDescription()#</span></p>
				<p><strong>Cost</strong> <span id="large-cost">#rc.templates[1].getCost()#</span></p>
				<p><strong>ID ##</strong> <span id="large-id">#rc.templates[1].getId()#</span></p>
				<p><strong>Thumbnail File</strong> <span id="large-thumb">#rc.templates[1].getThumbnail()#</span></p>
				<p><strong>Large Image File</strong> <span id="large-image">#rc.templates[1].getLarge()#</span></p>
			</div>
			<div class="crudGroup"><a href="##" class="crudButtons delete">Delete</a><a href="##" class="crudButtons" id="edit">Edit</a><a href="##" class="crudButtons" id="add">Add</a></div>
		</div>
	</div>
	<div class="thumbnail-outer">
		<div class="thumbnails">
			<div class="group">
				<cfset templateCount = 1>
				<cfloop array="#rc.templates#" index="template">
					<cfif len(template.getId())>
						<a href="##" title="#template.getId()#" <cfif templateCount eq 1>class="active"</cfif>>
							<img src="#template.constructThumbnailImageFilepath()#" alt="#template.getId()#-m" width="145" height="121" />
							<span>#template.getId()#</span>
						</a>
						<cfset templateCount++>
					</cfif>
				</cfloop>
				
			</div>
			
		</div>
		<a href="##" class="previous disabled" title="Previous">Previous</a>
		<a href="##" class="next" title="Next">Next</a>
	</div>
</div>

<div id="cloneFileItem" style="display:none;">
	<a href="##" title="0">
		<img src="" alt="0" width="145" height="121" />
		<span>0</span>
	</a>
</div>

</cfoutput>

<script type="text/javascript" src="/app/assets/js/templateViewer.js"></script>
<script>

	$(function(){
		templateViewer.init();
	});

</script>