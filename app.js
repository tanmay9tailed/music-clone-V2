function musicApp(songs) {
  let audioElement = new Audio("true-stories.mp3");
  // let audioElement = new Audio("https://docs.google.com/uc?export=open&id=1mkozHEBDVBwwGQj_vcEkuNavqX7uhtLT");
  const masterPlay = document.getElementById("masterPlay");
  const myProgressBar = document.getElementById("myProgressBar");
  const songItems = Array.from(document.getElementsByClassName("songItems"));
  let songDuration = audioElement.duration;
  const container = /**@type{HTMLDivElement} */ (
    document.querySelector(".container")
  );
  const playerFull =
    /**@type{HTMLElement} */ document.querySelector("#player-full");
  const playerBack = /**@type{HTMLButtonElement} */ (
    document.querySelector("#player-back")
  );
  playerBack.onclick = function () {
    container.style.display = "block";
    playerFull.style.display = "none";
  };

  const sideBar = document.getElementById("side-bar");
  const menuContainer = document.querySelector(".menu-container");
  const hambuger = document.getElementById("hamburger");
  menuContainer.addEventListener("click", (e) => e.stopImmediatePropagation())
  sideBar.addEventListener("click", () => {
    sideBar.classList.add("closing");
    setTimeout(() => {
      sideBar.classList.remove("open");
      sideBar.classList.remove("closing");
    }, 500);
    
  })
  hambuger.addEventListener("click", () => {
    sideBar.classList.add("open");
  })


  console.log(`Song Duration: ${audioElement.duration}`);

  const getSongItemNode = () =>
    /**@type{HTMLTemplateElement} */ (
      document.getElementById("songItemTemplate")
    ).content.cloneNode(true);

  const songContainer = /**@type{HTMLDivElement} */ (
    document.querySelector(".songContainer")
  );

  songs.forEach(
    ({ coverImage, songTitle, songDuration, artist, album, src }) => {
      // const songItem = getSongItemHtml(coverPath, songName, filePath);
      const songItem = getSongItemNode();
      songItem.querySelector("img").src = coverImage;
      songItem.querySelector(".songName").innerText = songTitle;
      const mins = Math.round(songDuration / 60);
      songItem.querySelector("i").innerText = `${mins}m`;
      const playButton = songItem.querySelector(".songItemPlay");
      playButton
        .addEventListener("click", function (e) {
          e.stopPropagation();
          makeAllPlay();
          e.target.innerText = "pause_circle";
          audioElement.src = src;
          audioElement.play();
          masterPlay.innerText = "pause_circle";
        });
      console.dir(songItem);
      songItem.querySelector(".songItem").addEventListener("click", (e) => {
        localStorage.setItem(
          "currentPlaying",
          JSON.stringify({
            coverImage,
            songTitle,
            songDuration,
            artist,
            album,
            src,
          })
        );
        makeAllPlay();
        audioElement.src = src;
        audioElement.play();
        setPauseButton(playButton);
        setPlayerData({
          coverImage,
          songTitle,
          songDuration,
          artist,
          album,
        });
        openPlayer();
      });

      songContainer.appendChild(songItem);
    }
  );

  masterPlay.addEventListener("click", function () {
    if (audioElement.paused || audioElement.currentTime <= 0) {
      audioElement.play();
      masterPlay.innerText = "pause_circle";
    } else {
      audioElement.pause();
      masterPlay.innerText = "play_circle";
      Array.from(document.getElementsByClassName("songItemPlay")).forEach(
        (element) => {
          element.innerText = "play_circle";
          masterPlay.innerText = "play_circle";
        }
      );
    }
  });
  audioElement.addEventListener("timeupdate", function () {
    let progress = parseInt(
      (audioElement.currentTime / audioElement.duration) * 100
    );
    myProgressBar.value = progress;
  });
  myProgressBar.addEventListener("change", function () {
    audioElement.currentTime =
      (myProgressBar.value * audioElement.duration) / 100;
  });

  const makeAllPlay = () => {
    Array.from(document.getElementsByClassName("songItemPlay")).forEach(
      (element) => {
        element.innerText = "play_circle";
        masterPlay.innerText = "play_circle";
      }
    );
  };

  function setPlayButton(element) {
    const button = element.querySelector(".songItemPlay")
    button.innerText = "play_circle";
    // audioElement.src = src;
    // audioElement.play();
    masterPlay.innerText = "play_circle";
  }

  function setPauseButton(element) {
    element.innerText = "pause_circle";
    masterPlay.innerText = "pause_circle";
  }

  function setPlayerData({
    coverImage,
    songTitle,
    songDuration,
    artist,
    album,
  }) {
    playerFull.querySelector("img").src = coverImage;
    playerFull.querySelector(".song-name").innerText = songTitle;
    playerFull.querySelector(".artist-name").innerText = artist;
    playerFull.querySelector(".album-name").innerText = album;
  }

  function openPlayer() {
    container.style.display = "none";
    playerFull.style.display = "flex";
  }
  function openList() {
    container.style.display = "block";
    playerFull.style.display = "none";
  }

  function playSong({
    coverImage,
    songTitle,
    songDuration,
    artist,
    album,
    src,
  }) {
    // Setting data for player to show
    setPlayerData({
      coverImage,
      songTitle,
      songDuration,
      artist,
      album,
    });

    // Check if selected song is playing
    if (
      !audioElement.paused &&
      !audioElement.ended &&
      !audioElement.error &&
      audioElement.currentSrc == src
    ) {
      openPlayer();
      return;
    }

    // If selected song is not playing
    
  }
}

const res = await fetch("./songs.json");

const json = await res.json();

musicApp(json);
