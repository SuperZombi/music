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
		change_switcher_title()
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
		document.getElementById("cover").style.background = "var(--header-color)"
		document.getElementById("dark_file").remove()
		document.getElementById("swicher").title = LANG.dark
		location.hash = `#${language}#light`
	}
	else{
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
		document.getElementById("swicher").title = LANG.light
		location.hash = `#${language}#dark`
	}
	darkThemeMq = !darkThemeMq
	setTimeout(function(){
		var tmp_ = document.getElementById("support")
		if (tmp_){
			tmp_2 = tmp_.getElementsByTagName("img")
			Object.keys(tmp_2).forEach(function(e){
				try_dark(tmp_2[e])
			})
		}	
	}, 300)	
}
