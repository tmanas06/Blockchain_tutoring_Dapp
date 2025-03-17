"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
      }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

export const LearningModule = () => {
  const [progressValue, setProgressValue] = React.useState(100); // Example starting value

  const handleNextModule = () => {
    if (progressValue <= 150) {
      setProgressValue((prev) => Math.min(prev + 25, 150)); // Increment progress by 25%
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Blockchain Fundamentals</h1>
      <p>Learn the core concepts of blockchain technology</p>
      <div className="mt-4">
        <Progress value={progressValue} />
        <p className="mt-2 text-sm">{progressValue}%</p>
      </div>
      <button
        onClick={handleNextModule}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Next Module
      </button>
    </div>
  );
};
