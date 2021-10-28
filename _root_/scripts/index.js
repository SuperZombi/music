window.onload = function() {
	document.body.innerHTML += header
	document.body.innerHTML += body
	document.body.innerHTML += footer
}

function try_dark(e){
	if (darkThemeMq){
		name = e.src.split('.')[0].split('/').slice(-1)[0]
		if (name.split("_").slice(-1)[0] != "dark"){
			e.src = e.src.split('.').slice(0, -1).join('.') + "_dark.svg"
		}
	}
}

var scrollPos = 0;
window.onscroll = function(){
	var st = window.scrollY;
	if (st > scrollPos){
		if (scrollPos == 0){
			window.scrollTo(0, 70)
		}
	}
	scrollPos = st;
}