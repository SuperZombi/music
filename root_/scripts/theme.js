/* Leaves */
(function leaves_(){
  if (typeof leaves_area !== 'undefined'){
	var lea = document.createElement("link")
	lea.rel = "stylesheet"
	lea.setAttribute("href", "../../root_/styles/leaves.css");
	document.head.appendChild(lea)
	var scr = document.createElement("script")
	scr.setAttribute("src", "../../root_/scripts/leaves.js");
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
		l.setAttribute("href", "../../root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
		change_switcher_title()
		window.localStorage.setItem('theme', 'dark');
	}
	else{
		darkThemeMq = false
		window.localStorage.setItem('theme', 'light');
	}
}
else{
	var tmp_th = window.localStorage.getItem('theme')
	if(tmp_th){
		if (tmp_th == "dark"){
			darkThemeMq = true
			var l = document.createElement("link")
			l.rel = "stylesheet"
			l.setAttribute("href", "../../root_/styles/dark.css");
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
			l.setAttribute("href", "../../root_/styles/dark.css");
			l.setAttribute("id", "dark_file");
			document.head.appendChild(l)
			change_switcher_title()
			window.localStorage.setItem('theme', 'dark');
		}
		else{
			window.localStorage.setItem('theme', 'light');
		}
	}
}

}else{setTimeout(function(){load_lang()}, 2)}})()


function change_switcher(){
	if (darkThemeMq){
		document.getElementById("dark_file").remove()
		document.getElementById("swicher").title = LANG.dark
		location.hash = `#${language}#light`
	}
	else{
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "../../root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
		document.getElementById("swicher").title = LANG.light
		location.hash = `#${language}#dark`
	}
	darkThemeMq = !darkThemeMq
	setTimeout(function(){
		arr = document.getElementById("links_area").getElementsByClassName("link")
		Object.keys(arr).forEach(function(e){
			var el = arr[e].getElementsByTagName("img")[0]
			if (typeof el !== 'undefined'){
				try_dark(el)
			}
		})
	}, 300)
}
