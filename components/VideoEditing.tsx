import { GripVertical, PauseCircle, PlayCircle, Volume2, VolumeOff } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from "./ui/button";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const FPS = 30;
interface VideoMetadata {
  start: number;
  end: number;
  duration: number;
  progress: number;
  max_difference_in_progress: number;
}
const MAX_DURATION: number = 30;

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

interface VideoEditingProps {
  videoSrc: string;
  videoFile: File;
  setThumbnailURL: (url: string | null) => void;
  setFile: (file: File) => void;
  setThumbnail: (file: File | null) => void;
}

const VideoEditing = forwardRef<{ trim: () => Promise<void> }, VideoEditingProps>(
  ({ videoSrc, videoFile, setThumbnailURL, setFile, setThumbnail }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [trimingDirection, setTrimingDirection] = useState<string>("");
    const [isProgressLock, setProgressLock] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const sliderRef = useRef(null);
    const videoMetaData = useRef<VideoMetadata>({
      start: 0, end: 0, progress: 0, duration: 0, max_difference_in_progress: 0
    });
    const videoIntervalId = useRef<NodeJS.Timeout | null>(null);
    const leftTrimerRef = useRef<HTMLElement | null>(null);
    const rightTrimerRef = useRef<HTMLElement | null>(null);
    const [ffmpegLoaded, setFfmpegLoaded] = useState<boolean>(false)
    const ffmpegRef = useRef<any>(null)
    const [autoTrimNeeded, setAutoTrimNeeded] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      trim: async () => {
        if (videoRef.current && videoRef.current.duration > MAX_DURATION) {
          return await handleTrim();
        }
        return null;
      }
    }));

    useEffect(() => {
      const loadFFmpeg = async () => {
        if (ffmpegLoaded) return;
        const ffmpeg = new FFmpeg()
        ffmpegRef.current = ffmpeg;
        await ffmpeg.load();
        setFfmpegLoaded(true);
      };
      loadFFmpeg();
    }, []);

    useEffect(() => {
      if (!ffmpegLoaded || !videoFile) return;
      (async () => {
        try {
          await ffmpegRef.current!.writeFile("story.mp4", await fetchFile(videoFile));
        } catch (error) {
          console.error("Error writing file to FFmpeg:", error);
        }
      })();
    }, [ffmpegLoaded, videoFile]);

    const videoProgress = (progression: number) => {
      if (!sliderRef.current) return;
      sliderRef.current.children[0].style.left = `${progression * 100}%`;
      if (!isProgressLock) {
        setProgressLock(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = videoRef.current.duration * progression;
            videoMetaData.current.progress = progression * 100;
          }
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
          const diff = videoMetaData.current.end - videoMetaData.current.start
          const videoDuration = videoRef.current?.currentTime
          if (trimingDirection == "left") {
            if (diff > 3) {
              videoMetaData.current.start = progression * videoMetaData.current.duration
              leftTrimerRef.current.style.left = `${progression * 100}%`
            }
            if (diff > MAX_DURATION) {
              const newP = progression + videoMetaData.current.max_difference_in_progress;
              videoMetaData.current.end = (newP) * videoMetaData.current.duration
              rightTrimerRef.current.style.left = `${newP * 100}%`
            }
          }
          else if (trimingDirection == "right") {
            if (diff > 3) {
              videoMetaData.current.end = progression * videoMetaData.current.duration
              rightTrimerRef.current.style.left = `${progression * 100}%`
            }
            if (diff > MAX_DURATION) {
              const newP = progression - videoMetaData.current.max_difference_in_progress;
              videoMetaData.current.start = (newP) * videoMetaData.current.duration
              leftTrimerRef.current.style.left = `${newP * 100}%`
            }
          }
          if (videoDuration != undefined && videoDuration > videoMetaData.current.end) {
            videoProgress(videoMetaData.current.end / videoMetaData.current.duration)
          } else if (videoDuration != undefined && videoDuration < videoMetaData.current.start + 4) {
            videoProgress((videoMetaData.current.start + 4) / videoMetaData.current.duration)
          }
        }
        else {
          videoProgress(progression);
        }
      });
    };

    useEffect(() => {
      window.addEventListener("mouseup",
        () => {
          setTrimingDirection("")
          setIsDragging(false)
        }
      );
      window.addEventListener("mousedown",
        () => setIsDragging(true)
      );
      return () => {
        window.removeEventListener("mouseup",
          () => {
            setTrimingDirection("")
            setIsDragging(false)
          }
        );
        window.removeEventListener("mousedown",
          () => setIsDragging(true)
        );
      }
    }, [videoRef]);

    const handleVideoMute = () => {
      if (videoRef.current === null) return;
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
    }

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
        if (!videoRef.current) return;
        let progression = videoRef.current?.currentTime / videoRef.current.duration;
        progression = Math.max(0, Math.min(progression, 1))
        if (sliderRef.current) {
          sliderRef.current.children[0].style.left = `${progression * 100}%`;
        }
        videoMetaData.current.progress = progression * 100;
      }, 1000 / FPS)
    }

    const handleTrim = async () => {
      if (!ffmpegRef.current || !ffmpegLoaded) {
        console.error("FFmpeg is not loaded!");
        return;
      }

      const ffmpeg = ffmpegRef.current;
      const start = formatTime(videoMetaData.current.start);
      const end = formatTime(videoMetaData.current.end);


      try {
        await ffmpeg.exec([
          "-loglevel", "error",
          "-i", "story.mp4",
          "-ss", start,
          "-to", end,
          "-r", "25",
          "-crf", "35",
          "-b:v", "500k",
          "-c:v", "copy",
          "-c:a", "copy",
          "story_out.mp4",
        ]);


        const data = await ffmpeg.readFile("story_out.mp4");
        const blob = new Blob([data.buffer], { type: "video/mp4" });
        const file = new File([blob], "story_out.mp4", { type: "video/mp4" });
        setFile(file);
        const dT: number = videoMetaData.current.end - videoMetaData.current.start;
        videoMetaData.current.start = 0;
        videoMetaData.current.end = dT;
        return file;
      } catch (error) {
        console.error("Error during trimming:", error);
      }
    };

    useEffect(() => {
      if (!videoRef.current || videoRef.current.duration < 1.0 || !videoMetaData.current) return;

      const captureAndSetThumbnail = () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current!.videoWidth;
        canvas.height = videoRef.current!.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("Could not get canvas context");
          return;
        }

        ctx.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error("Failed to create blob");
              return;
            }
            const optimizedFile = new File([blob], videoFile.name.replace(/\.[^/.]+$/, ".webp"), {
              type: "image/webp",
              lastModified: Date.now(),
            });
            setThumbnail(optimizedFile);
            const thumbnailUrl = URL.createObjectURL(optimizedFile);
            setThumbnailURL(thumbnailUrl);
          },
          "image/webp",
          0.7
        );
      };

      // Capture thumbnail at 3 seconds or at the midpoint for shorter videos
      const prevTime = videoRef.current.currentTime;
      const captureTime = videoRef.current.duration <= 6 ? videoRef.current.duration / 2 : 3.0;

      videoRef.current.currentTime = captureTime;

      // Using onSeeked event to ensure the video has seeked to the correct time
      const handleSeeked = () => {
        captureAndSetThumbnail();
        videoRef.current!.currentTime = prevTime;
        videoRef.current!.removeEventListener('seeked', handleSeeked);
      };

      videoRef.current.addEventListener('seeked', handleSeeked);
    }, [videoFile, setThumbnail, setThumbnailURL]);

    return (
      <div>
        <div className="relative">
          <video
            ref={videoRef}
            src={videoSrc}
            className="rounded-xl"
            onPlaying={handleVideoPlaying}
            onPause={handleVideoPause}
            onLoadedMetadata={(e) => {
              const duration = e.target.duration;
              const end = Math.min(duration, MAX_DURATION);
              const max_difference_in_progress: number = MAX_DURATION / duration;

              videoMetaData.current = {
                start: 0,
                end,
                duration: duration,
                progress: 0,
                max_difference_in_progress
              };

              if (leftTrimerRef.current && rightTrimerRef.current) {
                const progress = 100 * (end / duration);
                rightTrimerRef.current.style.left = `${progress}%`;
              }

              // Set auto trim flag if duration exceeds MAX_DURATION
              if (duration > MAX_DURATION) {
                setAutoTrimNeeded(true);
              }
            }}
            loop
          />
          <div className="absolute bottom-2 left-2 w-[96%] flex justify-between items-center">
            <span onClick={handleVideoToggle} >
              {isPlaying ? <PauseCircle /> : <PlayCircle />}
            </span>
            <span onClick={handleVideoMute} className="">
              {isMuted ? <VolumeOff /> : <Volume2 />}
            </span>
          </div>
        </div>
        <div
          className="w-full h-8 rounded-sm bg-blue-600 mt-4 relative overflow-hidden"
          ref={sliderRef}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute w-1 h-full bg-white rounded-sm top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <div id="Trimming" className="absolute w-full h-full">
            <span
              dir="ltr"
              className="h-full w-2 absolute left-0 bg-white rounded-s-sm" color="black"
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
              dir="rtl"
              className="h-full w-2 absolute left-100 bg-white rounded-s-sm "
              style={{
                transform: "translateX(-100%)"
              }}
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
        {autoTrimNeeded && (
          <p className="text-yellow-500 text-sm mt-2">
            This video is longer than 30 seconds and will be automatically trimmed on upload.
          </p>
        )}
        <Button
          variant="default"
          className="mt-4"
          type="button"
          onClick={handleTrim}
        >Trim Now</Button>
      </div>
    );
  }
);

VideoEditing.displayName = "VideoEditing";

export default VideoEditing;
