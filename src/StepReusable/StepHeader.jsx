import React from "react";

const StepHeader = ({ step, totalSteps, title }) => {
  return (
    <div className="flex items-start justify-between mb-4">
      {/* Left Side: Number + Title */}
      <div className="flex gap-2 items-center">
        <span className="w-5 h-5 flex items-center justify-center bg-[#EFEFFD] text-[#7747EE] rounded-full text-xs font-medium mb-2">
          {step}
        </span>
        <h3 className="card-inside-head">{title}</h3>
      </div>

      {/* Right Side: Step Counter */}
      <div className="text-xs text-gray-500">
        Step {step} of {totalSteps}
      </div>
    </div>
  );
};

export default StepHeader;