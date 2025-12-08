// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { campaignApi } from "../utils/metadataApi";
// import CalendarOverview from "./CalendarOverview";
// import PatternModal from "./PatternModal";
// import SpecificDateModal from "./SpecificDateModal";
// import TimeSlotPopup from "./TimeSlotPopup";
// import { 
//   getLocalYYYYMMDD, 
//   convertFrom24H,
//   prepareFinalData,
//   formatDisplayDate 
// } from "../utils/dateHelpers";
// import { Settings, Loader2 } from "lucide-react";

// const FundSetup = ({
//   data,
//   campaignDatesFromProps,
//   onUpdate,
//   onNext,
//   onPrevious,
//   campaignId,
//   isEditMode,
// }) => {
//   const [patternConfigs, setPatternConfigs] = useState(data?.patternConfigs || []);
//   const [specificDateConfigs, setSpecificDateConfigs] = useState(data?.specificDateConfigs || []);
//   const [mainStartDate, setMainStartDate] = useState("");
//   const [mainEndDate, setMainEndDate] = useState("");
//   const [activeModal, setActiveModal] = useState(null);
//   const [selectedDateForConfig, setSelectedDateForConfig] = useState(null);
//   const [selectedDateForView, setSelectedDateForView] = useState(null);
//   const [editingPattern, setEditingPattern] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const prevDataKeyRef = useRef("");
//   const hasFetchedApiDataRef = useRef(false);

//   // Sync campaign dates
//   useEffect(() => {
//     if (campaignDatesFromProps) {
//       let startDate, endDate;

//       if (typeof campaignDatesFromProps === "object") {
//         if (campaignDatesFromProps.startDate !== undefined) {
//           startDate = campaignDatesFromProps.startDate;
//         } else if (campaignDatesFromProps.start_date) {
//           startDate = campaignDatesFromProps.start_date.split("T")[0];
//         }

//         if (campaignDatesFromProps.endDate !== undefined) {
//           endDate = campaignDatesFromProps.endDate;
//         } else if (campaignDatesFromProps.end_date) {
//           endDate = campaignDatesFromProps.end_date.split("T")[0];
//         }
//       }

//       if (startDate) setMainStartDate(startDate);
//       if (endDate) setMainEndDate(endDate);
//     }
//   }, [campaignDatesFromProps]);

//   // Fetch discount dates from API
//   useEffect(() => {
//     const fetchDiscountDates = async () => {
//       if (isEditMode && campaignId && !hasFetchedApiDataRef.current) {
//         try {
//           const response = await campaignApi.getDiscountById(campaignId);
//           const discountData = response.data;

//           if (discountData?.discount_dates?.length > 0) {
//             const apiDates = discountData.discount_dates;
//             const newPatternConfigs = [];
//             const newSpecificDateConfigs = [];

//             apiDates.forEach((dateRule, index) => {
//               const startDate = dateRule.start_date?.split("T")[0];
//               const endDate = dateRule.end_date?.split("T")[0];
//               const isSingleDay = startDate === endDate;

//               const timeSlots = (dateRule.discount_times || []).map((time, idx) => {
//                 const start24 = time.start_time?.substring(0, 5) || "09:00";
//                 const end24 = time.end_time?.substring(0, 5) || "17:00";
//                 const startConverted = convertFrom24H(start24);
//                 const endConverted = convertFrom24H(end24);

//                 return {
//                   id: Date.now() + idx + Math.random(),
//                   startTime: startConverted.time,
//                   startPeriod: startConverted.period,
//                   endTime: endConverted.time,
//                   endPeriod: endConverted.period,
//                 };
//               });
              
//               const pattern = dateRule.pattern || (isSingleDay ? '' : "custom_range");

//               if (isSingleDay && !pattern) {
//                 newSpecificDateConfigs.push({
//                   id: `specific_${index}_${Date.now()}`,
//                   date: startDate,
//                   timeSlots: timeSlots,
//                 });
//               } else {
//                 newPatternConfigs.push({
//                   id: `config_${index}_${Date.now()}`,
//                   type: pattern === "custom_range" ? "range" : "pattern",
//                   pattern: pattern,
//                   startDate: startDate,
//                   endDate: endDate,
//                   timeSlots: timeSlots,
//                 });
//               }
//             });

//             setPatternConfigs(newPatternConfigs);
//             setSpecificDateConfigs(newSpecificDateConfigs);
//             hasFetchedApiDataRef.current = true;
//           }
//         } catch (error) {
//           console.error("Error fetching discount dates:", error);
//         }
//       }
//     };

//     fetchDiscountDates();
//   }, [isEditMode, campaignId]);

//   // Sync to parent
//   useEffect(() => {
//     if (!onUpdate || !mainStartDate || !mainEndDate) return;

//     const currentData = {
//       patternConfigs,
//       specificDateConfigs,
//       mainStartDate,
//       mainEndDate,
//     };

//     const currentDataKey = JSON.stringify(currentData);

//     if (currentDataKey === prevDataKeyRef.current) return;
//     prevDataKeyRef.current = currentDataKey;

//     try {
//       const finalData = prepareFinalData(
//         patternConfigs,
//         specificDateConfigs,
//         mainStartDate,
//         mainEndDate
//       );

//       onUpdate({
//         ...currentData,
//         finalDiscountDates: finalData,
//       });
//     } catch (error) {
//       console.error("Error in prepareFinalData:", error);
//       onUpdate({
//         ...currentData,
//         finalDiscountDates: [],
//       });
//     }
//   }, [patternConfigs, specificDateConfigs, mainStartDate, mainEndDate, onUpdate]);

//   // Handlers
//   const openAddPatternModal = (editConfig = null) => {
//     if (!mainStartDate || !mainEndDate) {
//       alert("Please set campaign dates in Step 1 first");
//       return;
//     }
//     setEditingPattern(editConfig);
//     setActiveModal("pattern");
//   };

//   const handleSavePattern = (configData) => {
//     if (editingPattern) {
//       setPatternConfigs(prev => prev.map(c => c.id === editingPattern.id ? configData : c));
//     } else {
//       setPatternConfigs(prev => [...prev, configData]);
//     }
//     setActiveModal(null);
//     setEditingPattern(null);
//   };

//   const handleDateClick = (date) => {
//     if (!mainStartDate || !mainEndDate) {
//       alert("Please set campaign dates in Step 1 first");
//       return;
//     }
    
//     const dateStr = getLocalYYYYMMDD(date);
//     const isSpecific = specificDateConfigs.some(c => c.date === dateStr);
//     const isPatternCovered = patternConfigs.some(c => dateStr >= c.startDate && dateStr <= c.endDate);

//     if (isSpecific || !isPatternCovered) {
//       setSelectedDateForConfig(date);
//       setActiveModal("specific");
//     }
//   };

//   const handleSaveSpecificDate = (slots) => {
//     const dateStr = getLocalYYYYMMDD(selectedDateForConfig);
    
//     setSpecificDateConfigs(prev => {
//       const cleanConfigs = prev.filter(c => c.date !== dateStr);
//       if (slots.length > 0) {
//         cleanConfigs.push({
//           id: `specific_${Date.now()}`,
//           date: dateStr,
//           timeSlots: slots,
//         });
//       }
//       return cleanConfigs;
//     });
//     setActiveModal(null);
//     setSelectedDateForConfig(null);
//   };

//   const handleClearSpecificDate = () => {
//     const dateStr = getLocalYYYYMMDD(selectedDateForConfig);
//     setSpecificDateConfigs(prev => prev.filter(c => c.date !== dateStr));
//     setActiveModal(null);
//     setSelectedDateForConfig(null);
//   };

//   const removeConfigRule = (id, type = "pattern") => {
//     if (type === "pattern") {
//       setPatternConfigs(prev => prev.filter(c => c.id !== id));
//     } else {
//       setSpecificDateConfigs(prev => prev.filter(c => c.id !== id));
//     }
//   };

//   const handleUpdate = async () => {
//     if (!mainStartDate || !mainEndDate || !campaignId) {
//       alert("Campaign dates and ID are required.");
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       const finalData = prepareFinalData(
//         patternConfigs,
//         specificDateConfigs,
//         mainStartDate,
//         mainEndDate
//       );
      
//       const payload = { discount_dates: finalData };
//       await campaignApi.updateDiscount(campaignId, payload);
      
//       onUpdate({
//         patternConfigs,
//         specificDateConfigs,
//         startDate: mainStartDate,
//         endDate: mainEndDate,
//         finalDiscountDates: finalData,
//       });

//       alert("Time restrictions updated successfully.");
//     } catch (error) {
//       console.error("Error updating discount dates:", error);
//       alert(`Error updating restrictions: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (!mainStartDate || !mainEndDate) {
//       alert("Campaign dates are required to proceed.");
//       return;
//     }

//     try {
//       const finalData = prepareFinalData(
//         patternConfigs,
//         specificDateConfigs,
//         mainStartDate,
//         mainEndDate
//       );
      
//       onUpdate({
//         patternConfigs,
//         specificDateConfigs,
//         startDate: mainStartDate,
//         endDate: mainEndDate,
//         finalDiscountDates: finalData,
//       });

//       onNext();
//     } catch (error) {
//       console.error("Error preparing data:", error);
//       alert("Error preparing time restriction data.");
//     }
//   };

//   const getSlotsForDate = (date) => {
//     if (!date) return [];
//     const dateStr = getLocalYYYYMMDD(date);
//     const dayOfWeek = date.getDay();

//     const specific = specificDateConfigs.find(c => c.date === dateStr);
//     if (specific) {
//       return specific.timeSlots.map(s => ({ ...s, type: "specific" }));
//     }

//     const patternSlots = [];
//     patternConfigs.forEach(c => {
//       const isDateInRange = dateStr >= c.startDate && dateStr <= c.endDate;
//       if (!isDateInRange) return;

//       let match = false;
//       if (c.type === "range" || c.pattern === "custom_range") {
//         match = true;
//       } else if (c.type === "pattern") {
//         const patternChecks = {
//           "all_sundays": dayOfWeek === 0,
//           "all_mondays": dayOfWeek === 1,
//           "all_tuesdays": dayOfWeek === 2,
//           "all_wednesdays": dayOfWeek === 3,
//           "all_thursdays": dayOfWeek === 4,
//           "all_fridays": dayOfWeek === 5,
//           "all_saturdays": dayOfWeek === 6,
//           "all_weekends": dayOfWeek === 0 || dayOfWeek === 6,
//           "all_weekdays": dayOfWeek >= 1 && dayOfWeek <= 5,
//         };
//         match = patternChecks[c.pattern] || false;
//       }

//       if (match) {
//         const label = c.pattern === "custom_range" ? "All Days" : c.pattern.replace('all_', '').replace('_', ' ');
//         patternSlots.push(...c.timeSlots.map(s => ({ ...s, type: "pattern", label })));
//       }
//     });

//     return patternSlots;
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex gap-3 items-center">
//           <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-[#EFEFFD] text-[#7747EE] text-xs">
//             5
//           </span>
//           <h3 className="card-inside-head">Time Restrictions</h3>
//         </div>
//         <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
//           Step 5 of 6
//         </div>
//       </div>

//       {/* Date Controls */}
//       <div className="flex flex-col md:flex-row gap-6 mb-8 items-end bg-[#F8F9FC] p-4 rounded-xl border border-gray-100">
//         <div className="flex-1 w-full">
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
//             Campaign Start Date
//           </label>
//           <input
//             type="text" 
//             value={formatDisplayDate(mainStartDate)}
//             readOnly
//             className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
//           />
//           <p className="text-xs text-gray-500 mt-1">Set in Step 1</p>
//         </div>
//         <div className="flex-1 w-full">
//           <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
//             Campaign End Date
//           </label>
//           <input
//             type="text" 
//             value={formatDisplayDate(mainEndDate)}
//             readOnly
//             className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
//           />
//           <p className="text-xs text-gray-500 mt-1">Set in Step 1</p>
//         </div>
//         <div>
//           <button
//             onClick={() => openAddPatternModal()}
//             className="h-[42px] px-5 bg-white border border-[#7747EE] text-[#7747EE] rounded-lg text-sm font-medium hover:bg-[#F4F2FF] transition-colors flex items-center gap-2 shadow-sm"
//             disabled={!mainStartDate || !mainEndDate}
//           >
//             <Settings className="w-4 h-4" /> Add Restriction
//           </button>
//         </div>
//       </div>

//       {/* Active Restrictions */}
//       {(patternConfigs.length > 0 || specificDateConfigs.length > 0) && (
//         <div className="mb-6">
//           <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Restrictions</h4>
//           <div className="flex flex-wrap gap-2 p-3 border border-gray-100 rounded-xl bg-[#F8F9FC] max-h-[85px] overflow-y-auto">
//             {patternConfigs.map(c => (
//               <PatternConfigItem
//                 key={c.id}
//                 config={c}
//                 onEdit={() => openAddPatternModal(c)}
//                 onRemove={() => removeConfigRule(c.id, "pattern")}
//               />
//             ))}
//             {specificDateConfigs.map(c => (
//               <SpecificDateConfigItem
//                 key={c.id}
//                 config={c}
//                 onRemove={() => removeConfigRule(c.id, "specific")}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Calendar */}
//       <CalendarOverview
//         mainStartDate={mainStartDate}
//         mainEndDate={mainEndDate}
//         patternConfigs={patternConfigs}
//         specificDateConfigs={specificDateConfigs}
//         onDateClick={handleDateClick}
//         onViewDateSlots={setSelectedDateForView}
//         onClearDayFromCalendar={(date) => {
//           const dateStr = getLocalYYYYMMDD(date);
//           setSpecificDateConfigs(prev => prev.filter(c => c.date !== dateStr));
//         }}
//         getSlotsForDate={getSlotsForDate}
//       />

//       {/* Modals */}
//       {activeModal === "specific" && selectedDateForConfig && (
//         <SpecificDateModal
//           date={selectedDateForConfig}
//           initialSlots={
//             specificDateConfigs.find(c => c.date === getLocalYYYYMMDD(selectedDateForConfig))?.timeSlots || []
//           }
//           onClose={() => setActiveModal(null)}
//           onSave={handleSaveSpecificDate}
//           onClear={handleClearSpecificDate}
//         />
//       )}
      
//       {activeModal === "pattern" && (
//         <PatternModal
//           onClose={() => {
//             setActiveModal(null);
//             setEditingPattern(null);
//           }}
//           onSave={handleSavePattern}
//           campaignStartDate={mainStartDate}
//           campaignEndDate={mainEndDate}
//           editData={editingPattern}
//           existingConfigs={patternConfigs}
//         />
//       )}
      
//       {selectedDateForView && (
//         <TimeSlotPopup
//           date={selectedDateForView}
//           timeSlots={getSlotsForDate(selectedDateForView)}
//           onClose={() => setSelectedDateForView(null)}
//         />
//       )}

//       {/* Navigation */}
//       <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
//         <button
//           onClick={onPrevious}
//           className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           Previous
//         </button>
        
//         <div className="flex gap-3">
//           {isEditMode && (
//             <button
//               onClick={handleUpdate}
//               disabled={!mainStartDate || !mainEndDate || isLoading}
//               className="px-8 py-2.5 bg-white border border-[#7747EE] text-[#7747EE] rounded-lg text-sm font-medium hover:bg-[#F4F2FF] shadow-sm disabled:opacity-50 flex items-center gap-1"
//             >
//               {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
//             </button>
//           )}

//           <button
//             onClick={handleNext}
//             disabled={!mainStartDate || !mainEndDate || isLoading}
//             className="px-8 py-2.5 bg-[#7747EE] text-white rounded-lg text-sm font-medium hover:bg-[#6338d1] shadow-sm disabled:opacity-50"
//           >
//             Next →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Small inline components
// const PatternConfigItem = ({ config, onEdit, onRemove }) => {
//   const patternLabel = config.pattern === "custom_range"
//     ? `All Days (${formatDisplayDate(config.startDate)} to ${formatDisplayDate(config.endDate)})`
//     : `${config.pattern} (${formatDisplayDate(config.startDate)} to ${formatDisplayDate(config.endDate)})`;
//   const slotCount = config.timeSlots?.length || 0;

//   return (
//     <div
//       className="flex items-center gap-2 bg-white border border-blue-100 px-3 py-1.5 rounded-lg text-xs text-blue-700 shadow-sm hover:bg-blue-50 cursor-pointer"
//       onClick={onEdit}
//     >
//       <span className="font-medium">
//         {patternLabel} {slotCount > 0 && `(${slotCount} slot${slotCount > 1 ? "s" : ""})`}
//       </span>
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onRemove();
//         }}
//         className="hover:text-red-500 p-0.5 rounded-full hover:bg-gray-50"
//       >
//         ✕
//       </button>
//     </div>
//   );
// };

// const SpecificDateConfigItem = ({ config, onRemove }) => (
//   <div className="flex items-center gap-2 bg-white border border-green-100 px-3 py-1.5 rounded-lg text-xs text-green-700 shadow-sm">
//     <span className="font-medium">
//       {formatDisplayDate(config.date)} {config.timeSlots.length > 0 && `(${config.timeSlots.length} slot${config.timeSlots.length > 1 ? "s" : ""})`}
//     </span>
//     <button
//       onClick={onRemove}
//       className="hover:text-red-500 p-0.5 rounded-full hover:bg-gray-50"
//     >
//       ✕
//     </button>
//   </div>
// );

// export default FundSetup;