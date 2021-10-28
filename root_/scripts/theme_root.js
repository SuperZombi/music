var th = location.hash.split("#")[2]
if (th){
	if (th == "dark"){
		var darkThemeMq = true
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
	}
	else{
		var darkThemeMq = false
	}
}
else{
	var darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)").matches
	if (darkThemeMq) {
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
	}	
}

function change_switcher(){
	if (darkThemeMq){
		document.getElementById("moon").style.background = "#F6D602"
		document.getElementById("moon").style.border = "1px solid #f5eb71"
		document.getElementById("moonspot1").style.background = "#F6D602"
		document.getElementById("moonspot2").style.background = "#F6D602"
		document.getElementById("cover").style.transform = "translate(42px,-92px)"
		document.getElementById("cover").style.background = "#4DBFC8"
		document.getElementById("dark_file").remove()
		location.hash = `#${language}#light`
	}
	else{
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "root_/styles/dark.css");
		document.head.appendChild(l)
		location.hash = `#${language}#dark`
	}
	setTimeout(function(){
		location.reload()
	}, 800)
}