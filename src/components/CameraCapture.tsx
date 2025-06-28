
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (photoUrl: string) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const photoUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(photoUrl);
    stopCamera();
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      toast.success("Photo captured successfully!");
    }
  }, [capturedPhoto, onCapture]);

  return (
    <div className="space-y-6">
      <div className="relative mx-auto max-w-md">
        <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
          {!isStreaming && !capturedPhoto && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">Ready to capture your photo?</p>
                <Button 
                  onClick={startCamera} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isLoading ? "Loading..." : "Start Camera"}
                </Button>
              </div>
            </div>
          )}
          
          {isStreaming && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          
          {capturedPhoto && (
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {isStreaming && (
        <div className="flex justify-center">
          <Button 
            onClick={capturePhoto}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full px-8"
          >
            <Camera className="mr-2" size={20} />
            Capture Photo
          </Button>
        </div>
      )}

      {capturedPhoto && (
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={retakePhoto}
            variant="outline"
            className="bg-white/50 backdrop-blur-sm hover:bg-white/70"
          >
            <RotateCcw className="mr-2" size={16} />
            Retake
          </Button>
          <Button 
            onClick={confirmPhoto}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Check className="mr-2" size={16} />
            Use This Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
