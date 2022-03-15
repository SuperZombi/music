function set_background(){
	if (window.innerWidth < window.innerHeight){
		comand = `background:url(${config.main_img}) center center/auto 100% no-repeat fixed !important`
	}
	else{
		comand = `background:url(${config.main_img}) center center/100% no-repeat fixed !important`
	}
	document.getElementById("background").setAttribute('style', comand);	
}


function try_dark(e){
	if (darkThemeMq){
		e.src = e.src.split('.').slice(0, -1).join('.') + "_dark.svg"
	}
	else{
		e.src = e.src.split('.').slice(0, -1).join('.').split("_dark")[0] + ".svg"
	}
}

var shareMenuTimer;
function shareMenu(e) {
	for (let i=0; i<e.path.length;i++){
		if (e.path[i] == document.getElementById("close_share_menu")){
			close()
			return
		}
		if (e.path[i] == document.getElementById("header")){
			return
		}
		if (e.path[i] == document.getElementById("share_menu")){
			return
		}
		if (e.path[i] == document.getElementById("notifications")){
			return
		}	
	}
	function close(){
		document.getElementById("share_menu").style.transform = "translate(-50%, -50%) scale(0)"
		document.getElementById("share_menu").style.opacity = 0
		document.getElementById("wraper").style.pointerEvents = "auto";
		document.getElementById("wraper").style.userSelect = "auto";
		document.getElementById("wraper").style.filter = "";
		document.body.onclick = ""
		shareMenuTimer = setTimeout(function(){document.getElementById("share_menu").style.display = "none"}, 500)
	}
	if (document.getElementById("share_menu").style.display == "block"){
		close()
	}
	else{
		if (shareMenuTimer){
			clearTimeout(shareMenuTimer)
		}
		document.getElementById("share_menu").style.display = "block"
		document.getElementById("wraper").style.pointerEvents = "none";
		document.getElementById("wraper").style.userSelect = "none";
		document.getElementById("wraper").style.filter = "blur(4px)";
		setTimeout(function(){
			document.getElementById("share_menu").style.transform = "translate(-50%, -50%) scale(1)"
			document.getElementById("share_menu").style.opacity = 1
		},1)
		setTimeout(function(){
			document.body.onclick = function(){shareMenu(event)}
		}, 500)
	}
}
function copy_link(element){
	function format(text){
		return text.replaceAll("<wbr>", "")
	}
	const link = element.parentElement.getElementsByTagName('span')[0].innerHTML
	const elem = document.createElement('textarea');
	elem.value = location.protocol + "//" + format(link);
	document.body.appendChild(elem);
	elem.select();
	document.execCommand('copy');
	document.body.removeChild(elem);

	notice.Success(LANG.copied, 3000)
}
function open_website(site_name){
	function image_url(){
		return new URL(config.main_img, document.baseURI).href
	}

	if (site_name == "vk"){
		var link = `https://vk.com/share.php?url=${location.protocol}//${location.host+location.pathname}&title=${document.title}&description=Zombi Music&image=${image_url()}`
	}
	else if (site_name == "facebook"){
		var link = `https://www.facebook.com/sharer.php?u=${location.protocol}//${location.host+location.pathname}`
	}
	else if (site_name == "telegram"){
		var link = `https://telegram.me/share/url?url=${location.protocol}//${location.host+location.pathname}&text=${document.title}`
	}
	else if (site_name == "viber"){
		var link = `viber://forward?text=${document.title}\n${location.protocol}//${location.host+location.pathname}`
	}
	else if (site_name == "whatsapp"){
		var link = `https://api.whatsapp.com/send?text=${document.title}\n${location.protocol}//${location.host+location.pathname}`
	}
	else if (site_name == "twitter"){
		var link = `https://twitter.com/share?url=${location.protocol}//${location.host+location.pathname}&text=${document.title}`
	}
	if (link){
		window.open(encodeURI(link), "_blank");
	}
}

function create_link(name, link, but, img) {
	if (name == "Download"){
		document.getElementById("links_area").innerHTML +=
		`<div class="link other_link" id="download">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM9.71,10.29,11,11.59V6h2v5.59l1.29-1.29,1.41,1.41L12,15.41,8.29,11.71ZM16,18H8V16h8Z" data-name="Layer 2"/></svg>
			<span>
				<a href="${link}" download>${but}</a>
			</span>
		</div>`
	}
	else if (name == "Share"){
		document.getElementById("links_area").innerHTML +=
		`<div class="link other_link" id="share">
			<svg viewBox="0 0 24 24"><g><path d="M15,5.63L20.66,12L15,18.37V15v-1h-1c-3.96,0-7.14,1-9.75,3.09c1.84-4.07,5.11-6.4,9.89-7.1L15,9.86V9V5.63 M14,3v6 C6.22,10.13,3.11,15.33,2,21c2.78-3.97,6.44-6,12-6v6l8-9L14,3L14,3z"></path></g></svg>
			<span>
				<a onclick="shareMenu(event)">${but}</a>
			</span>
		</div>`
	}
	else{
		function append_link(name, link, but, image){
			document.getElementById("links_area").innerHTML +=
			`<div class="link">
				<img src="${image}" alt="${name}">
				<a href="${link}">${but}</a>
			</div>`
		}
		if (darkThemeMq){
			var temp = img.split('.').slice(0, -1).join('.') + "_dark.svg"
			append_link(name, link, but, temp)
		}
		else{
			append_link(name, link, but, img)
		}
	}
}

function build_links(){
	if (config.links){
		if (config.links.spotify){
			create_link("Spotify", config.links.spotify, LANG.play, "../../root_/images/spotify.svg")
		}
		if (config.links.youtube_music){
			create_link("YouTube Music", config.links.youtube_music, LANG.play, "../../root_/images/youtube_music.svg")
		}
		if (config.links.youtube){
			create_link("YouTube", config.links.youtube, LANG.watch, "../../root_/images/youtube.svg")
		}
		if (config.links.apple_music){
			create_link("Apple Music", config.links.apple_music, LANG.play, "../../root_/images/apple_music.svg")
		}
		if (config.links.deezer){
			create_link("Deezer", config.links.deezer, LANG.play, "../../root_/images/deezer.svg")
		}
		if (config.links.soundcloud){
			create_link("Soundcloud", config.links.soundcloud, LANG.play, "../../root_/images/soundcloud.svg")
		}
		if (config.links.newgrounds){
			create_link("Newgrounds", config.links.newgrounds, LANG.watch, "../../root_/images/newgrounds.svg")
		}
	}
	else{
		if (!config.allow_download && !config.audio_preview){
			document.getElementById("page").style.paddingBottom = "10px"
		}
	}
	create_link("Share", "", LANG.share)
	if (config.allow_download){
		create_link("Download", config.download_file, LANG.download)
	}	
}


window.onload = function(){
	(function load_page(){
		if (typeof darkThemeMq === 'undefined'){
			setTimeout(function(){load_page()}, 100)
		}
		else if (typeof header !== 'undefined' && typeof body !== 'undefined' && typeof footer !== 'undefined' && darkThemeMq !== 'undefined'){
			document.body.innerHTML += header
			document.body.innerHTML += body
			document.body.innerHTML += footer
			main()

			setTimeout(function(){document.body.style.transition = "1s"}, 500)
		}
		else{
			setTimeout(function(){load_page()}, 100)
		}
	})()
}

easter_egg_counter = 0
var easter_egg_timer;
function easter_egg() {
	if (easter_egg_timer) {
		clearTimeout(easter_egg_timer);
	}
	easter_egg_timer = setTimeout(function(){
		easter_egg_counter = 0
		document.getElementById("main_img").style.borderRadius = "20px"
		if (document.getElementById("easter_egg")){
			document.getElementById("easter_egg").remove()
		}
	}, 2000);
	if (easter_egg_counter == 0){
		// Snowflakes
		document.getElementById("leaves_area").getElementsByTagName("snowfall")[0].style.height = "inherit"
		document.getElementById("leaves_area").style.opacity = ""
		document.getElementById("leaves_area").style.position = ""
		document.getElementById("header").style.overflow = ""

		/*
		// Leaves
		document.getElementById("leaves_area").style.opacity = ""
		document.getElementById("leaves_area").style.position = ""
		document.getElementById("header").style.overflow = ""
		document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
			`0 0 ${document.getElementById("leaves_area").offsetWidth} ${document.getElementById("leaves_area").offsetHeight}`)
		
		window.addEventListener('resize', () => document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
			`0 0 ${document.getElementById("leaves_area").offsetWidth} ${document.getElementById("leaves_area").offsetHeight}`));
		*/
	}

	easter_egg_counter += 1
	document.getElementById("main_img").style.transition = "0.5s"
	document.getElementById("main_img").style.cursor = "pointer"
	document.getElementById("main_img").title = LANG.easter_egg

	if (easter_egg_counter == 5){
		if (!document.getElementById("easter_egg")){
			new_div = document.createElement("div")
			new_div.id = "easter_egg"
			new_div.innerHTML = 10 - easter_egg_counter
			document.getElementById("main_img").after(new_div)
		}
	}
	if (easter_egg_counter > 3){
		document.getElementById("main_img").style.borderRadius = "50%"
	}
	else{
		document.getElementById("main_img").style.borderRadius = "50px"
	}
	if (easter_egg_counter > 5){
		document.getElementById("easter_egg").innerHTML = Math.max(10 - easter_egg_counter, 0)
	}
	if (easter_egg_counter == 10){
		setTimeout(function(){
		if (document.getElementById("easter_egg")){
				easter_egg_counter = 0
				document.getElementById("main_img").style.borderRadius = "20px"
				document.getElementById("main_img").title = ""
				document.getElementById("easter_egg").remove()
			}
		}, 1500)

		// Snowflakes
		document.getElementById("leaves_area").getElementsByTagName("snowfall")[0].style.height = "100vh"
		document.getElementById("leaves_area").style.position = "fixed"
		document.getElementById("leaves_area").style.opacity = 0.85
		document.getElementById("header").style.overflow = "unset"

		/*
		// Leaves
		document.getElementById("leaves_area").style.opacity = 0.85
		document.getElementById("leaves_area").style.position = "fixed"
		document.getElementById("header").style.overflow = "unset"

		document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
			`0 0 ${document.body.offsetWidth} ${document.body.offsetHeight}`)

		window.addEventListener('resize', () => document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
			`0 0 ${document.body.offsetWidth} ${document.body.offsetHeight}`));
		*/
	}
}

function loadRipple(){
	var l = document.createElement("script")
	l.setAttribute("src", `../../root_/scripts/ripple.js`);
	document.head.appendChild(l);
}
(function load_notifications() {
	var l = document.createElement("link")
	l.rel = "stylesheet"
	l.setAttribute("href", "https://superzombi.github.io/Notification_JS/notifications.css");
	document.head.appendChild(l)

	var l = document.createElement("link")
	l.rel = "stylesheet"
	l.setAttribute("href", "https://superzombi.github.io/Notification_JS/plugins/simplity.css");
	document.head.appendChild(l)

	var s = document.createElement("script")
	s.setAttribute("src", `https://superzombi.github.io/Notification_JS/notifications.js`);
	document.head.appendChild(s);
})()

function main(){
	document.title = `${config.artist} - ${config.track_name}`
	set_background()
	window.onresize = function(){ set_background() }
	window.orientationchange = function(){ set_background() }

	build_links()

	document.getElementById("main_img").onclick = function(){
		easter_egg()
	}

	loadRipple()

	notice = Notification('#notifications');

	if (darkThemeMq){
		theme_params = {
			cursorColor: 'green',
			waveColor: 'lightgreen',
			progressColor: 'darkgreen'
		}
		region_color = 'rgb(255, 255, 255, 0.15)'
	}
	else{
		theme_params = {
			cursorColor: '#00B600',
			waveColor: 'darkgreen',
			progressColor: '#00D000'
		}
		region_color = 'rgb(0, 0, 0, 0.15)'
	}

	plugin = []
	if (config.preview_z){
		plugin = [WaveSurfer.regions.create({
			regions: [
				{	
					id: "preview",
					start: config.preview_zone[0],
					end: config.preview_zone[1],
					loop: false,
					drag: false,
					resize: false,
					color: region_color
				}
			]
		})]
	}

	wavesurfer = WaveSurfer.create(Object.assign({
		container: '#waveform',
		height: 80,
		barWidth: 1,
		hideScrollbar: true,
		plugins: plugin,
		backend: 'MediaElement'
	}, theme_params));

	window.onresize = function(){setTimeout(function(){wavesurfer.drawBuffer();}, 1000) }
	if(!config.audio_preview){
		document.getElementById("player").style.display = "none";
		document.getElementById("hr_").style.display = "none";
	}
	else{
		try{
			wavesurfer.load(config.audio_preview);
		}catch{
			document.getElementById("player").style.display = "none";
			document.getElementById("hr_").style.display = "none";
		}
	}

	if (!config.audio_preview && !config.allow_download && !config.links){
		document.getElementById("links_area").style.display = "none"
	}
	

	/* Hide time stamps */
	hide_time = (typeof config.show_time === 'undefined') ? true : !config.show_time;
	if (config.animate_time && config.show_time){
		hide_time = true;
		tracking()
	}
	if (!hide_time){
		document.getElementById("time-current").style.display = "block"
		document.getElementById("time-total").style.display = "block"
		document.getElementById("player").style.height = "96px"
		tracking()
	}
}

function tracking(){
	function setCurrent(init=false){
		if (init){
			totalSeconds = Math.round(wavesurfer.getDuration());
			minutes = Math.floor(totalSeconds / 60);
			seconds = (totalSeconds % 60).toString().padStart(2, 0);
			string = minutes + ":" + seconds
			document.getElementById('time-total').innerText = string
		}
		else{
			totalSeconds = Math.round(wavesurfer.getCurrentTime());
			minutes = Math.floor(totalSeconds / 60);
			seconds = (totalSeconds % 60).toString().padStart(2, 0);
			string = minutes + ":" + seconds
			document.getElementById('time-current').innerText = string
		}
	}

	wavesurfer.on('loading', function (e) {
		document.querySelector('#waveform > wave').style.display = "none";
	});
	wavesurfer.on('waveform-ready', function (){
		setCurrent(true)
		document.getElementById('time-current').innerText = "0:00";
		wavesurfer_isReady = true;
		document.querySelector('#waveform > wave').style.display = "block";
		document.getElementById("loading_waveform").style.display = "none";
	})

	wavesurfer.on('seek', function() {
		setCurrent()
	})
	wavesurfer.on('audioprocess', function() {
		if(wavesurfer.isPlaying()) {
			setCurrent()
		}
	});
}


var timout_id;
function show_anim_t(){
	if (timout_id) {
		clearTimeout(timout_id);
	}
	plr = document.getElementById("player").style
	plr.height = "96px"
	plr.overflow = "hidden"
	el1 = document.getElementById("time-current").style
	el2 = document.getElementById("time-total").style
	el1.transform = "translateY(30px)"
	el2.transform = "translateY(30px)"
	el1.display = "block"
	el2.display = "block"
	setTimeout(function(){
		el1.transform = ""
		el2.transform = ""
	},0)
}
function hide_anim_t(){
	plr = document.getElementById("player").style
	plr.height = "72px"
	el1 = document.getElementById("time-current").style
	el2 = document.getElementById("time-total").style
	el1.transform = "translateY(30px)"
	el2.transform = "translateY(30px)"
	timout_id = setTimeout(function(){
		el1.display = "none"
		el2.display = "none"
		plr.overflow = "unset"
	}, 200)
}

wavesurfer_isReady = false;
region_play = false;
play_clicked = false;
function play(e){
	if (!play_clicked){
		play_clicked = true;

		if (wavesurfer_isReady){
			if (wavesurfer.isPlaying()){
				if (config.show_time && config.animate_time){
					hide_anim_t()
				}
				
				e.target.className = "far fa-play-circle"
				e.target.title = LANG.player_play
				wavesurfer.pause()
			}
			else{
				if (config.show_time && config.animate_time){
					show_anim_t()
				}

				if (config.preview_z && !region_play){
					region_play = true;
					wavesurfer.regions.list["preview"].play()
					wavesurfer.on('pause', function() {
						if (config.preview_z){
							if (Math.round(wavesurfer.getCurrentTime()*100)/100 == config.preview_zone[1]){
								region_play = false;
								e.target.className = "far fa-play-circle"
								e.target.title = LANG.player_play
								wavesurfer.pause()
								if (config.animate_time){
									hide_anim_t()
								}
							}
						}
					});
					wavesurfer.on('region-out', function() {
						region_play = false;
						e.target.className = "far fa-play-circle"
						e.target.title = LANG.player_play
						wavesurfer.pause()
						if (config.animate_time){
							hide_anim_t()
						}
					});
				}
				else{
					wavesurfer.play()
				}
				e.target.className = "far fa-pause-circle"
				e.target.title = LANG.player_stop
				wavesurfer.on('finish', function (){
					e.target.className = "far fa-play-circle"
					e.target.title = LANG.player_play
					if (config.animate_time){
						hide_anim_t()
					}
				})
			}
		}
		setTimeout(function(){play_clicked=false}, 10)
	}
}
