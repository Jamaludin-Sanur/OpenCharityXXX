window.onload = function(){
	let allContainer = document.getElementsByClassName("slider");
	for(let i=0; i<allContainer.length; i++){
		let dom = allContainer[i];
		let sliderStyle = dom.getAttribute("data-slider_style");
		let maxArticle = dom.getAttribute("data-max_article");

		if(!sliderStyle || !maxArticle) return;
		
		let slider = new Slider();
		slider.createSlider(dom, sliderStyle, maxArticle);
	}
}