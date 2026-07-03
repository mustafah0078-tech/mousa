import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, Heart } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // A romantic, soothing royalty-free wedding piano piece
  const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Ensure it replays from the beginning when it ends
    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Loop playback prevented", e));
    };
    audio.addEventListener('ended', handleEnded);

    // Soft fade-in on playing
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Fade out slowly
      let currentVol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (audioRef.current && currentVol > 0.05) {
          currentVol -= 0.05;
          audioRef.current.volume = currentVol;
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = volume; // Restore standard volume setting
          }
          setIsPlaying(false);
        }
      }, 30);
    } else {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        // Fade in slowly
        let currentVol = 0;
        const fadeIn = setInterval(() => {
          if (audioRef.current && currentVol < volume) {
            currentVol += 0.05;
            audioRef.current.volume = Math.min(currentVol, volume);
          } else {
            clearInterval(fadeIn);
          }
        }, 30);
      }).catch(err => {
        console.warn("Audio play prevented by browser autoplay policy.", err);
      });
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  return (
    <div id="audio-control" className="fixed bottom-6 left-6 z-40 flex items-center gap-3 bg-white/40 backdrop-blur-md border border-border-neutral px-4 py-2 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.02)] transition-all duration-500 hover:border-gold/30">
      <button
        id="btn-toggle-audio"
        onClick={togglePlay}
        className="relative p-2 rounded-full bg-gold/5 hover:bg-gold/10 text-gold border border-gold/15 transition-colors duration-300 focus:outline-none cursor-none"
        aria-label={isPlaying ? "Mute Music" : "Play Music"}
      >
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
        </span>
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* Mini sound wave animation */}
      <div className="flex items-center gap-[3px] h-4 px-1 cursor-none" onClick={togglePlay}>
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className="w-[2px] bg-gold rounded-full transition-all duration-300"
            style={{
              height: isPlaying ? `${Math.floor(Math.random() * 12) + 4}px` : "3px",
              animation: isPlaying ? `golden-float ${1 + bar * 0.2}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-2 border-l border-border-neutral pl-3">
        <Heart size={12} className={`text-gold ${isPlaying ? 'animate-pulse' : ''}`} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-neutral">
          {isPlaying ? "Romantic Waltz" : "Muted"}
        </span>
        <input
          id="range-volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-12 h-1 bg-gold/10 rounded-lg appearance-none cursor-none accent-gold transition-all duration-300"
        />
      </div>
    </div>
  );
}
