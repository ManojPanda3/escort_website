import { isDragActive, progress } from "framer-motion";
import { GripVertical, PauseCircle, PlayCircle } from "lucide-react";
import { isFloat32Array } from "node:util/types";
import { useEffect, useRef, useState } from "react";

const FPS = 30;
interface VideoMetadata {
  start: number;
  end: number;
  duration: number;
  progress: number;
}
const MAX_DURATION: number = 30;
export default function VideoEditing({ videoSrc }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [trimingDirection, setTrimingDirection] = useState<string>("");
  const [isProgressLock, setProgressLock] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sliderRef = useRef(null);
  const videoMetaData = useRef<VideoMetadata>({
    start: 0, end: 0, progress: 0, duration: 0
  });
  const videoIntervalId = useRef<NodeJS.Timeout | null>(null);
  const leftTrimerRef = useRef<HTMLElement | null>(null);
  const rightTrimerRef = useRef<HTMLElement | null>(null);

  const videoProgress = (progression: number) => {
    sliderRef.current.children[0].style.left = `${progression * 100}%`;
    if (!isProgressLock) {
      setProgressLock(true);
      setTimeout(() => {
        videoRef.current.currentTime = videoRef.current.duration * progression;
        videoMetaData.current.progress = progression * 100
        setProgressLock(false);
      }, 1000 / FPS);
    }
  }
  const handleMouseMove = (event) => {
    if (!isDragging || !sliderRef.current || !videoRef.current) return;
    requestAnimationFrame(() => {
      const { x, width } = sliderRef.current.getBoundingClientRect();
      let progression = (event.clientX - x) / width;
      progression = Math.max(0, Math.min(progression, 1));
      if (trimingDirection !== "" && leftTrimerRef.current && rightTrimerRef.current) {
        console.log("Trimming", trimingDirection)
      }
      else {
        // console.log("VideoProgress")
        videoProgress(progression);
      }
    });
  };
  useEffect(() => {
    window.addEventListener("mouseup",
      () => setIsDragging(false)
    );
    window.addEventListener("mousedown",
      () => setIsDragging(true)
    );
    return () => {
      window.removeEventListener("mouseup",
        () => setIsDragging(false)
      );
      window.removeEventListener("mousedown",
        () => setIsDragging(true)
      );
    }
  }, [videoRef]);

  const handleVideoToggle = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) videoRef.current?.play();
    else videoRef.current?.pause();
  };
  const handleVideoPause = () => {
    if (videoIntervalId.current === null) return;
    clearInterval(videoIntervalId.current)
    videoIntervalId.current = null
  }
  const handleVideoPlaying = () => {
    if (videoRef.current === null || videoIntervalId.current !== null) return;
    videoIntervalId.current = setInterval(async () => {
      if (isDragging) return;
      let progression = videoRef.current?.currentTime / videoRef.current.duration;
      console.log("Playing...")
      progression = Math.max(0, Math.min(progression, 1))
      sliderRef.current.children[0].style.left = `${progression * 100}%`;
      videoMetaData.current.progress = progression * 100;
    }, 1000 / FPS)
  }

  return (
    <div>
      <div className="relative">
        <video ref={videoRef} src={videoSrc} className="rounded-xl"
          onPlaying={handleVideoPlaying}
          onPause={handleVideoPause}
          onLoadedMetadata={(e) => {
            const duration = e.target.duration;
            const end = Math.min(duration, 30);
            videoMetaData.current = {
              start: 0,
              end,
              duration: duration,
              progress: 0,
            }
          }}
        />
        <span onClick={handleVideoToggle} className="absolute bottom-2 left-2">
          {isPlaying ? <PauseCircle /> : <PlayCircle />}
        </span>
      </div>
      <div
        className="w-full h-8 rounded-sm bg-blue-600 mt-4 relative overflow-hidden"
        ref={sliderRef}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute w-1 h-full bg-white rounded-sm top-1/2 -translate-x-1/2 -translate-y-1/2 " />
        <div id="Trimming" className="absolute w-full h-full">
          <span
            className="h-full w-2 absolute left-0 bg-white" color="black"
            ref={leftTrimerRef}
            onMouseDown={() => setTrimingDirection("left")}
            onMouseUp={() => setTrimingDirection("")}
          >
            <GripVertical
              color="black"
              className="h-full w-full"
            />
          </span>
          <span
            className="h-full w-2 absolute right-0 bg-white"
            ref={rightTrimerRef}
            onMouseDown={() => setTrimingDirection("right")}
            onMouseUp={() => setTrimingDirection("")}
          >
            <GripVertical
              color="black"
              className="h-full w-full"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
