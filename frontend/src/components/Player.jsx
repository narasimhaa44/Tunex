export default function Player({ song }) {
  return (
    <div>
      <img src={song.coverUrl} alt="cover" style={{width:120}}/>
      <div>{song.title} — {song.artist}</div>
      <audio controls src={song.audioUrl}></audio>
    </div>
  );
}
