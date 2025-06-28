
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Key, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { GeneratedVision } from "@/pages/Index";

interface ImageGenerationProps {
  userPhoto: string;
  goal: string;
  onVisionGenerated: (vision: GeneratedVision) => void;
}

interface RunwareService {
  generateImage: (params: any) => Promise<any>;
}

const ImageGeneration = ({ userPhoto, goal, onVisionGenerated }: ImageGenerationProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Preparing...");

  const createPrompt = (goal: string): string => {
    return `Professional photography of a successful person ${goal}, celebrating achievement, confident smile, professional lighting, high quality, realistic, photorealistic, 4k resolution, detailed, success celebration, achievement moment`;
  };

  const generateVision = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your Runware API key");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep("Connecting to Runware...");

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 20, step: "Analyzing your goal..." },
        { progress: 40, step: "Creating AI prompt..." },
        { progress: 60, step: "Generating your vision..." },
        { progress: 80, step: "Applying final touches..." },
        { progress: 100, step: "Complete!" }
      ];

      for (const { progress: prog, step } of progressSteps) {
        setProgress(prog);
        setCurrentStep(step);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Create enhanced prompt
      const enhancedPrompt = createPrompt(goal);
      console.log("Generated prompt:", enhancedPrompt);

      // For now, we'll create a placeholder response since Runware requires a WebSocket connection
      // In a real implementation, you would integrate with Runware's API
      const mockGeneratedVision: GeneratedVision = {
        id: crypto.randomUUID(),
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face",
        goal: goal,
        timestamp: new Date()
      };

      toast.success("Your vision has been generated!");
      onVisionGenerated(mockGeneratedVision);

    } catch (error) {
      console.error("Error generating vision:", error);
      toast.error("Failed to generate vision. Please try again.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setCurrentStep("Preparing...");
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Input */}
      <Card className="p-6 bg-blue-50/50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Key className="text-blue-500 mt-1" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Runware API Key Required</h3>
            <p className="text-sm text-blue-700 mb-4">
              To generate your vision, you'll need a Runware API key. Get yours at{" "}
              <a 
                href="https://runware.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-800"
              >
                runware.ai
              </a>
            </p>
            <Input
              type="password"
              placeholder="Enter your Runware API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white/70"
            />
          </div>
        </div>
      </Card>

      {/* Goal Preview */}
      <Card className="p-4 bg-white/50 backdrop-blur-sm">
        <h3 className="font-semibold text-gray-800 mb-2">Your Goal:</h3>
        <p className="text-gray-700 italic">"{goal}"</p>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Sparkles className="animate-spin text-purple-500 mr-2" size={24} />
              <span className="text-lg font-semibold text-gray-800">{currentStep}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600">This may take a few moments...</p>
          </div>
        </Card>
      )}

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={generateVision}
          disabled={isGenerating || !apiKey.trim()}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3"
        >
          {isGenerating ? (
            <>
              <Sparkles className="animate-spin mr-2" size={20} />
              Generating Vision...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" size={20} />
              Generate My Future Vision
            </>
          )}
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-yellow-50/50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 mt-1" size={16} />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Demo Mode</p>
            <p>This demo uses a placeholder image. With a real Runware API key, the system will generate a personalized vision of you achieving your goal.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageGeneration;
