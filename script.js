
const songs = [
  {
    title: "Addison",
    artist: "Addison Rae",
    cover: "addison.jpg",
    src: "addison.mp3",  
  },
  {
    title: "I Barely Know Her",
    artist: "Sombr",
    cover: "barely.jpg",
    src: "barely.mp3",
  },
  {
    title: "Wishbone",
    artist: "Conan Gray",
    cover: "wishbone.jpg",
    src: "wishbone.mp3",
  },
  {
    title: "Vie",
    artist: "Doja Cat",
    cover: "doja.jpg",
    src: "doja.mp3",
  },
  {
    title: "KARMA",
    artist: "Stray Kids",
    cover: "karma.jpg",
    src: "karma.mp3",
  },
];

let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();

const playerBar      = document.getElementById("player-bar");
const playerCover    = document.getElementById("player-cover");
const playerTitle    = document.getElementById("player-title");
const playerArtist   = document.getElementById("player-artist");
const btnPlayPause   = document.getElementById("btn-play-pause");
const btnPrev        = document.getElementById("btn-prev");
const btnNext        = document.getElementById("btn-next");
const progressBar    = document.getElementById("progress-bar");
const progressFill   = document.getElementById("progress-fill");
const currentTimeEl  = document.getElementById("current-time");
const durationEl     = document.getElementById("duration");
const volumeSlider   = document.getElementById("volume-slider");
const btnMute        = document.getElementById("btn-mute");

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  playerCover.src = song.cover;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

 
  document.querySelectorAll(".element").forEach((el, i) => {
    el.classList.toggle("active-song", i % songs.length === index);
  });
}
function playSong() {
  isPlaying = true;
  audio.play().catch(() => {
    alert(`Song file not found!\nPlease add the MP3 file:\n"${songs[currentIndex].src}"\nto your project folder.`);
    isPlaying = false;
    updatePlayPauseBtn();
  });
  updatePlayPauseBtn();
  playerBar.classList.add("playing");
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  updatePlayPauseBtn();
  playerBar.classList.remove("playing");
}

function togglePlayPause() {
  isPlaying ? pauseSong() : playSong();
}

function updatePlayPauseBtn() {
  btnPlayPause.innerHTML = isPlaying
    ? '<i class="fa-solid fa-pause"></i>'
    : '<i class="fa-solid fa-play"></i>';
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  if (isPlaying) playSong();
}

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", nextSong);

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  updateMuteBtn();
});

btnMute.addEventListener("click", () => {
  audio.muted = !audio.muted;
  updateMuteBtn();
});

function updateMuteBtn() {
  const v = audio.volume;
  if (audio.muted || v === 0) {
    btnMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else if (v < 0.5) {
    btnMute.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
  } else {
    btnMute.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
}

document.querySelectorAll(".element").forEach((el, i) => {
  el.addEventListener("click", () => {
    const songIndex = i % songs.length; 
    if (songIndex === currentIndex && isPlaying) {
      pauseSong();
    } else {
      currentIndex = songIndex;
      loadSong(currentIndex);
      playSong();
    }
  });
});

btnPlayPause.addEventListener("click", togglePlayPause);
btnNext.addEventListener("click", nextSong);
btnPrev.addEventListener("click", prevSong);

loadSong(currentIndex);
audio.volume = 0.8;
volumeSlider.value = 0.8;