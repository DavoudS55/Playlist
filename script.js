const songs = [
  { title: "Your First Song", artist: "Your Friend's Playlist", src: "music/song1.mp3", cover: "images/song1.jpg" },
  { title: "Your Second Song", artist: "Your Friend's Playlist", src: "music/song2.mp3", cover: "images/song2.jpg" },
  { title: "Your Third Song", artist: "Your Friend's Playlist", src: "music/song3.mp3", cover: "images/song3.jpg" },
  { title: "Your Fourth Song", artist: "Your Friend's Playlist", src: "music/song4.mp3", cover: "images/song4.jpg" }
];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const playlist = document.getElementById("playlist");
const count = document.getElementById("count");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const muteBtn = document.getElementById("muteBtn");

let index = 0;
let shuffle = false;
let repeat = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderPlaylist() {
  playlist.innerHTML = "";
  count.textContent = `${songs.length} tracks`;

  songs.forEach((song, i) => {
    const row = document.createElement("div");
    row.className = `song ${i === index ? "active" : ""}`;
    row.innerHTML = `
      <div class="song-num">${String(i + 1).padStart(2, "0")}</div>
      <div class="song-main">
        <div class="song-name">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="song-time">▶</div>
    `;
    row.addEventListener("click", () => loadSong(i, true));
    playlist.appendChild(row);
  });
}

function loadSong(i, autoplay = false) {
  index = (i + songs.length) % songs.length;
  const song = songs[index];

  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  cover.src = song.cover;
  cover.onerror = () => {
    cover.src = "https://placehold.co/700x700/0d0d0d/e5092f?text=YOUR+PLAYLIST";
  };
  progress.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  renderPlaylist();

  if (autoplay) {
    audio.play().then(updatePlayButton).catch(updatePlayButton);
  }
}

function updatePlayButton() {
  playBtn.textContent = audio.paused ? "▶" : "Ⅱ";
}

playBtn.addEventListener("click", () => {
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  loadSong(index - 1, true);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (shuffle) {
    let next;
    do { next = Math.floor(Math.random() * songs.length); } while (songs.length > 1 && next === index);
    loadSong(next, true);
  } else {
    loadSong(index + 1, true);
  }
});

shuffleBtn.addEventListener("click", () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active", shuffle);
});

repeatBtn.addEventListener("click", () => {
  repeat = !repeat;
  repeatBtn.classList.toggle("active", repeat);
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";
});

progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100;
  currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);

audio.addEventListener("ended", () => {
  if (repeat) loadSong(index, true);
  else document.getElementById("nextBtn").click();
});

loadSong(0);
