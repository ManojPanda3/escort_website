'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Loader2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'
import { uploadToStorage } from '@/lib/storage'
import { StoryCircle } from '@/components/story-circle'
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface Story {
  url: string
  title: string
  isvideo?: boolean
}

interface StoryUploadButtonProps {
  userId: string
  stories?: Story[]
}

export function StoryUploadButton({ userId, stories = [] }: StoryUploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [processedFile, setProcessedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stories_state, setStories] = useState<Story[]>(stories)
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [ffmpegInstance, setFfmpegInstance] = useState<FFmpeg | null>(null);

  // initialize ffmpeg wasm
  const initializeFFmpeg = async () => {
    const ffmpeg = new FFmpeg();
    try {
      await ffmpeg.load();
      setFfmpegInstance(ffmpeg);
      console.log('FFmpeg loaded successfully!');

    } catch (error) {
      console.error('Error loading ffmpeg:', error);
      toast({
        title: "Error processing video",
        description: "Failed to initialize ffmpeg. Please try again.",
        variant: "destructive",
      })
    }
  };


  useEffect(() => {
    initializeFFmpeg();
  }, []);


  const processVideo = async (file: File): Promise<File> => {
    if (!ffmpegInstance) {
      throw new Error('FFmpeg is not initialized yet.');
    }
    try {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop() || 'mp4';
      const inputFileName = `input.${fileExtension}`;
      const outputFileName = `output.mp4`;

      // Write input file
      const fileData = await fetchFile(file);
      await ffmpegInstance.writeFile(inputFileName, fileData);

      // Duration check and trim
      const duration = await new Promise<number>((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          resolve(video.duration);
          video.remove();
        };
        video.onerror = (error) => reject(error);
        video.src = URL.createObjectURL(file);
      });

      // Build ffmpeg command
      const command = [
        '-i', inputFileName,
        '-c:v', 'libx264',
        '-crf', '28',
        '-preset', 'veryfast',
        '-max_muxing_queue_size', '1024',
        ...(duration > 30 ? ['-t', '30'] : []),
        '-filter:v', 'fps=30',
        '-movflags', '+faststart', // Enable streaming
        outputFileName
      ];

      // Execute command
      await ffmpegInstance.exec(command);

      // Read output file
      const outputData = await ffmpegInstance.readFile(outputFileName);

      if (!(outputData instanceof Uint8Array)) {
        throw new Error('Failed to process video: Invalid output format');
      }

      // Create processed file
      const processedFile = new File([outputData], 'processed-video.mp4', {
        type: 'video/mp4'
      });

      // Verify file size
      if (processedFile.size === 0) {
        throw new Error('Failed to process video: Output file is empty');
      }

      return processedFile;
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: "Error processing video",
        description: "There was a problem processing your video. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Failed to get canvas context'))

      const img = new Image()

      img.onload = async () => {
        let width = img.width
        let height = img.height
        const max_height = 360

        if (height > max_height) {
          width = Math.floor(width * (max_height / height))
          height = max_height
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], 'compressed-image.webp', {
              type: 'image/webp'
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        }, 'image/webp', 0.8)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setIsProcessing(true)

      try {
        const isvideo = selectedFile.type.startsWith('video/')
        let processed: File

        if (isvideo) {
          processed = await processVideo(selectedFile)
        } else if (selectedFile.type.startsWith('image/')) {
          processed = await compressImage(selectedFile)
        } else {
          throw new Error('Invalid file type')
        }

        setProcessedFile(processed)
        toast({
          title: "File processed successfully",
          description: "Your file is ready to be uploaded.",
        })
      } catch (error) {
        console.error('Error processing file:', error)
        toast({
          title: "Error processing file",
          description: "There was a problem processing your file. Please try again.",
          variant: "destructive",
        })
        setFile(null)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!processedFile) return

    setIsUploading(true)

    try {
      const isvideo = file?.type.startsWith('video/') || false
      const result = await uploadToStorage(processedFile, userId)

      if (!result.success || !result.fileUrl) {
        throw new Error('Failed to upload file')
      }

      const { error: storyError } = await supabase
        .from('story')
        .insert({
          title,
          url: result.fileUrl,
          isvideo,
          owner: userId
        })

      if (storyError) throw storyError

      setStories([...stories_state, {
        title,
        url: result.fileUrl,
        isvideo
      }])

      toast({
        title: "Story uploaded successfully",
        description: "Your story has been added and will be visible soon.",
      })

      setIsOpen(false)
      setTitle('')
      setFile(null)
      setProcessedFile(null)
    } catch (error) {
      console.error('Error uploading story:', error)
      toast({
        title: "Error uploading story",
        description: "There was a problem uploading your story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div className="">
                <div className="p-0.5 rounded-full bg-gray-700">
                  <div className="p-0.5 rounded-full bg-black">
                    <Button variant="outline" className="h-16 w-16 rounded-full flex items-center justify-center">
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Story</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="file">Upload Media</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileChange}
                    required
                    disabled={isProcessing}
                  />
                  {isProcessing && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing file...
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={isUploading || isProcessing || !processedFile}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Story'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          {stories_state.map((story, index) => (
            <StoryCircle
              key={story.title + story.url}
              url={story.url}
              title={story.title}
              isVideo={story.isvideo}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
