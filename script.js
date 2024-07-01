let currentsong = new Audio();
let songs;
let curfolder;
console.log("Let start javascript");
async function getsongs(folder) {
    curfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    //show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="Images/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Asus</div>
        </div>
        <div class="playnow"><span>Play Now</span>
        <img class="invert" src="Images/play.svg" alt="play-button"></div>
        </li>`;
    }

    //attach an event listener to the song
    let arrArray = document.querySelector(".songlist").getElementsByTagName("li");
    // console.log(arrArray);
    let arr = Array.from(arrArray);
    arr.forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML);
        })

    });
    return songs;
}
function secondsToMinutesSeconds(seconds) {
    // Ensure seconds is a non-negative number
    if (typeof seconds !== 'number' || seconds < 0) {
        return "invalid input"
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format the result as "mm:ss"
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(Math.floor(remainingSeconds)).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playmusic = (track, pause = false) => {
    // let music = new Audio("audio/" + track);
    currentsong.src = `/${curfolder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "Images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div);
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // console.log(e.href);
        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-1)[0]);
            console.log(folder);
            // get the metadata
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            // console.log(response);
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
            <svg class="play" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"
                fill="black">
                <circle cx="12" cy="12" r="10" fill="green" />
                <path
                    d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
                    stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
            <img src=http://127.0.0.1:5500/songs/${folder}/cover.jpeg alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`
        }
    }
    //load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item,item.currentTarget.dataset);
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            // console.log(songs);
            playmusic(songs[0]);
        })
    })
}

async function main() {
    //get the list of all songs
    await getsongs("songs/audio");
    playmusic(songs[0], true);
    // console.log(songs);
    displayalbums();


    // console.log(songs[0]);
    //attack an event listener to the play,next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "Images/pause.svg";
        }
        else {
            currentsong.pause();
            play.src = "Images/play.svg";
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
        const leftPercentage = (currentsong.currentTime / currentsong.duration) * 100;
        // console.log('Left Percentage:', leftPercentage);
        document.querySelector(".circle").style.left = leftPercentage + "%";
    })

    //to add event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    //add an evenrt listener to the hamburger icon
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    //add an evenrt listener to the hamburger icon
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -120 + "%";
    })

    //add an event listener to the previous button
    previous.addEventListener("click", () => {
        if (songs) {
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
            currentsong.pause();
            if ((index - 1) >= 0) {
                playmusic(songs[index - 1]);
            }
        }
        console.log("Previous clicked")
        console.log(currentsong);
    })

    next.addEventListener("click", () => {
        if (songs) {
            let ind = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
            currentsong.pause();
            // console.log(songs,index);
            if ((ind + 1) < songs.length) {
                playmusic(songs[ind + 1]);
            }
        }
        console.log("next clicked");
        console.log(currentsong);
    })

    //add an eventlistener to the volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("settng to the volume", e.target.value);
        currentsong.volume = parseInt(e.target.value) / 100;
    })

    //add eveentlistener to the volume
    document.querySelector(".volume>img").addEventListener("click",e=>{
        // console.log(e.target);
        if(e.target.src.includes("images/volume.svg")){
            e.target.src=e.target.src.replace("images/volume.svg" , "images/mute.svg");
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src="images/volume.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })


}
main();