function checkPhoto(target) {
    document.getElementById("photoLabel").innerHTML = "";
    var _URL = window.URL || window.webkitURL;
    file = target.files[0];
    img = new Image();
    var objectUrl = _URL.createObjectURL(file);
    img.onload = function () {
        if (this.width > 1080 || this.height > 1080){
            document.getElementById("photoLabel").innerHTML += "Max Resolution is <i style='color:red'>1080x1080</i>! <br>";
            target.value = '';
        }
        _URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;

    if(target.files[0].size > 1048576) {
        document.getElementById("photoLabel").innerHTML += "Max Image Size is <i style='color:red'>1Mb</i>! <br>";
        target.value = '';
    }
}

function checkAudio(target) {
    document.getElementById("audioLabel").innerHTML = "";
    if(target.files[0].size > 10485760) {
        document.getElementById("audioLabel").innerHTML += "Max Audio Size is <i style='color:red'>10Mb</i>! <br>";
        target.value = '';
    }
}

function openLink(target){
    var link = target.parentElement.querySelector("input").value;
    if (link){
        window.open(link, '_blank');
    }
}

var hosts = {
    'spotify': ["https://open.spotify.com"],
    'youtube_music': ["https://music.youtube.com"],
    'youtube': ["https://youtu.be", "https://www.youtube.com"],
    'apple_music': ["https://music.apple.com"],
    'deezer': ["https://deezer.page.link"],
    'soundcloud': ["https://soundcloud.com"],
    'newgrounds': ["https://www.newgrounds.com"]
}
async function checkLink(target){
    if (target.value){
        try{
            const domain = (new URL(target.value)).origin;
            if (hosts[  target.id.split("form_")[1]  ].includes(domain)){
                target.style.border = "3px solid lightgreen";
                target.style.boxShadow = "0 0 10px lightgreen";
            }
            else{
                target.style.border = "3px solid red";
                target.style.boxShadow = "0 0 10px red";
            }
        }
        catch{
            target.style.border = "3px solid red";
            target.style.boxShadow = "0 0 10px red";
        }
    }
    else{
        target.style.border = "";
        target.style.boxShadow = "";
    }
}

function sendForm(form){
    var arr = form.querySelectorAll("input");
    var form_data = new FormData();
    var final = {};
    arr.forEach(function(e){
        if (e.id && e.value){
            if (e.files){
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.files.item(0).name
                });
            }
            else if (e.type == "checkbox"){
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.checked
                });
            }
            else{
                Object.assign(final, {
                    [e.id.split("form_")[1]] : e.value.trim()
                });
            }
        }
    });
    console.log(final);
    var links = {};
    Object.keys(hosts).forEach(function(e){
        if (final[e]){
            Object.assign(links, {[e] : final[e]})
        }
    })
    var string = 
`config = {
    "track_name": "${final.track_name}",
    "artist": "${final.artist}",
    "genre": "${final.genre}",
    "main_img": "${final.image}",
    "allow_download": ${final.allow_download},
    "download_file": "${final.audio}",
`
    if (links){
        string += `    "links": {\n`;
        Object.keys(links).forEach(function(e){
            string += `        "${e}": "${links[e]}",\n`;
        })
        string += "    },";
    }

    string += `
    "audio_preview": "${final.audio}",
    "show_time": true,
    "animate_time": true
}`

    console.log(string)
    download('config.json', string);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}