if (location.hash){
	language = location.hash.split("#")[1]
}
else{
	language = window.navigator.language.substr(0, 2)
	location.hash = language
}
var l = document.createElement("script")
l.setAttribute("src", `../../root_/Langs/${language.toUpperCase()}.json`);
document.head.appendChild(l)

(function (){
	if (typeof LANG === 'undefined'){
		setTimeout(function(){
			if (typeof LANG === 'undefined'){
				var l = document.createElement("script")
				l.setAttribute("src", `root_/Langs/EN.json`);
				document.head.appendChild(l);
				var th = location.hash.split("#")[2]
				if (typeof th === 'undefined'){
					location.hash = "en"
				}
				else{
					location.hash = `#en#${th}`
				}
			}
		}, 500)
	}
})()
