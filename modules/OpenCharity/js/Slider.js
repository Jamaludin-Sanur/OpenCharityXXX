
/**
* Slider class implementation
*/
var Slider = function()
{
	var self = this;

	// DOM element which become this slider.
	var source = null;
	
	// DOM element containing the viewport. 
	var frame; 
	
	// DOM element containing slider content
	var viewport;
	
	// Current displayed page
	var currentPage;
	
	// slider style (horizontal or vertical)
	var sliderStyle = 'horizontal';
	
	// the original slider style 
	// (its cached since this slider style may change to respond the device orientation)
	var sliderStyleCache;
	
	// Max content displayed in viewport
	var maxContent = 3;
	
	// DOM element for next/prev navigation 
	var btnPrev;
	var btnNext;
	
	// DOM element for navigation between pages 
	var sliderPageButtons = [];
	
	// Frame per second for animation
	var fps = 30;
	
	// Animation flag
	var isAnimating = false;
	
// =================
//#region private function 
// =================
	
	// Create navigation page buttons based on viewport children
	function createNavigationPage()
	{
		
		// determine the number of pages
		var totalPage = Math.ceil(viewport.children.length / maxContent);
		
		// create page button container
		var navigation = document.createElement("NAV");	
		navigation.className = "slider__navigation center";
		
		// create page button
		for(var i=0; i<totalPage; i++){
			var btn = document.createElement("BUTTON");

			btn.className = (i==0)? "slider__page_btn--selected" :"slider__page_btn";

			btn.onclick = (function(func, i){
				 return function(){
					func(i);
				 };
			})( self.setPage, i);			
			sliderPageButtons.push(btn);
			navigation.appendChild(btn);
		}
		currentPage = 0;
		
		// add buttons container to slider
		source.appendChild(navigation);
		
	}
	
	// Create prev/next button
	function createNavigationButton(){
		
		if(!btnPrev){
			btnPrev = document.createElement("IMG");	
			source.insertBefore(btnPrev, frame);
			btnPrev.onclick = self.prevPage;
		} 
		if(!btnNext){
			btnNext = document.createElement("IMG");
			source.appendChild(btnNext);			
			btnNext.onclick = self.nextPage;
		}
		
		if(sliderStyle == "horizontal"){
			btnPrev.src = 'sites/all/modules/OpenCharity/images/slider_btn_prev';
			btnNext.src = 'sites/all/modules/OpenCharity/images/slider_btn_next';
			btnPrev.className = "slider__button--horizontal left";
			btnNext.className = "slider__button--horizontal right";	
		}
		else if(sliderStyle == "vertical"){
			btnPrev.src = 'sites/all/modules/OpenCharity/images/slider_btn_top';
			btnNext.src = 'sites/all/modules/OpenCharity/images/slider_btn_bottom';
			btnPrev.className = "slider__button--vertical";
			btnNext.className = "slider__button--vertical";				
		}
	}
	
	// Set slider vertical style
	function setVerticalStyle(){
		
		sliderStyle = "vertical";
		
		// reset the frame
		frame.style.height = "auto";
		
		// reset the viewport
		viewport.style.marginTop = "0px";
		viewport.style.marginLeft = "0px";
		viewport.style.height = "auto";
		viewport.style.whiteSpace = "normal";
		viewport.style.width = "100%";
		
		// reset the height of the content
		for(let i=0; i<viewport.children.length; i++){
			let child = viewport.childNodes[i];
			child.style.height = "auto";
			child.style.width = "100%";
			child.className = "slider__item--vertical";
		}
		
		// find the highest content height 
		var highestHeight = 0;
		var contentHeights = 0;		
		var limit = maxContent;
		for(let i=0; i<viewport.children.length; i++){
			
			let child = viewport.childNodes[i];
			contentHeights += Math.ceil( parseFloat(getComputedStyle(child).height, 10) );
			limit--;

			if(limit<=0){
				highestHeight = (contentHeights > highestHeight) ? contentHeights : highestHeight;
				contentHeights = 0;
				limit = maxContent;
			}
		};
		
		// Add frame margin to highest height
		highestHeight += (parseFloat(getComputedStyle(frame).marginTop));
		highestHeight += (parseFloat(getComputedStyle(frame).marginBottom));
		
		// Set contents height based on the highest page
 		for(let i=0; i<viewport.children.length; i++){
			let child = viewport.childNodes[i];
			child.style.height = (highestHeight/maxContent)+"px";
		}
		// Set fram height
		frame.style.height = highestHeight+"px";
		

		// create slide button
		if(viewport.children.length > maxContent)
			createNavigationButton();
		
	}
	
	// Set slider horizontal style
	function setHorizontalStyle(){
		
		sliderStyle = "horizontal";
		
		// reset the frame
		frame.style.height = "auto";
		
		// reset slider content
		viewport.style.marginTop = "0px";
		viewport.style.marginLeft = "0px";
		viewport.style.height = "auto";
		viewport.style.width = "100%";
		viewport.style.whiteSpace = "nowrap";
		
		// calculate article width
		var frameWidth = parseFloat(getComputedStyle(frame).width);
		var articleWidth = frameWidth / maxContent;
		
		// set article width
		for(var i=0; i<viewport.children.length; i++){
			var child = viewport.childNodes[i];
			child.className = "slider__item--horizontal";
			child.style.cssText = "width:"+articleWidth+"px;";
		}

		// create slide button
		if(viewport.children.length > maxContent)
			createNavigationButton();
		
		
	}

	// move viewport periodicly based on given value
	function moveMarginHorizontal(targetPos, step, fps){
		
		var currentPos = parseFloat(getComputedStyle(viewport).marginLeft);
		if(targetPos < 0){
			if(targetPos+step >= 0){
				viewport.style.marginLeft = (currentPos+step)+"px";
				isAnimating = false;
			}else{
				viewport.style.marginLeft = (currentPos+step)+"px";
				isAnimating = true;
				setTimeout(function(){
					moveMarginHorizontal(targetPos+step,step, fps);
				},1000/fps);
			}
		}
		else{
			if(targetPos-step <= 0){
				viewport.style.marginLeft = (currentPos-targetPos)+"px";
				isAnimating = false;	
			}else{
				viewport.style.marginLeft = (currentPos-step)+"px";
				isAnimating = true;
				setTimeout(function(){
					moveMarginHorizontal(targetPos-step,step, fps);
				},1000/fps);	
			}
		}
	}
	
	// move viewport periodicly based on given value
	function moveMarginVertical(targetPos, step, fps){
		var currentPos = parseFloat(getComputedStyle(viewport).marginTop);
		if(targetPos < 0){
			if(targetPos+step >= 0){
				viewport.style.marginTop = (currentPos+step)+"px";
				isAnimating = false;
			}else{
				viewport.style.marginTop = (currentPos+step)+"px";
				isAnimating = true;
				setTimeout(function(){
					moveMarginVertical(targetPos+step,step, fps);
				},1000/fps);
			}
		}
		else{
			if(targetPos-step <= 0){
				viewport.style.marginTop = (currentPos-targetPos)+"px";
				isAnimating = false;	
			}else{
				viewport.style.marginTop = (currentPos-step)+"px";
				isAnimating = true;
				setTimeout(function(){
					moveMarginVertical(targetPos-step,step, fps);
				},1000/fps);	
			}
		}	
	}
	
//#endregion private function -----
	

// =================
//#region public function 
// =================

	// Turn given DOM into a slider. All DOM children will displayed inside a slider
	this.createSlider = function(domSource, style, maxDisplay){
		if(!domSource) return;
		
		if(domSource.children.length <= 0)return;
		
		// set the source of this slider
		source = domSource;
		
		// create frame
		frame = document.createElement("DIV");
		frame.className = "slider__frame";
		
		
		// create viewport
		viewport = document.createElement("UL");
		viewport.className = "slider__viewport";
		
		
		// add content
		while(source.children.length > 0){
			self.addContent(source.childNodes[0]);
		}		

		source.appendChild(frame);			
		frame.appendChild(viewport);

		// set viewport max display
		maxContent = (viewport.children.length < maxDisplay) ? viewport.children.length : maxDisplay;
		
		// set slider style
		sliderStyle = style || sliderStyle;
		sliderStyleCache = sliderStyle;
		(sliderStyleCache == "horizontal") ? setHorizontalStyle() : setVerticalStyle();
		
		// crete navigation page button
		if(viewport.children.length > maxContent)
			createNavigationPage();
		
		// Force resizing if screen is small
		self.forceResize();
		addEventListener("resize", function(){
			self.forceResize();
		});
	}
	
	// Add given DOM to viewport.
	// any added DOM will be wrapped inside of <LI> element
	this.addContent = function(dom)
	{
		let listItem = document.createElement("LI");
		listItem.appendChild(dom);
		viewport.appendChild(listItem);
	}
	
	// Display given page in slider
	this.setPage = function( page){
		
		if(isAnimating) return;
		if(page > sliderPageButtons.length || page < 0 )return;
		
		if(sliderStyle == 'horizontal'){

			var pagePos = parseInt(frame.offsetWidth)*page;
			var sliderPos = parseInt(getComputedStyle(viewport).marginLeft);
			var distance = sliderPos + pagePos;
			
			// move the content
			setTimeout(function(){
				moveMarginHorizontal(distance, Math.ceil(Math.abs(distance/fps)), fps);
			})
		}
		
		else if(sliderStyle == "vertical"){
			// get frame margin
			var frameMargin = parseInt(getComputedStyle(frame).marginTop);
			
			// get target location
			//var targetContent = viewport.childNodes[page*(maxContent)];
			var pagePos = parseInt(frame.offsetHeight)*page;
			var sliderPos = parseInt(getComputedStyle(viewport).marginTop);
			var distance = sliderPos + pagePos;
			//distance = distance+frameMargin;

			// move the content
			setTimeout(function(){
				moveMarginVertical(distance, Math.ceil(Math.abs(distance/fps)), fps);
			})
		}
		currentPage = page;
		
		for(var i=0; i<sliderPageButtons.length; i++){
			var btn = sliderPageButtons[i];
			if(i == page){
				btn.className = "slider__page_btn--selected";		
			}
			else{
				btn.className = "slider__page_btn";
			};
		}
	}
	
	// Display prev page (if exist)
	this.prevPage = function(){
		if(currentPage-1 >=0)self.setPage(currentPage-1);
	}
	
	// Display next page (if exist)
	this.nextPage = function(){
		if(currentPage+1 <sliderPageButtons.length){
			
		self.setPage(currentPage+1);	
		}
	}
	
	// force slider to slide vertical on small device (device width <=768)
	this.forceResize = function(){
		
		if(window.innerWidth <= 768){
				setVerticalStyle();
		}else{
			(sliderStyleCache == "horizontal") ? setHorizontalStyle() : setVerticalStyle();
		}
	}
	
//#endregion --- public function ---
}