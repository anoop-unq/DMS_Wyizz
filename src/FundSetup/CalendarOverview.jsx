import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getLocalYYYYMMDD, convertTo24H } from "../utils/dateHelpers";

const CalendarOverview = ({
  mainStartDate,
  mainEndDate,
  patternConfigs,
  specificDateConfigs,
  onDateClick,
  onViewDateSlots,
  onClearDayFromCalendar,
  getSlotsForDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendar = () => {
    if (!mainStartDate || !mainEndDate) return [];

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const calendar = [];

    for (let i = 0; i < firstDay; i++) calendar.push(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      const dateStr = getLocalYYYYMMDD(date);

      if (dateStr >= mainStartDate && dateStr <= mainEndDate) {
        calendar.push(date);
      } else {
        calendar.push(null);
      }
    }
    return calendar;
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));

  const calendarDates = generateCalendar();

  if (!mainStartDate || !mainEndDate) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-100">
        <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Please set campaign dates in Campaign Details (or) Above</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-lg shadow-sm transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-lg font-bold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-lg shadow-sm transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center py-2 text-sm font-medium text-gray-600 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDates.map((date, idx) => (
            <CalendarDay
              key={idx}
              date={date}
              patternConfigs={patternConfigs}
              specificDateConfigs={specificDateConfigs}
              onDateClick={onDateClick}
              onViewDateSlots={onViewDateSlots}
              onClearDayFromCalendar={onClearDayFromCalendar}
              getSlotsForDate={getSlotsForDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};



// const CalendarDay = ({
//   date,
//   patternConfigs,
//   specificDateConfigs,
//   onDateClick,
//   onViewDateSlots,
//   onClearDayFromCalendar,
//   getSlotsForDate,
// }) => {
//   if (!date) return <div className="h-28"></div>;

//   const dateStr = getLocalYYYYMMDD(date);
//   const dayOfWeek = date.getDay();
  
//   const specificConfig = specificDateConfigs.find(c => c.date === dateStr);
  
//   const patternConfig = patternConfigs.find(c => {
//     const isInRange = dateStr >= c.startDate && dateStr <= c.endDate;
//     if (!isInRange) return false;
//     if (c.type === "range" || c.pattern === "custom_range") return true;
    
//     const checks = {
//       "all_sundays": dayOfWeek === 0, "all_mondays": dayOfWeek === 1,
//       "all_tuesdays": dayOfWeek === 2, "all_wednesdays": dayOfWeek === 3,
//       "all_thursdays": dayOfWeek === 4, "all_fridays": dayOfWeek === 5,
//       "all_saturdays": dayOfWeek === 6, "all_weekends": dayOfWeek === 0 || dayOfWeek === 6,
//       "all_weekdays": dayOfWeek >= 1 && dayOfWeek <= 5,
//     };
//     return checks[c.pattern] || false;
//   });

//   const slots = getSlotsForDate(date);
//   const hasConfig = !!specificConfig || !!patternConfig;
  
//   /** * ✅ Logic to trigger "All Day" UI:
//    * Checks if slots array is empty (API all_day: true) 
//    * OR if any slot specifically covers 00:00 to 23:59
//    */
//   const isAllDay = hasConfig && (
//     slots.length === 0 || 
//     slots.some(s => (
//       // Check for 24h strings or the converted 12h equivalents
//       (s.startTime === "00:00" && s.endTime === "23:59") ||
//       (s.startTime === "12:00" && s.startPeriod === "AM" && s.endTime === "11:59" && s.endPeriod === "PM")
//     ))
//   );

//   // --- Styling Logic ---
//   let bgColor = 'bg-white border-gray-100';
//   let borderColor = 'border-gray-100';
//   let textColor = 'text-gray-400';
//   let hoverTitle = "Click to add restriction";

//   if (hasConfig) {
//     textColor = 'text-gray-800';
//     if (isAllDay) {
//       bgColor = 'bg-[#ECFEFF]'; 
//       borderColor = 'border-[#A5F3FC]';
//     } else if (specificConfig) {
//       bgColor = 'bg-[#F0FDF4]'; 
//       borderColor = 'border-[#BBF7D0]'; 
//       hoverTitle = "Edit specific day restriction";
//     } else {
//       bgColor = 'bg-[#EFF6FF]'; 
//       borderColor = 'border-[#BFDBFE]'; 
//       hoverTitle = `Edit recurring pattern: ${patternConfig.pattern.replace('all_', '')}`;
//     }
//   }

//   return (
//     <div
//       onClick={() => onDateClick(date)}
//       title={hoverTitle}
//       className={`h-28 rounded-xl border-2 ${borderColor} p-2 cursor-pointer hover:shadow-md transition-all flex flex-col ${bgColor}`}
//     >
//       <div className="flex items-center justify-between border-b border-gray-100/50 pb-1 mb-1">
//         <span className={`text-sm font-bold ${textColor}`}>
//           {date.getDate()}
//         </span>
//         {specificConfig && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onClearDayFromCalendar(date);
//             }}
//             className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-0.5 rounded"
//           >
//             <X size={14} />
//           </button>
//         )}
//       </div>
      
//       <div className="flex-1 flex flex-col justify-start space-y-1 overflow-hidden">
//         {isAllDay ? (
//           /* ✅ Render the "All Day" UI Box exactly as requested */
//           <div className="mt-1 flex items-center justify-start w-full px-2 py-1.5 bg-transparent border border-amber-200 rounded-lg">
//             <span className="text-[11px] font-semibold text-slate-500">
//               All Day
//             </span>
//           </div>
//         ) : (
//           /* Show individual time slots if not All Day */
//           slots.slice(0, 3).map((slot, i) => (
//             <div
//               key={i}
//               className={`text-[9px] font-medium px-1.5 py-0.5 rounded truncate ${
//                 slot.type === "specific"
//                   ? "bg-green-100 text-green-700 border border-green-200"
//                   : "bg-blue-100 text-blue-700 border border-blue-200"
//               }`}
//             >
//               {convertTo24H(slot.startTime, slot.startPeriod)} - {convertTo24H(slot.endTime, slot.endPeriod)}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };


const CalendarDay = ({
  date,
  patternConfigs,
  specificDateConfigs,
  onDateClick,
  onViewDateSlots,
  onClearDayFromCalendar,
  getSlotsForDate,
}) => {
  if (!date) return <div className="h-28"></div>;

  const dateStr = getLocalYYYYMMDD(date);
  const dayOfWeek = date.getDay();
  
  const specificConfig = specificDateConfigs.find(c => c.date === dateStr);
  
  const patternConfig = patternConfigs.find(c => {
    const isInRange = dateStr >= c.startDate && dateStr <= c.endDate;
    if (!isInRange) return false;
    if (c.type === "range" || c.pattern === "custom_range") return true;
    
    const checks = {
      "all_sundays": dayOfWeek === 0, "all_mondays": dayOfWeek === 1,
      "all_tuesdays": dayOfWeek === 2, "all_wednesdays": dayOfWeek === 3,
      "all_thursdays": dayOfWeek === 4, "all_fridays": dayOfWeek === 5,
      "all_saturdays": dayOfWeek === 6, "all_weekends": dayOfWeek === 0 || dayOfWeek === 6,
      "all_weekdays": dayOfWeek >= 1 && dayOfWeek <= 5,
    };
    return checks[c.pattern] || false;
  });

  const slots = getSlotsForDate(date);
  const hasConfig = !!specificConfig || !!patternConfig;
  
  const isAllDay = hasConfig && (
    slots.length === 0 || 
    slots.some(s => (
      (s.startTime === "00:00" && s.endTime === "23:59") ||
      (s.startTime === "12:00" && s.startPeriod === "AM" && s.endTime === "11:59" && s.endPeriod === "PM")
    ))
  );

  let bgColor = 'bg-white border-gray-100';
  let borderColor = 'border-gray-100';
  let textColor = 'text-gray-400';
  let hoverTitle = "Click to add restriction";

  if (hasConfig) {
    textColor = 'text-gray-800';
    if (isAllDay) {
      bgColor = 'bg-[#ECFEFF]'; 
      borderColor = 'border-[#A5F3FC]';
    } else if (specificConfig) {
      bgColor = 'bg-[#F0FDF4]'; 
      borderColor = 'border-[#BBF7D0]'; 
      hoverTitle = "Edit specific day restriction";
    } else {
      bgColor = 'bg-[#EFF6FF]'; 
      borderColor = 'border-[#BFDBFE]'; 
      hoverTitle = `Edit recurring pattern: ${patternConfig.pattern.replace('all_', '')}`;
    }
  }

  return (
    <div
      onClick={() => onDateClick(date)}
      title={hoverTitle}
      className={`h-28 rounded-xl border-2 ${borderColor} p-2 cursor-pointer hover:shadow-md transition-all flex flex-col ${bgColor}`}
    >
      <div className="flex items-center justify-between border-b border-gray-100/50 pb-1 mb-1">
        <span className={`text-sm font-bold ${textColor}`}>
          {date.getDate()}
        </span>
        {specificConfig && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearDayFromCalendar(date);
            }}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-0.5 rounded"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-start space-y-1 overflow-hidden">
        {isAllDay ? (
          <div className="mt-1 flex items-center justify-start w-full px-2 py-1.5 bg-transparent border border-amber-200 rounded-lg">
            <span className="text-[11px] font-semibold text-slate-500">
              All Day
            </span>
          </div>
        ) : (
          <>
            {/* Show first 2 slots if more than 3, otherwise show up to 3 */}
            {slots.slice(0, slots.length > 3 ? 2 : 3).map((slot, i) => (
              <div
                key={i}
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded truncate ${
                  slot.type === "specific"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                {convertTo24H(slot.startTime, slot.startPeriod)} - {convertTo24H(slot.endTime, slot.endPeriod)}
              </div>
            ))}

            {/* ✅ Added styled "+ more" box for Specific & Pattern dates */}
            {slots.length > 3 && (
             <button
  onClick={(e) => {
    e.stopPropagation();
    onViewDateSlots(date);
  }}
  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border mt-0.5 text-left w-fit shadow-sm transition-colors cursor-pointer ${
    specificConfig 
      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
      : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
  }`}
>
  + {slots.length - 2} more
</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};



export default CalendarOverview;