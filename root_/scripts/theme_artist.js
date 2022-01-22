/* Leaves */
// (function leaves_(){
//   if (typeof leaves_area !== 'undefined'){
// 	var lea = document.createElement("link")
// 	lea.rel = "stylesheet"
// 	lea.setAttribute("href", "../root_/styles/leaves.css");
// 	document.head.appendChild(lea)
// 	var scr = document.createElement("script")
// 	scr.setAttribute("src", "../root_/scripts/leaves.js");
// 	document.head.appendChild(scr)   
//   }
//   else{
//     setTimeout(function(){leaves_()}, 500)
//   }
// })()
/**/

/* Snowflakes */
(function snowflakes(){
  if (typeof leaves_area !== 'undefined'){
		var lea = document.createElement("link")
		lea.rel = "stylesheet"
		lea.setAttribute("href", "../root_/styles/snowfall.css");
		document.head.appendChild(lea)
		document.getElementById("leaves_area").innerHTML = `
			<snowfall style="height:inherit;position:absolute;color:#43c7fa;">
				${'<snowflake><span>❄</span></snowflake>'.repeat(20)}
				${'<snowflake><span>•</span></snowflake>'.repeat(20)}
				${'<snowflake><span>.</span></snowflake>'.repeat(10)}
			</snowfall>
		`
		// lights()
  }
  else{
    setTimeout(function(){snowflakes()}, 500)
  }
})()
/**/

/* Lights */
// function lights(){
// 		var lea = document.createElement("link")
// 		lea.rel = "stylesheet"
// 		lea.setAttribute("href", "../root_/styles/lights.css");
// 		document.head.appendChild(lea)
// 		document.getElementById("leaves_area").innerHTML += `
//         <ul class="line">
//             <li class="red"></li>
//             <li class="yellow"></li>
//             <li class="blue"></li>
//             <li class="pink"></li>
//             <li class="red"></li>
//             <li class="green"></li>
//             <li class="blue"></li>
//             <li class="yellow"></li>
//             <li class="red"></li>
//             <li class="pink"></li>
//             <li class="blue"></li>
//             <li class="yellow"></li>
//             <li class="red"></li>
//             <li class="green"></li>
//             <li class="blue"></li>
//             <li class="yellow"></li>
//             <li class="red"></li>
//             <li class="pink"></li>
//             <li class="green"></li>
//             <li class="blue"></li>
//             <li class="pink"></li>
//             <li class="red"></li>
//             <li class="green"></li>
//             <li class="blue"></li>
//         </ul>
// 		`
// }
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
		l.setAttribute("href", "../root_/styles/dark.css");
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
			l.setAttribute("href", "../root_/styles/dark.css");
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
			l.setAttribute("href", "../root_/styles/dark.css");
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

function try_dark(e){
	if (darkThemeMq){
		e.src = e.src.split('.').slice(0, -1).join('.') + "_dark.svg"
	}
	else{
		e.src = e.src.split('.').slice(0, -1).join('.').split("_dark")[0] + ".svg"
	}
}

function change_switcher(){
	if (darkThemeMq){
		document.getElementById("dark_file").remove()
		document.getElementById("swicher").title = LANG.dark
		location.hash = `#${language}#light`
		window.localStorage.setItem('theme', 'light');
	}
	else{
		var l = document.createElement("link")
		l.rel = "stylesheet"
		l.setAttribute("href", "../root_/styles/dark.css");
		l.setAttribute("id", "dark_file");
		document.head.appendChild(l)
		document.getElementById("swicher").title = LANG.light
		location.hash = `#${language}#dark`
		window.localStorage.setItem('theme', 'dark');
	}
	darkThemeMq = !darkThemeMq
	if (document.getElementById('artist_image').src.split('.').pop() == "svg"){
		try_dark(document.getElementById('artist_image'))
	}
}
