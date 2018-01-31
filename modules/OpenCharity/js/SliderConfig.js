var oc = {};

oc.toggleFormColor = function(){

	let checkbox = document.getElementById('form_inputBg');
	let formBg = document.getElementById('form_bg');
	
	if(!checkbox || !formBg) return;
	
	formBg.style.display = (checkbox.checked == true) ? 'block' : 'none';
}

window.onload = function(){
	oc.toggleFormColor();
}