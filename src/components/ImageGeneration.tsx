
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

const ImageGeneration = ({ userPhoto, goal, onVisionGenerated }: ImageGenerationProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Preparing...");

  const createEnhancedPrompt = (goal: string): string => {
    // Create a more detailed prompt based on the goal
    const basePrompt = `Professional high-quality photograph of a successful person achieving their goal: ${goal}. `;
    const stylePrompt = "Photorealistic, professional lighting, confident expression, celebrating success, detailed facial features, high resolution, award-winning photography, cinematic composition, vibrant colors, sharp focus, professional setting";
    const qualityPrompt = " --style raw --ar 1:1 --q 2";
    
    return basePrompt + stylePrompt + qualityPrompt;
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
      // Step 1: Authentication
      setProgress(10);
      setCurrentStep("Authenticating...");
      
      const authResponse = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: apiKey
          }
        ])
      });

      if (!authResponse.ok) {
        throw new Error("Authentication failed. Please check your API key.");
      }

      setProgress(25);
      setCurrentStep("Uploading your photo...");

      // Step 2: Upload the user's photo for face reference
      const uploadResponse = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: apiKey
          },
          {
            taskType: "imageUpload",
            taskUUID: crypto.randomUUID(),
            image: userPhoto
          }
        ])
      });

      const uploadResult = await uploadResponse.json();
      const uploadedImageUUID = uploadResult.data?.find((item: any) => item.taskType === "imageUpload")?.imageUUID;

      setProgress(50);
      setCurrentStep("Generating your future vision...");

      // Step 3: Generate image with face swap
      const enhancedPrompt = createEnhancedPrompt(goal);
      console.log("Enhanced prompt:", enhancedPrompt);

      const generateResponse = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: apiKey
          },
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            positivePrompt: enhancedPrompt,
            model: "runware:100@1",
            width: 1024,
            height: 1024,
            numberResults: 1,
            outputFormat: "WEBP",
            CFGScale: 7,
            scheduler: "DPMSolverMultistepScheduler",
            steps: 25,
            seed: Math.floor(Math.random() * 1000000)
          },
          // Add face swap task if we have the uploaded image
          ...(uploadedImageUUID ? [{
            taskType: "faceSwap",
            taskUUID: crypto.randomUUID(),
            sourceImageUUID: uploadedImageUUID,
            targetImageUUID: "generated", // This will reference the generated image
            strength: 0.8
          }] : [])
        ])
      });

      setProgress(80);
      setCurrentStep("Applying your face to the vision...");

      const generateResult = await generateResponse.json();
      console.log("Generation result:", generateResult);

      if (generateResult.error || generateResult.errors) {
        throw new Error(generateResult.errorMessage || "Failed to generate image");
      }

      const generatedImage = generateResult.data?.find((item: any) => item.taskType === "imageInference" || item.taskType === "faceSwap");
      
      if (!generatedImage?.imageURL) {
        throw new Error("No image was generated");
      }

      setProgress(100);
      setCurrentStep("Complete!");

      const newVision: GeneratedVision = {
        id: crypto.randomUUID(),
        imageUrl: generatedImage.imageURL,
        goal: goal,
        timestamp: new Date()
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Your personalized vision has been generated!");
      onVisionGenerated(newVision);

    } catch (error) {
      console.error("Error generating vision:", error);
      toast.error(`Failed to generate vision: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
              To generate your personalized vision, you'll need a Runware API key. Get yours at{" "}
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

      {/* User Photo Preview */}
      <Card className="p-4 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <img 
            src={userPhoto} 
            alt="Your photo" 
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
          />
          <div>
            <h3 className="font-semibold text-gray-800">Your Photo</h3>
            <p className="text-sm text-gray-600">This will be used to create your personalized vision</p>
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
            <p className="text-sm text-gray-600">Creating your personalized vision...</p>
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
              Generate My Personalized Vision
            </>
          )}
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-green-50/50 border-green-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-green-600 mt-1" size={16} />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Enhanced AI Generation</p>
            <p>This version uses advanced prompting and face-swapping technology to create a personalized image of you achieving your specific goal.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageGeneration;
