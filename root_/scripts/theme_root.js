/* Leaves */
(function leaves_(){
  if (typeof leaves_area !== 'undefined'){
	var lea = document.createElement("link")
	lea.rel = "stylesheet"
	lea.setAttribute("href", "root_/styles/leaves.css");
	document.head.appendChild(lea)
	var scr = document.createElement("script")
	scr.setAttribute("src", "root_/scripts/leaves.js");
	document.head.appendChild(scr)   
  }
  else{
    setTimeout(function(){leaves_()}, 500)
  }
})()
/**/

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
		localStorage.setItem('theme', 'dark');
	}
	else{
		darkThemeMq = false
		localStorage.setItem('theme', 'light');
	}
}
else{
	var tmp_th = localStorage.getItem('theme')
	if(tmp_th){
		if (tmp_th == "dark"){
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
			localStorage.setItem('theme', 'dark');
		}
		else{
			localStorage.setItem('theme', 'light');
		}
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
	setTimeout(function(){ darking_images() }, 300)
}

function darking_images(){
	var path = window.location.pathname;
	var page = path.split("/").pop().split(".html")[0];
	if (page == "support"){
		var tmp_ = document.getElementById("support")
		if (tmp_){
			tmp_2 = tmp_.getElementsByTagName("img")
			Object.keys(tmp_2).forEach(function(e){
				try_dark(tmp_2[e])
			})
		}
	}
}
