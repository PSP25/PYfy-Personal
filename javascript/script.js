// console.log("lets write js");
const currentsong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
}

const minutes = Math.floor(seconds / 60);
const remainingSeconds = Math.floor(seconds % 60);

const formattedMinutes = String(minutes).padStart(2, '0');
const formattedSeconds = String(remainingSeconds).padStart(2, '0');

return `${formattedMinutes}:${formattedSeconds}`;
  }

async function getsongs(folder) {

  //get songs in the folder
    currFolder=folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //show all songs
      let songUl = document
      .querySelector(".songslist")
      .getElementsByTagName("ul")[0];
      songUl.innerHTML="";
    for (const song of songs) {
      songUl.innerHTML =
        songUl.innerHTML +
        `<li>
      <img src="img/music.svg" alt="music">
      <div class="info">
          <div class="songname">${song.replaceAll("%20", " ")}</div>
          <div class="artist"></div>
      </div>
      <div class="playnow">
          <img src="img/play.svg" alt="play">
      </div></li>`;
  }


    //attach event listener to songs
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")
    ).forEach(e => {
      e.addEventListener("click", () => {
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      })
    })
      return songs
}



const playmusic = (track, pause = false) => {
  currentsong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "img/pause.svg";
  }
  let songinfo = document.querySelector(".songinfo");
  songinfo.innerHTML = decodeURI(track);
  let songtime = document.querySelector(".songtime");
  songtime.innerHTML = "00:00 / 00:00";
};





async function displayalbums(){
    const a = await fetch(`/songs/`);
  const response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors=div.getElementsByTagName("a")
  let cardcontainer=document.querySelector(".cardcontainer")
  let array=Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
        let folder=e.href.split("/").slice(-2)[0];
        //get meta data of folder
        let a=await fetch(`/songs/${folder}/info.json`)
        let response=await a.json();
        // console.log(response);
        cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
        <div class="play">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="50"
            height="50"
            style="background-color: #1db954; border-radius: 50%"
            fill="black"
          >
            <circle cx="25" cy="25" r="20" fill="none" />
            <path
              d="M34.8438 25.4238L19.2188 35.2344V15.6133L34.8438 25.4238Z"
              fill="black"
            />
          </svg>
        </div>

        <img src="/songs/${folder}/cover.jpeg" alt="img" class="rounded"/>
        <h2>${response.title}</h2>
        <p>${response.description}</p>
      </div>`
    }
  }

    //load the play lists
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs= await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0], true);
            })
        })
}

//if the hover green button is clicked

async function main() {
    //show all songs
    await getsongs("songs/Hindi");
    playmusic(songs[0], true);
    
    
    //display all the albums in the page
    displayalbums()

  //attach to songbutoons
     const play= document.getElementById("play");
  play.addEventListener("click", (e) => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

    //listen for time update
    currentsong.addEventListener("timeupdate", (e) => {
      document.querySelector(".songtime").innerHTML = `${formatTime(
      currentsong.currentTime
    )} / ${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });


  //event listener to seek bar
  const seekbar = document.querySelector(".seekbar");
  seekbar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  //event listener to hamburger,close
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-120%";
  });
  //event listener for prev,next
  previous.addEventListener("click", (e) => {
    console.log("prev clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    console.log(index);
    let prevsong = songs[index == 0 ? 0 : index - 1];
    playmusic(prevsong);
  });
  next.addEventListener("click", (e) => {
    console.log("next clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    let nextsong = songs[(index + 1) % songs.length];
    playmusic(nextsong);
  });

  //event listener to range of volume
  let range = document.querySelector(".range");
  range.getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  //mute and unmute the volume button
  let volume = document.querySelector(".volume img").addEventListener("click",(e)=>{
        if(e.target.src.includes("volume-high.svg")){
            // console.log(e.target.src);
            e.target.src="img/volume-mute.svg"
            currentsong.volume = 0;
            range.getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src="img/volume-high.svg"
            currentsong.volume = 0.1;
            range.getElementsByTagName("input")[0].value=10;
        }
  })
   
}
main();