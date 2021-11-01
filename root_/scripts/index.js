window.onload = function() {
	(function load_page(){
	if (typeof header !== 'undefined' && typeof body !== 'undefined' && typeof footer !== 'undefined'){
		document.body.innerHTML += header
		document.body.innerHTML += body
		document.body.innerHTML += footer

		setTimeout(function(){document.body.style.transition = "1s"}, 500)

		main()
	}
	else{
		setTimeout(function(){load_page()}, 500)
	}
	})()
}
window.onresize = function(){ overflowed() }
window.orientationchange = function(){ overflowed() }
window.onscroll = function(){showScrollTop()}


async function main(){
	//await addNewCategory("Super Zombi", sortByDate(getAllAuthorTracks("Super Zombi")))
	await addNewCategory(LANG.all, sortByDate("all"))
	overflowed()
}



function showScrollTop(){
	if (window.scrollY > 200){
		document.getElementById("toTop").style.bottom = "10px"
	}
	else{
		document.getElementById("toTop").style.bottom = "-50%"
	}
}
function overflowed() {
	var arr = document.getElementsByClassName('track_name')
	Object.keys(arr).forEach(function(e){
		if (arr[e].scrollWidth>arr[e].offsetWidth){
			arr[e].getElementsByTagName('span')[0].className = "marquee"
		}
		else{
			if (arr[e].getElementsByTagName('span')[0].className){
				arr[e].getElementsByTagName('span')[0].className = ""
			}
		}
	})
}
async function addNewCategory(category_title, tracks){
	await new Promise((resolve, reject) => {
		var html = ""
		tracks.forEach(function(e){
			html += `
				<a href="${e.href}" class="about_box">
					<img src="${e.href}/${e.image}">
					<div class="track_name"><span>${e.track}</span></div>
					<div class="artist">${e.author}</div>
				</a>
			`
		})
		document.getElementById("main_page").innerHTML += `
			<div class="category">
				<div class="category_title">${category_title}</div>
				<div class="category_body">
					${html}
				</div>
			</div>
		`;
		resolve()
	});
}


function getAllAuthors(){
	return Object.keys(bd)
}
function getAllAuthorTracks(author, obj=true){
	if (obj){
		var tracks = bd[author].tracks
		var tracks_obj = []
		Object.keys(tracks).forEach(function(e){
			var _temp = Object.assign({"author":author,"track":e, "href":`${bd[author].path}/${tracks[e].path}`}, tracks[e])
			tracks_obj.push(_temp)
		})
		return tracks_obj
	}
	return Object.keys(bd[author].tracks)
}
function getAllGenres(){
	ganres = []
	Object.keys(bd).forEach(function(e){
		let tmp = bd[e].tracks
		Object.keys(tmp).forEach(function(el){
			if (!ganres.includes(tmp[el].genre)){
				ganres.push(tmp[el].genre);
			}
		})
	})
	return ganres
}
function getAllTracksByGenre(genr, full=true){
	/* returns array with tracks and them authors */
	var tracks = []
	Object.keys(bd).forEach(function(e){
		let tmp = bd[e].tracks
		Object.keys(tmp).forEach(function(el){
			if (tmp[el].genre == genr){
				let track = el
				let author = e
				if (full){
					tracks.push(Object.assign({"author":author,"track":track},tmp[el]))
				}
				else{
					tracks.push({"author":author, "track":track})
				}
			}
		})
	})
	return tracks
}
function last_updates(days=7){
	var all_tracks = []
	var authors = getAllAuthors()
	var now = new Date()
	Object.keys(authors).forEach(function(e){
		var author = authors[e]
		var info = getAllAuthorTracks(author)
		Object.keys(info).forEach(function(e){
			var tmp = info[e].date.split(".")
			var x = new Date(tmp[2], tmp[1]-1, tmp[0])
			var diff = Math.floor((now - x) / (1000 * 60 * 60 * 24))
			if (diff < days){
				var track_name = e
				var track_info = info[e]
				all_tracks.push( Object.assign({"author":author, "track":track_name}, track_info) )
			}
		})
	})
	return all_tracks
}
function sortByDate(what){
	if (what === "all")
	{
		var all_tracks = []
		var authors = getAllAuthors()
		Object.keys(authors).forEach(function(e){
			var author = authors[e]
			var info = getAllAuthorTracks(author)
			Object.keys(info).forEach(function(e){
				var track_name = e
				var track_info = info[e]
				all_tracks.push( Object.assign({"author":author, "track":track_name}, track_info) )
			})
		})
		return sortByDate(all_tracks)
	}
	else{
		what.forEach(function(e){
			var tmp = e.date.split(".")
			var x = new Date(tmp[2], tmp[1]-1, tmp[0])
			e.date = x
		})
		return what.sort((a, b) => b.date - a.date)
	}
}
