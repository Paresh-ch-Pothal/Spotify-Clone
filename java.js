let currentsong = new Audio();

console.log("Let's start javascript");

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/Spotify%20Clown/audio/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/audio/")[1]);
    }
  }
  return songs;
}

function secondsToMinutesSeconds(seconds) {
  // Ensure seconds is a non-negative number
  if (typeof seconds !== 'number' || seconds < 0) {
    return 'Invalid input';
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
  currentsong.src = "audio/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "Images/pause.svg"; // Fixed typo here
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  // get the list of all songs
  let songs = await getsongs();
  playmusic(songs[0], true);
  console.log(songs);

  // show all the songs in the playlist
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songul.innerHTML += `<li><img class="invert" src="Images/music.svg" alt="">
      <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Asus</div>
      </div>
      <div class="playnow"><span>Play Now</span>
      <img class="invert" src="Images/play.svg" alt="play-button"></div>
      </li>`;
  }

  // attach an event listener to the song
  let arrArray = document.querySelector(".songlist").getElementsByTagName("li");
  console.log(arrArray);
  let arr = Array.from(arrArray);
  arr.forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    })
  });

  // attach an event listener to the play, next, and previous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "Images/pause.svg";
    } else {
      currentsong.pause();
      play.src = "Images/play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;

    // Move the circle based on the time update
    const leftPercentage = (currentsong.currentTime / currentsong.duration) * 100;
    console.log('Left Percentage:', leftPercentage);
    document.querySelector(".circle").style.left = leftPercentage + "%";
  });

  //to add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    console.log(e.offsetX,e.offsetY)
  })
}

main();
