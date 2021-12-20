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
function ifUrlExist(url, callback) {
    let request = new XMLHttpRequest;
    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.setRequestHeader('Accept', '*/*');
    request.onprogress = function(event) {
        let status = event.target.status;
        let statusFirstNumber = (status).toString()[0];
        switch (statusFirstNumber) {
            case '2':
                request.abort();
                return callback(true);
            default:
                request.abort();
                return callback(false);
        };
    };
    request.send('');
};
async function checkLink(target){
    if (target.value){
        const domain = (new URL(target.value)).origin;
        if (hosts[  target.id.split("form_")[1]  ].includes(domain)){
            ifUrlExist(target.value, function(exists) {
                console.log(exists);
            });
            // if (linkExists(target.value)){
            //     console.log("correct")
            // }
            // else{
            //     console.log("NOT")
            // }
        }
        else{
            console.log("NOT")
        }
    }
}

function sendForm(form){
    var arr = form.querySelectorAll("input");
    var form_data = new FormData();
    var final = {};
    arr.forEach(function(e){
        if (e.id){
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
    var string = 
`config = {
    "track_name": "${final.track_name}",
    "artist": "${final.artist}",
    "genre": "${final.genre}",
    "main_img": "${final.image}",
    "allow_download": ${final.allow_download},
    "download_file": "${final.audio}",
`

//     "links": { // all optional
//         "spotify": "",
//         "youtube_music": "",
//         "youtube": "",
//         "apple_music": "",
//         "deezer": "",
//         "soundcloud": "",
//         "newgrounds": ""
//     },

//     "audio_preview": "${final.audio}",
//     "show_time": true, // true/false (optional)
//     "animate_time": true, // true/false (optional)
//     "preview_z": true, // true/false (Limit preview area) (optional)
//     "preview_zone": [start_time, end_time] // (seconds) If the previous then required
// }
// `
    //download('test.json', string);
}

function temp(){
    console.log("here");
    download('test.txt', 'Hello world!');
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
