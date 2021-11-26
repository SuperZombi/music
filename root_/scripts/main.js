function set_background(){
	if (window.innerWidth < window.innerHeight){
		comand = `background:url(${config.main_img}) center center/auto 100% no-repeat fixed !important`
	}
	else{
		comand = `background:url(${config.main_img}) center center/100% no-repeat fixed !important`
	}
	document.getElementById("background").setAttribute('style', comand);	
}
window.onresize = function(){ set_background() }
window.orientationchange = function(){ set_background() }


function try_dark(e){
	if (darkThemeMq){
		e.src = e.src.split('.').slice(0, -1).join('.') + "_dark.svg"
	}
	else{
		e.src = e.src.split('.').slice(0, -1).join('.').split("_dark")[0] + ".svg"
	}
}

function create_link(name, link, but, img) {
	if (name == "Download"){
		document.getElementById("links_area").innerHTML +=
		`<div class="link" id="download">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM9.71,10.29,11,11.59V6h2v5.59l1.29-1.29,1.41,1.41L12,15.41,8.29,11.71ZM16,18H8V16h8Z" data-name="Layer 2"/></svg>
			<a href="${link}" download>${but}</a>
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
		if (!config.allow_download){
			document.getElementById("page").style.paddingBottom = "10px"
		}
	}
	if (config.allow_download){
		create_link("Download", config.download_file, LANG.download)
	}	
}


window.onload = function(){
	(function load_page(){
		if (typeof header !== 'undefined' && typeof body !== 'undefined' && typeof footer !== 'undefined'){
			document.body.innerHTML += header
			document.body.innerHTML += body
			document.body.innerHTML += footer
			main()

			setTimeout(function(){document.body.style.transition = "1s"}, 500)
		}
		else{
			setTimeout(function(){load_page()}, 500)
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
		document.getElementById("leaves_area").style.opacity = ""
		document.getElementById("leaves_area").style.position = ""
		document.getElementById("header").style.overflow = ""
		document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
		 	`0 0 ${document.getElementById("leaves_area").offsetWidth} ${document.getElementById("leaves_area").offsetHeight}`)
		
		window.addEventListener('resize', () => document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
		 	`0 0 ${document.getElementById("leaves_area").offsetWidth} ${document.getElementById("leaves_area").offsetHeight}`));

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
		document.getElementById("leaves_area").style.opacity = 0.85
		document.getElementById("leaves_area").style.position = "fixed"
		document.getElementById("header").style.overflow = "unset"

		document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
		 	`0 0 ${document.body.offsetWidth} ${document.body.offsetHeight}`)

		window.addEventListener('resize', () => document.getElementById("leaves_area").getElementsByTagName("svg")[0].setAttribute("viewBox", 
		 	`0 0 ${document.body.offsetWidth} ${document.body.offsetHeight}`));
	}
}

function main(){
	document.title = `${config.artist} - ${config.track_name}`
	set_background()

	build_links()

	document.getElementById("main_img").onclick = function(){
		easter_egg()
	}

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
	    plugins: plugin
	}, theme_params));

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
			seconds = totalSeconds % 60;
			string = minutes + ":" + seconds
			document.getElementById('time-total').innerText = string
		}
		else{
			totalSeconds = Math.round(wavesurfer.getCurrentTime());
			minutes = Math.floor(totalSeconds / 60);
			seconds = totalSeconds % 60;
			string = minutes + ":" + seconds
			document.getElementById('time-current').innerText = string
		}
	}

	wavesurfer.on('ready', function (){
  		setCurrent(true)
	    document.getElementById('time-current').innerText = "0:0";
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

region_play = false;
function play(e){
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
