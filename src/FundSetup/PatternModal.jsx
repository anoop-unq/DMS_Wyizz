import React, { useState } from "react";
import { X, Plus, ChevronRight } from "lucide-react";
import { checkTimeSlotOverlap, isRangeOverlap, formatDisplayDate } from "../utils/dateHelpers";
import TimeSlotRow from "./TimeSlotRow";

const PatternModal = ({ 
  onClose, 
  onSave, 
  campaignStartDate, 
  campaignEndDate, 
  editData, 
  existingConfigs 
}) => {
  const [selectedPattern, setSelectedPattern] = useState(editData?.pattern || "");
  const [startDate, setStartDate] = useState(editData?.startDate || campaignStartDate || "");
  const [endDate, setEndDate] = useState(editData?.endDate || campaignEndDate || "");
  const [slots, setSlots] = useState(
    editData?.timeSlots?.length > 0
      ? editData.timeSlots
      : [{
          id: Date.now(),
          startTime: "09:00",
          startPeriod: "AM",
          endTime: "05:00",
          endPeriod: "PM",
        }]
  );

  const patternOptions = [
    { value: "all_sundays", label: "All Sundays" },
    { value: "all_saturdays", label: "All Saturdays" },
    { value: "all_weekends", label: "All Weekends (Sat & Sun)" },
    { value: "all_weekdays", label: "All Weekdays (Mon-Fri)" },
    { value: "all_mondays", label: "All Mondays" },
    { value: "all_tuesdays", label: "All Tuesdays" },
    { value: "all_wednesdays", label: "All Wednesdays" },
    { value: "all_thursdays", label: "All Thursdays" },
    { value: "all_fridays", label: "All Fridays" },
  ];

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        id: Date.now(),
        startTime: "09:00",
        startPeriod: "AM",
        endTime: "05:00",
        endPeriod: "PM",
      },
    ]);
  };

  const updateSlot = (id, field, value) => {
    setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSlot = (id) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const handleSave = () => {
    // Validation
    if (!startDate || !endDate) {
      alert("Start and End dates are required");
      return;
    }

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    if (newStartDate > newEndDate) {
      alert("Start Date cannot be after End Date");
      return;
    }

    if (campaignStartDate && startDate < campaignStartDate) {
      alert("Discount Start Date cannot be before Campaign Start Date.");
      return;
    }

    if (campaignEndDate && endDate > campaignEndDate) {
      alert("Discount End Date cannot be after Campaign End Date.");
      return;
    }

    // Time slot validation
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot.startTime || !slot.endTime) {
        alert(`Please fill in valid times for Slot ${i + 1}`);
        return;
      }
    }

    const overlapError = checkTimeSlotOverlap(slots);
    if (overlapError) {
      alert(overlapError);
      return;
    }

    // Range overlap check
    const currentId = editData?.id;
    const isEditing = !!currentId;

    for (const existingConfig of existingConfigs) {
      if (isEditing && existingConfig.id === currentId) continue;
      
      const existingStart = existingConfig.startDate;
      const existingEnd = existingConfig.endDate;

      // if (isRangeOverlap(startDate, endDate)) {
      //   alert(`The selected date range overlaps with an existing restriction. Please adjust the range.`);
      //   return;
      // }
    }

    // Save
    const isPattern = !!selectedPattern;
    let configType = "range";
    if (isPattern) configType = "pattern";

    onSave({
      id: editData?.id || `config_${Date.now()}`,
      type: configType,
      pattern: isPattern ? selectedPattern : "custom_range",
      startDate: startDate,
      endDate: endDate,
      timeSlots: slots,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-2">
          <h3 className="text-lg font-normal text-gray-800">
            {editData ? "Edit Time Restriction" : "Add Time Restriction"}
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 border-b border-gray-100 pb-4"></div>

        <div className="p-6 space-y-5">
          {/* Pattern Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Pattern (Optional)
            </label>
            <div className="relative">
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#7747EE] bg-white"
              >
                <option value="">No Pattern (All Days)</option>
                {patternOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to apply to all days in the date range
            </p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#7747EE] bg-white"
                min={campaignStartDate}
                max={campaignEndDate}
              />
              <p className="text-xs text-gray-500 mt-1">
                Campaign: {formatDisplayDate(campaignStartDate)} (Min)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#7747EE] bg-white"
                min={campaignStartDate}
                max={campaignEndDate}
              />
              <p className="text-xs text-gray-500 mt-1">
                Campaign: {formatDisplayDate(campaignEndDate)} (Max)
              </p>
            </div>
          </div>
          
          {/* Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-800">Time Slots *</label>
              <button onClick={addSlot} className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-[#7747EE]">
                <Plus className="w-4 h-4" /> Add Slot
              </button>
            </div>
            
            <div className="bg-[#F8F9FC] rounded-xl p-4 border border-gray-100 max-h-[200px] overflow-y-auto">
              {slots.map((slot, index) => (
                <TimeSlotRow
                  key={slot.id}
                  slot={slot}
                  index={index}
                  onChange={updateSlot}
                  onRemove={removeSlot}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
            Cancel
          </button>
          <button onClick={handleSave} className="px-8 py-2 text-sm font-medium text-white bg-[#7747EE] rounded-lg hover:bg-[#6338d1]">
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatternModal;