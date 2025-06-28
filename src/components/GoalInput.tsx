
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Target, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface GoalInputProps {
  capturedPhoto: string;
  onGoalSubmit: (goal: string) => void;
}

const GoalInput = ({ capturedPhoto, onGoalSubmit }: GoalInputProps) => {
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal.trim()) {
      toast.error("Please enter your goal first!");
      return;
    }

    if (goal.trim().length < 10) {
      toast.error("Please provide a more detailed goal (at least 10 characters)");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onGoalSubmit(goal.trim());
    toast.success("Goal saved! Generating your vision...");
    setIsSubmitting(false);
  };

  const exampleGoals = [
    "Running a successful tech startup as CEO",
    "Graduating from medical school and becoming a doctor",
    "Publishing my first bestselling novel",
    "Winning an Olympic gold medal in swimming",
    "Opening my own restaurant and earning a Michelin star"
  ];

  return (
    <div className="space-y-6">
      {/* Photo Preview */}
      <div className="text-center">
        <div className="inline-block relative">
          <img
            src={capturedPhoto}
            alt="Your photo"
            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
            <Target size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Goal Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
            What's your future goal or achievement?
          </label>
          <Textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe your dream achievement in detail... (e.g., 'Running my own successful bakery with customers lined up outside')"
            className="min-h-[120px] resize-none bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {goal.length}/500 characters
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !goal.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-3"
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <>
              Generate My Vision
              <ArrowRight className="ml-2" size={16} />
            </>
          )}
        </Button>
      </form>

      {/* Example Goals */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Need inspiration? Try these examples:</h3>
        <div className="grid gap-2">
          {exampleGoals.map((example, index) => (
            <Card
              key={index}
              className="p-3 cursor-pointer hover:bg-blue-50 transition-colors bg-white/50 backdrop-blur-sm border-gray-200 hover:border-blue-300"
              onClick={() => setGoal(example)}
            >
              <p className="text-sm text-gray-700">{example}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalInput;
