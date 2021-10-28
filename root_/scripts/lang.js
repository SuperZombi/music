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