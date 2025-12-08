import React from "react";
import { Clock } from "lucide-react";

const TimeInputBlock = ({ label, time, period, onTimeChange, onPeriodChange }) => (
  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex flex-col focus-within:border-[#7747EE] focus-within:bg-white">
    <label className="text-[10px] text-gray-500 font-medium mb-0.5">
      {label}
    </label>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          placeholder="09:00"
          className="w-12 bg-transparent text-sm font-medium text-gray-900 outline-none"
        />
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <Clock className="w-4 h-4 text-gray-400" />
    </div>
  </div>
);

export default TimeInputBlock;