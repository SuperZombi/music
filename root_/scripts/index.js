window.onload = function() {
	(function load_page(){
	if (typeof header !== 'undefined' && typeof body !== 'undefined' && typeof footer !== 'undefined'){
		document.body.innerHTML += header
		document.body.innerHTML += body
		document.body.innerHTML += footer

		setTimeout(function(){document.body.style.transition = "1s"}, 500)
	}
	else{
		setTimeout(function(){load_page()}, 500)
	}
	})()
}

function try_dark(e){
	if (darkThemeMq){
		name = e.src.split('/').slice(-1)[0].split('.')[0]
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
