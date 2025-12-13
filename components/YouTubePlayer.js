'use client';

import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { format } from 'date-fns';

export default function YouTubePlayer({ 
  videoId, 
  title = "Course Video",
  description = "",
  showControls = true 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState(null);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const playerRef = useRef(null);

  // YouTube player options
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      controls: showControls ? 1 : 0,
      fs: 1,
      iv_load_policy: 3,
      disablekb: 0,
      cc_load_policy: 0,
      cc_lang_pref: 'en'
    },
  };

  // Handle player ready event
  const onReady = (event) => {
    setPlayer(event.target);
    playerRef.current = event.target;
    
    // Get initial duration
    const dur = event.target.getDuration();
    setDuration(dur);
  };

  // Handle state change
  const onStateChange = (event) => {
    const state = event.data;
    
    switch(state) {
      case YouTube.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case YouTube.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
      case YouTube.PlayerState.ENDED:
        setIsPlaying(false);
        setCurrentTime(0);
        break;
    }
  };

  // Update current time
  useEffect(() => {
    let interval;
    
    if (isPlaying && player) {
      interval = setInterval(() => {
        if (player && player.getCurrentTime) {
          const time = player.getCurrentTime();
          setCurrentTime(time);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, player]);

  // Player control functions
  const playVideo = () => {
    if (player) {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  const seekTo = (time) => {
    if (player) {
      player.seekTo(time, true);
      setCurrentTime(time);
    }
  };

  const setVideoVolume = (value) => {
    if (player) {
      player.setVolume(value);
      setVolume(value);
    }
  };

  const setPlaybackSpeed = (speed) => {
    if (player) {
      player.setPlaybackRate(speed);
      setPlaybackRate(speed);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current && playerRef.current.getIframe) {
      const iframe = playerRef.current.getIframe();
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const percentage = clickPosition / progressBarWidth;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Video Container */}
      <div className="relative pt-[56.25%] bg-black"> {/* 16:9 Aspect Ratio */}
        <div className="absolute top-0 left-0 w-full h-full">
          <YouTube
            // videoId={videoId}
            videoId={'nD5SAX7EJAc'}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            className="w-full h-full"
          />
        </div>
        
        {/* Custom Controls Overlay */}
        {!showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info & Advanced Controls */}
      <div className="p-6 bg-gray-800">
        {/* Video Title & Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          {description && (
            <p className="text-gray-300 text-sm">{description}</p>
          )}
        </div>

        {/* Custom Progress Bar */}
        <div className="mb-6">
          <div 
            className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-2"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Playback Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Playback Controls</h3>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => seekTo(currentTime - 10)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ↶ 10s
              </button>
              
              <button
                onClick={togglePlay}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={() => seekTo(currentTime + 10)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                10s ↷
              </button>
              
              <button
                onClick={() => seekTo(0)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Restart
              </button>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Volume</span>
                <span className="text-blue-400 font-mono">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVideoVolume(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
            </div>
          </div>

          {/* Playback Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Playback Settings</h3>
            
            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-gray-300 block">Playback Speed</label>
              <div className="flex flex-wrap gap-2">
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      playbackRate === speed 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Settings */}
            <div className="space-y-2">
              <label className="text-gray-300 block">Quality</label>
              <div className="flex flex-wrap gap-2">
                {['auto', '144p', '240p', '360p', '480p', '720p', '1080p'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      quality === q 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Features */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                  <span>Fullscreen</span>
                </button>
                
                <a
                  href={`https://youtu.be/${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}