// import React, { useState } from "react";
// import { X, Plus, Trash2, Clock } from "lucide-react";
// import { checkTimeSlotOverlap } from "../utils/dateHelpers";

// const SpecificDateModal = ({
//   date,
//   initialSlots,
//   onClose,
//   onSave,
//   onClear,
// }) => {
//   const [slots, setSlots] = useState(initialSlots.length > 0 ? initialSlots : []);

//   const addSlot = () => {
//     setSlots([
//       ...slots,
//       {
//         id: Date.now(),
//         startTime: "09:00",
//         startPeriod: "AM",
//         endTime: "05:00",
//         endPeriod: "PM",
//       },
//     ]);
//   };

//   const updateSlot = (id, field, value) => {
//     setSlots(slots.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
//   };

//   const removeSlot = (id) => {
//     setSlots(slots.filter((s) => s.id !== id));
//   };

//   const handleClear = () => {
//     setSlots([]);
//     if (onClear) onClear();
//   };

//   const handleSave = () => {
//     const overlapError = checkTimeSlotOverlap(slots);
//     if (overlapError) {
//       alert(overlapError);
//       return;
//     }
//     onSave(slots);
//   };

//   const displayDate = date.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   }).replace(/\//g, '-');

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 pb-2">
//           <h3 className="text-lg font-normal text-gray-800">
//             Date & Time Configuration
//           </h3>
//           <button onClick={onClose}>
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>
//         <div className="px-6 border-b border-gray-100 pb-4"></div>

//         {/* Content */}
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="text-sm font-medium text-gray-900 font-semibold">
//               Date: {displayDate}
//             </div>
//             {slots.length > 0 && (
//               <button
//                 onClick={handleClear}
//                 className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 flex items-center gap-1"
//               >
//                 <Trash2 className="w-3 h-3" /> Clear All
//               </button>
//             )}
//           </div>

//           {/* Time Slots */}
//           <div className="flex items-center justify-between mb-4">
//             <label className="text-sm font-semibold text-gray-800">
//               Time Slots *
//             </label>
//             <button
//               onClick={addSlot}
//               className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-[#7747EE]"
//             >
//               <Plus className="w-4 h-4" /> Add Slot
//             </button>
//           </div>

//           <div className="bg-[#F8F9FC] rounded-xl p-4 border border-gray-100 max-h-[300px] overflow-y-auto">
//             {slots.length === 0 ? (
//               <p className="text-center text-xs text-gray-400 py-4">
//                 No slots added yet.
//               </p>
//             ) : (
//               slots.map((slot, index) => (
//                 <div key={slot.id} className="flex items-center gap-4 mb-4">
//                   <span className="text-sm font-medium text-gray-700 w-12 pt-2">
//                     Slot {index + 1}
//                   </span>
//                   <TimeInputBlock
//                     label="Start Time"
//                     time={slot.startTime}
//                     period={slot.startPeriod}
//                     onTimeChange={(val) => updateSlot(slot.id, "startTime", val)}
//                     onPeriodChange={(val) => updateSlot(slot.id, "startPeriod", val)}
//                   />
//                   <TimeInputBlock
//                     label="End Time"
//                     time={slot.endTime}
//                     period={slot.endPeriod}
//                     onTimeChange={(val) => updateSlot(slot.id, "endTime", val)}
//                     onPeriodChange={(val) => updateSlot(slot.id, "endPeriod", val)}
//                   />
//                   <button
//                     onClick={() => removeSlot(slot.id)}
//                     className="mt-2 text-red-500 hover:bg-red-50 p-2 rounded-lg"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-8 py-2 text-sm font-medium text-white bg-[#7747EE] rounded-lg hover:bg-[#6338d1]"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { X, Plus, Trash2, Clock, Info } from "lucide-react"; // Added Info icon
import { checkTimeSlotOverlap } from "../utils/dateHelpers";

const SpecificDateModal = ({
  date,
  initialSlots,
  onClose,
  onSave,
  onClear,
}) => {
  const [slots, setSlots] = useState(initialSlots.length > 0 ? initialSlots : []);

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
    setSlots(slots.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSlot = (id) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  const handleClear = () => {
    setSlots([]);
    if (onClear) onClear();
  };

  // const handleSave = () => {
  //   // Only check for overlaps if there are slots
  //   if (slots.length > 0) {
  //     const overlapError = checkTimeSlotOverlap(slots);
  //     if (overlapError) {
  //       alert(overlapError);
  //       return;
  //     }
  //   }
    
  //   // If slots are empty, onSave([]) will be called, which the payload logic handles as All Day
  //   onSave(slots);
  // };


  // Inside SpecificDateModal.js

  const handleSave = () => {
    // 1. Check for overlaps only if there are slots
    if (slots.length > 0) {
      const overlapError = checkTimeSlotOverlap(slots);
      if (overlapError) {
        alert(overlapError);
        return;
      }
    }
    
    // 2. Even if slots is [], we call onSave. 
    // This tells the parent: "This date is restricted, but for the whole day."
    onSave(slots); 
  };

  const displayDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h3 className="text-lg font-normal text-gray-800">
            Date & Time Configuration
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="px-6 border-b border-gray-100 pb-4"></div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm font-medium text-gray-900 font-semibold">
              Date: {displayDate}
            </div>
            {slots.length > 0 && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear All
              </button>
            )}
          </div>

          {/* Time Slots */}
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-gray-800">
              Time Slots
            </label>
            <button
              onClick={addSlot}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-[#7747EE]"
            >
              <Plus className="w-4 h-4" /> Add Slot
            </button>
          </div>

          <div className="bg-[#F8F9FC] rounded-xl p-4 border border-gray-100 max-h-[300px] overflow-y-auto">
            {slots.length === 0 ? (
              // ✅ Updated UI for "All Day" status
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Info size={20} />
                </div>
                <p className="text-sm font-medium text-gray-700">No time slots added</p>
                <p className="text-xs text-gray-500 mt-1">
                  This date will be applied as <strong>"All Day"</strong> restriction.
                </p>
              </div>
            ) : (
              slots.map((slot, index) => (
                <div key={slot.id} className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700 w-12 pt-2">
                    Slot {index + 1}
                  </span>
                  <TimeInputBlock
                    label="Start Time"
                    time={slot.startTime}
                    period={slot.startPeriod}
                    onTimeChange={(val) => updateSlot(slot.id, "startTime", val)}
                    onPeriodChange={(val) => updateSlot(slot.id, "startPeriod", val)}
                  />
                  <TimeInputBlock
                    label="End Time"
                    time={slot.endTime}
                    period={slot.endPeriod}
                    onTimeChange={(val) => updateSlot(slot.id, "endTime", val)}
                    onPeriodChange={(val) => updateSlot(slot.id, "endPeriod", val)}
                  />
                  <button
                    onClick={() => removeSlot(slot.id)}
                    className="mt-2 text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 text-sm font-medium text-white bg-[#7747EE] rounded-lg hover:bg-[#6338d1]"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

// ... TimeInputBlock remains the same

// Reusable TimeInputBlock component
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

export default SpecificDateModal;