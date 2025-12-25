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
        <p className="text-gray-500 font-medium">Please set campaign dates in Campaign Details</p>
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

// --- Updated Calendar Day Component ---
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
  
  // 1. Check if configured as a specific date
  const specificConfig = specificDateConfigs.find(c => c.date === dateStr);
  
  // 2. Check if covered by any pattern
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
  const isAllDay = hasConfig && slots.length === 0;

  // --- Logic for Colors ---
  let bgColor = 'bg-white border-gray-100';
  let borderColor = 'border-gray-100';
  let textColor = 'text-gray-400';

  if (hasConfig) {
    textColor = 'text-gray-800';
    if (isAllDay) {
      // ✅ "All Day" Style (Light Amber/Orange)
      bgColor = 'bg-[#ECFEFF]'; 
  borderColor = 'border-[#A5F3FC]';
    } else if (specificConfig) {
      // Timed Specific (Green)
      bgColor = 'bg-[#F0FDF4]'; 
      borderColor = 'border-[#BBF7D0]'; 
    } else {
      // Timed Pattern (Blue)
      bgColor = 'bg-[#EFF6FF]'; 
      borderColor = 'border-[#BFDBFE]'; 
    }
  }

  return (
    <div
      onClick={() => onDateClick(date)}
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
      
      <div className="flex-1 space-y-1 overflow-hidden">
        {isAllDay ? (
          // ✅ Show "All Day" label if configuration exists but no slots
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500  px-1.5 py-1 rounded border border-amber-200/50">

            All Day
          </div>
        ) : (
          slots.slice(0, 3).map((slot, i) => (
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
          ))
        )}
      </div>
      
      {!isAllDay && slots.length > 3 && (
        <div
          onClick={(e) => { e.stopPropagation(); onViewDateSlots(date); }}
          className="mt-1 text-[10px] text-[#7747EE] font-bold bg-[#EFEFFD] text-center rounded py-0.5 hover:bg-[#7747EE] hover:text-white transition-colors"
        >
          + {slots.length - 3} More
        </div>
      )}
    </div>
  );
};

export default CalendarOverview;