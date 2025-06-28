
import { useState } from "react";
import CameraCapture from "@/components/CameraCapture";
import GoalInput from "@/components/GoalInput";
import ImageGeneration from "@/components/ImageGeneration";
import VisionGallery from "@/components/VisionGallery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Target, Sparkles, Eye } from "lucide-react";

export interface GeneratedVision {
  id: string;
  imageUrl: string;
  goal: string;
  timestamp: Date;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'capture' | 'goal' | 'generate' | 'gallery'>('capture');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [userGoal, setUserGoal] = useState<string>("");
  const [generatedVisions, setGeneratedVisions] = useState<GeneratedVision[]>([]);

  const handlePhotoCapture = (photoUrl: string) => {
    setCapturedPhoto(photoUrl);
    setCurrentStep('goal');
  };

  const handleGoalSubmit = (goal: string) => {
    setUserGoal(goal);
    setCurrentStep('generate');
  };

  const handleVisionGenerated = (vision: GeneratedVision) => {
    setGeneratedVisions(prev => [vision, ...prev]);
    setCurrentStep('gallery');
  };

  const resetFlow = () => {
    setCapturedPhoto(null);
    setUserGoal("");
    setCurrentStep('capture');
  };

  const steps = [
    { id: 'capture', icon: Camera, label: 'Capture Photo', active: currentStep === 'capture' },
    { id: 'goal', icon: Target, label: 'Set Goal', active: currentStep === 'goal' },
    { id: 'generate', icon: Sparkles, label: 'Generate Vision', active: currentStep === 'generate' },
    { id: 'gallery', icon: Eye, label: 'View Visions', active: currentStep === 'gallery' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Vision Board AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Capture your photo, share your dreams, and see yourself achieving your goals through AI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step.active 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <step.icon size={20} />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                    steps[index + 1].active || step.active ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'capture' && (
            <Card className="p-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Take Your Photo</h2>
                <p className="text-gray-600">Let's capture your current self to visualize your future success</p>
              </div>
              <CameraCapture onCapture={handlePhotoCapture} />
            </Card>
          )}

          {currentStep === 'goal' && capturedPhoto && (
            <Card className="p-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Share Your Goal</h2>
                <p className="text-gray-600">What future achievement would you like to visualize?</p>
              </div>
              <GoalInput 
                capturedPhoto={capturedPhoto} 
                onGoalSubmit={handleGoalSubmit}
              />
            </Card>
          )}

          {currentStep === 'generate' && capturedPhoto && userGoal && (
            <Card className="p-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generating Your Vision</h2>
                <p className="text-gray-600">Creating an AI image of you achieving: "{userGoal}"</p>
              </div>
              <ImageGeneration 
                userPhoto={capturedPhoto}
                goal={userGoal}
                onVisionGenerated={handleVisionGenerated}
              />
            </Card>
          )}

          {currentStep === 'gallery' && (
            <Card className="p-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Vision Gallery</h2>
                <p className="text-gray-600">Your AI-generated future achievements</p>
              </div>
              <VisionGallery 
                visions={generatedVisions}
                onCreateNew={resetFlow}
              />
            </Card>
          )}
        </div>

        {/* Reset Button */}
        {currentStep !== 'capture' && (
          <div className="text-center mt-8">
            <Button 
              onClick={resetFlow}
              variant="outline"
              className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
            >
              Start Over
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
