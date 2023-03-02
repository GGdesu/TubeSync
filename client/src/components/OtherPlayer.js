import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

function VideoPlayer() {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleSeek = (e) => {
    const seekToTime = e.target.value;
    setCurrentTime(seekToTime);
    playerRef.current.seekTo(seekToTime);
    console.log('Seek to', seekToTime)
  };

  return (
    <div>
      <ReactPlayer
        width={"100%"}
        ref={playerRef}
        onProgress={handleProgress}
        volume={0.1}
      />
      <input
        type="range"
        min={0}
        max={playerRef.current?.getDuration()}
        value={currentTime}
        onChange={handleSeek}
      />
    </div>
  );
}

export default VideoPlayer;