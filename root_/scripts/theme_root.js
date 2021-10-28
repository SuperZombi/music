function change_switcher_title(){
	try{document.getElementById("swicher").title = LANG.light}
	catch{setTimeout(function(){change_switcher_title()}, 5)}
}

(function load_lang(){if (typeof LANG !== 'undefined'){

var th = location.hash.split("#")[2]
if (th){
	if (th == "dark"){
		darkThemeMq = true
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
		change_switcher_title()
	}
	else{
		darkThemeMq = false
	}
}
else{
	darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)").matches
	if (darkThemeMq) {
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
		document.getElementById("swicher").title = LANG.light
	}	
}

}else{setTimeout(function(){load_lang()}, 2)}})()


function change_switcher(){
	if (darkThemeMq){
		document.getElementById("moon").style.background = "#F6D602"
		document.getElementById("moon").style.border = "2px solid #f5eb71"
		document.getElementById("moonspot1").style.background = "#F6D602"
		document.getElementById("moonspot2").style.background = "#F6D602"
		document.getElementById("cover").style.transform = "translate(42px,-92px)"
		document.getElementById("cover").style.background = "#4DBFC8"
		document.getElementById("dark_file").remove()
		document.getElementById("swicher").title = LANG.dark
		location.hash = `#${language}#light`
	}
	else{
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "root_/styles/dark.css");
		document.head.appendChild(l)
		document.getElementById("swicher").title = LANG.light
		location.hash = `#${language}#dark`
	}
	setTimeout(function(){
		location.reload()
	}, 800)
}
