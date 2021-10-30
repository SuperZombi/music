window.onload = function() {
	(function load_page(){
	if (typeof header !== 'undefined' && typeof body !== 'undefined'){
		document.title = `Zombi Music - ${LANG.support_title}`
		document.body.innerHTML += header
		document.body.innerHTML += body

		setTimeout(function(){document.body.style.transition = "1s"}, 500)
	}
	else{
		setTimeout(function(){load_page()}, 500)
	}
	})()
}

function show_email(){
	setTimeout(function(){
		document.getElementById("email").style.display = "block"
		setTimeout(function(){
			document.getElementById("email").style.opacity = 1
			setTimeout(function(){
				document.getElementById("email").className = "anim_email"
				document.getElementById("email").style.opacity = ""
			}, 1000)
		}, 10)
	}, 3000)
}

function try_dark(e){
	if (darkThemeMq){
		e.src = e.src.split('.').slice(0, -1).join('.') + "_dark.svg"
	}
	else{
		e.src = e.src.split('.').slice(0, -1).join('.').split("_dark")[0] + ".svg"
	}
}
