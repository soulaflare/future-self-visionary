
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Download, Share2, Calendar } from "lucide-react";
import { GeneratedVision } from "@/pages/Index";
import { toast } from "sonner";

interface VisionGalleryProps {
  visions: GeneratedVision[];
  onCreateNew: () => void;
}

const VisionGallery = ({ visions, onCreateNew }: VisionGalleryProps) => {
  const downloadImage = async (imageUrl: string, goal: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vision-${goal.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  const shareVision = async (vision: GeneratedVision) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Future Vision',
          text: `Check out my vision of achieving: ${vision.goal}`,
          url: vision.imageUrl,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`My vision: ${vision.goal} - ${vision.imageUrl}`);
        toast.success("Vision details copied to clipboard!");
      } catch (error) {
        toast.error("Failed to share vision");
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (visions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Visions Yet</h3>
          <p className="text-gray-600 mb-6">Create your first AI-generated vision of success!</p>
        </div>
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="mr-2" size={16} />
          Create Your First Vision
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Your Visions</h3>
          <p className="text-gray-600">{visions.length} vision{visions.length !== 1 ? 's' : ''} created</p>
        </div>
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="mr-2" size={16} />
          Create New Vision
        </Button>
      </div>

      {/* Visions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visions.map((vision) => (
          <Card key={vision.id} className="overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                src={vision.imageUrl}
                alt={`Vision: ${vision.goal}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="font-medium text-gray-800 line-clamp-2 mb-2">
                  {vision.goal}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(vision.timestamp)}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadImage(vision.imageUrl, vision.goal)}
                  className="flex-1 bg-white/50 hover:bg-white/70"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareVision(vision)}
                  className="flex-1 bg-white/50 hover:bg-white/70"
                >
                  <Share2 size={14} className="mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Keep Visualizing Your Success!</h4>
          <p className="text-gray-600">
            The more you visualize your goals, the more motivated you'll be to achieve them.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VisionGallery;
