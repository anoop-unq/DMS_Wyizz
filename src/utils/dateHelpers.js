// utils/dateHelpers.js
export const convertTo24H = (time, period) => {
  if (!time) return "";
  let [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  if (isNaN(hour) || isNaN(parseInt(minutes, 10))) return "";
  
  if (period === "PM" && hour !== 12) hour += 12;
  else if (period === "AM" && hour === 12) hour = 0;
  
  return `${hour.toString().padStart(2, "0")}:${minutes}`;
};

export const convertFrom24H = (time24) => {
  if (!time24) return { time: "09:00", period: "AM" };
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  let period = "AM";
  let hour12 = hour;

  if (hour >= 12) {
    period = "PM";
    if (hour > 12) hour12 = hour - 12;
  }
  if (hour === 0) hour12 = 12;

  return {
    time: `${hour12.toString().padStart(2, "0")}:${minutes}`,
    period: period,
  };
};

export const getLocalYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');
};

export const isRangeOverlap = (startA, endA, startB, endB) => {
  const dateAStart = new Date(startA);
  const dateAEnd = new Date(endA);
  const dateBStart = new Date(startB);
  const dateBEnd = new Date(endB);
  return dateAStart <= dateBEnd && dateAEnd >= dateBStart;
};

export const checkTimeSlotOverlap = (slots) => {
  const timeRanges = slots.map((slot, index) => {
    const start24 = convertTo24H(slot.startTime, slot.startPeriod);
    const end24 = convertTo24H(slot.endTime, slot.endPeriod);

    if (!start24 || !end24) return null;

    const [startHours, startMinutes] = start24.split(':').map(Number);
    const [endHours, endMinutes] = end24.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    if (startTotalMinutes >= endTotalMinutes) {
      return { error: `Slot ${index + 1} End Time must be after Start Time.`, index };
    }
    
    return { start: startTotalMinutes, end: endTotalMinutes, index };
  }).filter(r => r !== null);
  
  const innerError = timeRanges.find(r => r.error);
  if (innerError) return innerError.error;

  timeRanges.sort((a, b) => a.start - b.start);

  for (let i = 0; i < timeRanges.length - 1; i++) {
    const current = timeRanges[i];
    const next = timeRanges[i + 1];

    if (current.end > next.start) {
      return `Time slot ${current.index + 1} overlaps with slot ${next.index + 1}.`;
    }
  }

  return null;
};

// utils/dateHelpers.js

// ... (keep convertTo24H, convertFrom24H, getLocalYYYYMMDD, formatDisplayDate, etc. exactly as they are)

export const prepareFinalData = (patternConfigs, specificDateConfigs, mainStartDate, mainEndDate) => {
  if (!mainStartDate || !mainEndDate) return [];

  const apiRules = [];

  const getISODateStart = (dateStr) => `${dateStr}T00:00:00.000Z`;
  const getISODateEnd = (dateStr) => `${dateStr}T23:59:59.999Z`;

  const timeslotToApiFormat = (s) => ({
    start_time: convertTo24H(s.startTime, s.startPeriod) || "09:00",
    end_time: convertTo24H(s.endTime, s.endPeriod) || "17:00",
  });

  // Create a loop to check every single day in the campaign range
  const start = new Date(mainStartDate);
  const end = new Date(mainEndDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = getLocalYYYYMMDD(d);
    const dayOfWeek = d.getDay();

    // 1. Check for Specific Date first (overrides patterns)
    const specific = specificDateConfigs.find((c) => c.date === dateStr);
    if (specific) {
      apiRules.push({
        start_date: getISODateStart(dateStr),
        end_date: getISODateEnd(dateStr),
        all_day: false,
        discount_times: specific.timeSlots.map(timeslotToApiFormat),
      });
      continue; // Move to next day
    }

    // 2. Check if this day matches any active pattern configs
    // We only take the first matching pattern for simplicity (matching your UI logic)
    const activePattern = patternConfigs.find((c) => {
      const isInRange = dateStr >= c.startDate && dateStr <= c.endDate;
      if (!isInRange) return false;

      if (c.pattern === "custom_range") return true;

      const checks = {
        all_sundays: dayOfWeek === 0,
        all_mondays: dayOfWeek === 1,
        all_tuesdays: dayOfWeek === 2,
        all_wednesdays: dayOfWeek === 3,
        all_thursdays: dayOfWeek === 4,
        all_fridays: dayOfWeek === 5,
        all_saturdays: dayOfWeek === 6,
        all_weekends: dayOfWeek === 0 || dayOfWeek === 6,
        all_weekdays: dayOfWeek >= 1 && dayOfWeek <= 5,
      };
      return checks[c.pattern] || false;
    });

    if (activePattern) {
      apiRules.push({
        start_date: getISODateStart(dateStr),
        end_date: getISODateEnd(dateStr),
        all_day: false,
        discount_times: activePattern.timeSlots.map(timeslotToApiFormat),
      });
    }
  }

  // If no restrictions are added, send the whole campaign range as "all day" restricted
  if (apiRules.length === 0) {
    return [
      {
        start_date: getISODateStart(mainStartDate),
        end_date: getISODateEnd(mainEndDate),
        all_day: true,
        discount_times: [],
      },
    ];
  }

  return apiRules;
};