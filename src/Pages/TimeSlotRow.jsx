import React from "react";
import { Trash2 } from "lucide-react";
import TimeInputBlock from "./TimeInputBlock";

const TimeSlotRow = ({ slot, index, onChange, onRemove }) => (
  <div className="flex items-center gap-4 mb-4">
    <span className="text-sm font-medium text-gray-700 w-12 pt-2">
      Slot {index + 1}
    </span>
    <TimeInputBlock
      label="Start Time"
      time={slot.startTime}
      period={slot.startPeriod}
      onTimeChange={(val) => onChange(slot.id, "startTime", val)}
      onPeriodChange={(val) => onChange(slot.id, "startPeriod", val)}
    />
    <TimeInputBlock
      label="End Time"
      time={slot.endTime}
      period={slot.endPeriod}
      onTimeChange={(val) => onChange(slot.id, "endTime", val)}
      onPeriodChange={(val) => onChange(slot.id, "endPeriod", val)}
    />
    <button
      onClick={() => onRemove(slot.id)}
      className="mt-2 text-red-500 hover:bg-red-50 p-2 rounded-lg"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

export default TimeSlotRow;