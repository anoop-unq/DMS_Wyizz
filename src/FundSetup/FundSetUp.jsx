import React, { useState, useEffect, useCallback, useRef } from "react";

import { campaignApi, campaignDiscountApi } from "../utils/metadataApi";

import CalendarOverview from "./CalendarOverview";

import PatternModal from "./PatternModal";

import SpecificDateModal from "./SpecificDateModal";

import TimeSlotPopup from "./TimeSlotPopup";
import Swal from "sweetalert2";
import {
  getLocalYYYYMMDD,
  convertFrom24H,
  prepareFinalData,
  formatDisplayDate,
} from "../utils/dateHelpers";

import { Settings, Loader2 } from "lucide-react";

import StepHeader from "../StepReusable/Stepheader";

const FundSetup = ({
  data,

  campaignDatesFromProps,

  onUpdate,

  onNext,

  onPrevious,

  campaignId, // Passed from Step 1 (e.g., 117)

  isEditMode,

  onRefresh, // Passed from CampaignForm
}) => {
  const [patternConfigs, setPatternConfigs] = useState(
    data?.patternConfigs || []
  );

  const [specificDateConfigs, setSpecificDateConfigs] = useState(
    data?.specificDateConfigs || []
  );

  const [mainStartDate, setMainStartDate] = useState("");

  const [mainEndDate, setMainEndDate] = useState("");

  const [activeModal, setActiveModal] = useState(null);

  const [selectedDateForConfig, setSelectedDateForConfig] = useState(null);

  const [selectedDateForView, setSelectedDateForView] = useState(null);

  const [editingPattern, setEditingPattern] = useState(null);

  // Loading states

  const [isLoading, setIsLoading] = useState(false);

  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);

  const [isNextSubmitting, setIsNextSubmitting] = useState(false);

  // Store the actual Discount Rule ID (e.g. 81)

  const [actualDiscountId, setActualDiscountId] = useState(null);

  const prevDataKeyRef = useRef("");

  const hasFetchedApiDataRef = useRef(false);

  // --- 1. Sync campaign dates from Step 1 ---

  useEffect(() => {
    if (campaignDatesFromProps) {
      let startDate, endDate;

      if (typeof campaignDatesFromProps === "object") {
        if (campaignDatesFromProps.startDate !== undefined) {
          startDate = campaignDatesFromProps.startDate;
        } else if (campaignDatesFromProps.start_date) {
          startDate = campaignDatesFromProps.start_date.split("T")[0];
        }

        if (campaignDatesFromProps.endDate !== undefined) {
          endDate = campaignDatesFromProps.endDate;
        } else if (campaignDatesFromProps.end_date) {
          endDate = campaignDatesFromProps.end_date.split("T")[0];
        }
      }

      if (startDate) setMainStartDate(startDate);

      if (endDate) setMainEndDate(endDate);
    }
  }, [campaignDatesFromProps]);

  // --- 2. Fetch Discount Data ---

  // --- 2. Fetch Discount Data ---

  useEffect(() => {
    const fetchDiscountDates = async () => {
      if (campaignId && !hasFetchedApiDataRef.current) {
        console.log(`⏳ Step 5: Loading Data for Campaign ID: ${campaignId}`);

        setIsLoading(true);

        try {
          const response = await campaignDiscountApi.getById(campaignId);

          // Target response.data.discount based on your JSON structure

          const discountData = response.data.discount;

          if (discountData) {
            console.log("✅ Found Discount Rule ID:", discountData.id);

            setActualDiscountId(discountData.id);

            if (discountData.discount_dates?.length > 0) {
              const newPatternConfigs = [];

              const newSpecificDateConfigs = [];

              discountData.discount_dates.forEach((dateRule) => {
                // Extract just the YYYY-MM-DD part

                const startDate = dateRule.start_date?.split("T")[0];

                const endDate = dateRule.end_date?.split("T")[0];

                const isSingleDay = startDate === endDate;

                // Map API "discount_times" to UI "timeSlots"

                const timeSlots = (dateRule.discount_times || []).map(
                  (time) => {
                    const startConverted = convertFrom24H(
                      time.start_time || "09:00"
                    );

                    const endConverted = convertFrom24H(
                      time.end_time || "17:00"
                    );

                    return {
                      id: time.id,

                      startTime: startConverted.time,

                      startPeriod: startConverted.period,

                      endTime: endConverted.time,

                      endPeriod: endConverted.period,
                    };
                  }
                );

                // Decide if this is a specific date or a repeating pattern

                // (If start and end are same and no pattern string exists, it's specific)

                if (isSingleDay && !dateRule.pattern) {
                  newSpecificDateConfigs.push({
                    id: `specific_${dateRule.id}`,

                    date: startDate,

                    timeSlots: timeSlots,
                  });
                } else {
                  newPatternConfigs.push({
                    id: `config_${dateRule.id}`,

                    type:
                      dateRule.pattern === "custom_range" ? "range" : "pattern",

                    pattern: dateRule.pattern || "custom_range",

                    startDate: startDate,

                    endDate: endDate,

                    timeSlots: timeSlots,
                  });
                }
              });

              setPatternConfigs(newPatternConfigs);

              setSpecificDateConfigs(newSpecificDateConfigs);
            }

            hasFetchedApiDataRef.current = true;
          }
        } catch (error) {
          console.error("Error fetching discount dates:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDiscountDates();
  }, [campaignId]);

  // --- Helper: Generate Correct Payload ---

  const generateFinalData = (overridePatterns, overrideSpecifics) => {
    const pConfigs = overridePatterns || patternConfigs;

    const sConfigs = overrideSpecifics || specificDateConfigs;

    if (pConfigs.length === 0 && sConfigs.length === 0) {
      return [];
    }

    return prepareFinalData(
      pConfigs,

      sConfigs,

      mainStartDate,

      mainEndDate
    );
  };

  // --- 3. Sync to Parent (Local State Only) ---

  useEffect(() => {
    if (!onUpdate || !mainStartDate || !mainEndDate) return;

    const currentData = {
      patternConfigs,

      specificDateConfigs,

      mainStartDate,

      mainEndDate,
    };

    const currentDataKey = JSON.stringify(currentData);

    if (currentDataKey === prevDataKeyRef.current) return;

    prevDataKeyRef.current = currentDataKey;

    try {
      const finalData = generateFinalData();

      onUpdate({
        ...currentData,

        finalDiscountDates: finalData,

        id: actualDiscountId,
      });
    } catch (error) {
      console.error("Error in prepareFinalData:", error);
    }
  }, [
    patternConfigs,
    specificDateConfigs,
    mainStartDate,
    mainEndDate,
    onUpdate,
    actualDiscountId,
  ]);

  // --- Handlers ---

  const openAddPatternModal = (editConfig = null) => {
    if (!mainStartDate || !mainEndDate) {
      alert("Please set campaign dates in Step 1 first");

      return;
    }

    setEditingPattern(editConfig);

    setActiveModal("pattern");
  };

  const handleSavePattern = (configData) => {
    if (editingPattern) {
      setPatternConfigs((prev) =>
        prev.map((c) => (c.id === editingPattern.id ? configData : c))
      );
    } else {
      setPatternConfigs((prev) => [...prev, configData]);
    }

    setActiveModal(null);

    setEditingPattern(null);
  };

  const handleDateClick = (date) => {
    if (!mainStartDate || !mainEndDate) {
      alert("Please set campaign dates in Step 1 first");

      return;
    }

    const dateStr = getLocalYYYYMMDD(date);

    const isSpecific = specificDateConfigs.some((c) => c.date === dateStr);

    const isPatternCovered = patternConfigs.some(
      (c) => dateStr >= c.startDate && dateStr <= c.endDate
    );

    if (isSpecific || !isPatternCovered) {
      setSelectedDateForConfig(date);

      setActiveModal("specific");
    }
  };

  const handleSaveSpecificDate = (slots) => {
    const dateStr = getLocalYYYYMMDD(selectedDateForConfig);

    setSpecificDateConfigs((prev) => {
      const cleanConfigs = prev.filter((c) => c.date !== dateStr);

      if (slots.length > 0) {
        cleanConfigs.push({
          id: `specific_${Date.now()}`,

          date: dateStr,

          timeSlots: slots,
        });
      }

      return cleanConfigs;
    });

    setActiveModal(null);

    setSelectedDateForConfig(null);
  };

  const handleClearSpecificDate = () => {
    const dateStr = getLocalYYYYMMDD(selectedDateForConfig);

    setSpecificDateConfigs((prev) => prev.filter((c) => c.date !== dateStr));

    setActiveModal(null);

    setSelectedDateForConfig(null);
  };

  // ✅ NEW: Handle Remove (Calls API immediately if ID exists)

  const removeConfigRule = async (id, type = "pattern") => {
    let newPatterns = [...patternConfigs];

    let newSpecifics = [...specificDateConfigs];

    if (type === "pattern") {
      newPatterns = newPatterns.filter((c) => c.id !== id);
    } else {
      newSpecifics = newSpecifics.filter((c) => c.id !== id);
    }

    setPatternConfigs(newPatterns);

    setSpecificDateConfigs(newSpecifics);

    if (actualDiscountId) {
      setIsLoading(true);

      try {
        const finalData = generateFinalData(newPatterns, newSpecifics);

        const payload = { discount: { discount_dates: finalData } };

        console.log(
          `🗑️ Removing rule. Calling PUT on Discount ID: ${actualDiscountId}`
        );

        await campaignDiscountApi.update(campaignId, payload); // Use campaignId wrapper
      } catch (error) {
        console.error("Error removing discount rule from API:", error);

        alert(
          "Failed to delete the restriction from the server. Please try again."
        );

        if (type === "pattern") setPatternConfigs(patternConfigs);
        else setSpecificDateConfigs(specificDateConfigs);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ✅ SUBMIT HANDLER

  // const handleSubmit = async (action) => {
  //   if (!mainStartDate || !mainEndDate) {
  //     alert("Campaign dates are required to proceed.");

  //     return;
  //   }

  //   // Logic:

  //   // - Edit Mode: Only call API on 'update'. 'next' just navigates.

  //   // - Create Mode: 'next' calls API to save progress.

  //   let shouldCallApi = true;

  //   if (isEditMode && action === "next") {
  //     shouldCallApi = false;
  //   }

  //   if (shouldCallApi) {
  //     if (action === "update") setIsUpdateSubmitting(true);
  //     else setIsNextSubmitting(true);
  //   }

  //   try {
  //     const finalData = generateFinalData();

  //     // Update parent state

  //     onUpdate({
  //       patternConfigs,

  //       specificDateConfigs,

  //       startDate: mainStartDate,

  //       endDate: mainEndDate,

  //       finalDiscountDates: finalData,

  //       id: actualDiscountId,
  //     });

  //     if (shouldCallApi) {
  //       if (!campaignId) {
  //         throw new Error("Missing Campaign ID. Cannot update.");
  //       }

  //       // ✅ CONSTRUCT PAYLOAD

  //       const apiBody = {
  //         discount: {
  //           discount_dates: finalData,
  //         },
  //       };

  //       console.log(
  //         `✏️ PUT API call for ID: ${campaignId}`,
  //         JSON.stringify(apiBody, null, 2)
  //       );

  //       // ✅ CALL PUT API

  //       await campaignDiscountApi.update(campaignId, apiBody);

  //       if (action === "update") {
  //         console.log("✅ Step 5 Updated.");

  //         if (onRefresh) await onRefresh();
  //       }
  //     }

  //     if (action === "next") {
  //       onNext();
  //     }
  //   } catch (error) {
  //     console.error("Error updating discount dates:", error);

  //     alert(`Error updating restrictions: ${error.message}`);
  //   } finally {
  //     setIsUpdateSubmitting(false);

  //     setIsNextSubmitting(false);
  //   }
  // };

  const handleSubmit = async (action) => {
    if (!mainStartDate || !mainEndDate) {
      return Swal.fire({
        icon: "warning",
        title: "Dates Required",
        text: "Campaign dates are required to proceed.",
        background: "#FFFFFF",
        confirmButtonColor: "#7747EE",
      });
    }

    // Determine if we need to call the API
    let shouldCallApi = true;
    if (isEditMode && action === "next") {
      shouldCallApi = false;
    }

    if (shouldCallApi) {
      if (action === "update") setIsUpdateSubmitting(true);
      else setIsNextSubmitting(true);
    }

    try {
      const finalData = generateFinalData();

      // Update parent local state
      onUpdate({
        patternConfigs,
        specificDateConfigs,
        startDate: mainStartDate,
        endDate: mainEndDate,
        finalDiscountDates: finalData,
        id: actualDiscountId,
      });

      if (shouldCallApi) {
        if (!campaignId) throw new Error("Missing Campaign ID.");

        const apiBody = {
          discount: {
            discount_dates: finalData,
          },
        };

        // API Call
        await campaignDiscountApi.update(campaignId, apiBody);

        // ✅ Success Alert
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: action === "update" 
            ? "Time restrictions updated successfully." 
            : "Time restrictions saved successfully.",
          background: "#FFFFFF",
          color: "#1e293b",
          confirmButtonColor: "#10B981",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onRefresh) await onRefresh();
      }

      if (action === "next") {
        onNext();
      }
    } catch (error) {
      console.error("Error updating discount dates:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error updating restrictions: ${error.message}`,
        background: "#FFFFFF",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };

  // ... (getSlotsForDate function remains unchanged) ...

  const getSlotsForDate = (date) => {
    if (!date) return [];

    const dateStr = getLocalYYYYMMDD(date);

    const dayOfWeek = date.getDay();

    const specific = specificDateConfigs.find((c) => c.date === dateStr);

    if (specific) {
      return specific.timeSlots.map((s) => ({ ...s, type: "specific" }));
    }

    const patternSlots = [];

    patternConfigs.forEach((c) => {
      const isDateInRange = dateStr >= c.startDate && dateStr <= c.endDate;

      if (!isDateInRange) return;

      let match = false;

      if (c.type === "range" || c.pattern === "custom_range") {
        match = true;
      } else if (c.type === "pattern") {
        const patternChecks = {
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

        match = patternChecks[c.pattern] || false;
      }

      if (match) {
        const label =
          c.pattern === "custom_range"
            ? "All Days"
            : c.pattern.replace("all_", "").replace("_", " ");

        patternSlots.push(
          ...c.timeSlots.map((s) => ({ ...s, type: "pattern", label }))
        );
      }
    });

    return patternSlots;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <StepHeader step={5} totalSteps={9} title="Time Restrictions" />

      {/* Date Controls */}

      {mainStartDate && mainEndDate && (
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-end bg-[#F8F9FC] p-4 rounded-xl border border-gray-100">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Campaign Start Date
            </label>

            <input
              type="text"
              value={formatDisplayDate(mainStartDate)}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />

            <p className="text-xs text-gray-500 mt-1">Set in Step 1</p>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Campaign End Date
            </label>

            <input
              type="text"
              value={formatDisplayDate(mainEndDate)}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />

            <p className="text-xs text-gray-500 mt-1">Set in Step 1</p>
          </div>

          <div>
            <button
              onClick={() => openAddPatternModal()}
              className="h-[42px] px-5 bg-white border border-[#7747EE] text-[#7747EE] rounded-lg text-sm font-medium hover:bg-[#F4F2FF] transition-colors flex items-center gap-2 shadow-sm"
              disabled={!mainStartDate || !mainEndDate}
            >
              <Settings className="w-4 h-4" /> Add Restriction
            </button>
          </div>
        </div>
      )}

      {/* Active Restrictions */}

      {(patternConfigs.length > 0 || specificDateConfigs.length > 0) && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Active Restrictions
          </h4>

          <div className="flex flex-wrap gap-2 p-3 border border-gray-100 rounded-xl bg-[#F8F9FC] max-h-[85px] overflow-y-auto">
            {patternConfigs.map((c) => (
              <PatternConfigItem
                key={c.id}
                config={c}
                onEdit={() => openAddPatternModal(c)}
                onRemove={() => removeConfigRule(c.id, "pattern")}
              />
            ))}

            {specificDateConfigs.map((c) => (
              <SpecificDateConfigItem
                key={c.id}
                config={c}
                onRemove={() => removeConfigRule(c.id, "specific")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}

      <CalendarOverview
        mainStartDate={mainStartDate}
        mainEndDate={mainEndDate}
        patternConfigs={patternConfigs}
        specificDateConfigs={specificDateConfigs}
        onDateClick={handleDateClick}
        onViewDateSlots={setSelectedDateForView}
        onClearDayFromCalendar={(date) => {
          const dateStr = getLocalYYYYMMDD(date);

          const config = specificDateConfigs.find((c) => c.date === dateStr);

          if (config) removeConfigRule(config.id, "specific");
        }}
        getSlotsForDate={getSlotsForDate}
      />

      {/* Modals remain the same... */}

      {activeModal === "specific" && selectedDateForConfig && (
        <SpecificDateModal
          date={selectedDateForConfig}
          initialSlots={
            specificDateConfigs.find(
              (c) => c.date === getLocalYYYYMMDD(selectedDateForConfig)
            )?.timeSlots || []
          }
          onClose={() => setActiveModal(null)}
          onSave={handleSaveSpecificDate}
          onClear={handleClearSpecificDate}
        />
      )}

      {activeModal === "pattern" && (
        <PatternModal
          onClose={() => {
            setActiveModal(null);

            setEditingPattern(null);
          }}
          onSave={handleSavePattern}
          campaignStartDate={mainStartDate}
          campaignEndDate={mainEndDate}
          editData={editingPattern}
          existingConfigs={patternConfigs}
        />
      )}

      {selectedDateForView && (
        <TimeSlotPopup
          date={selectedDateForView}
          timeSlots={getSlotsForDate(selectedDateForView)}
          onClose={() => setSelectedDateForView(null)}
        />
      )}

      {/* Navigation */}

     <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex justify-between items-center">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={onPrevious}
          disabled={isUpdateSubmitting || isNextSubmitting}
          className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] disabled:opacity-50"
        >
          <span className="flex justify-center items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </span>
        </button>

        <div className="flex gap-3">
          {/* UPDATE BUTTON WITH SPIN */}
          {isEditMode && (
            <button
              onClick={() => handleSubmit("update")}
              disabled={isUpdateSubmitting || isNextSubmitting || isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
            >
              {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdateSubmitting ? "Updating..." : "Update"}
            </button>
          )}

          {/* NEXT BUTTON WITH SPIN */}
          <button
            onClick={() => handleSubmit("next")}
            disabled={isUpdateSubmitting || isNextSubmitting || isLoading}
            className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center disabled:opacity-70"
          >
            {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isNextSubmitting ? "Saving..." : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ... PatternConfigItem and SpecificDateConfigItem ...

const PatternConfigItem = ({ config, onEdit, onRemove }) => {
  const patternLabel =
    config.pattern === "custom_range"
      ? `All Days (${formatDisplayDate(
          config.startDate
        )} to ${formatDisplayDate(config.endDate)})`
      : `${config.pattern} (${formatDisplayDate(
          config.startDate
        )} to ${formatDisplayDate(config.endDate)})`;

  const slotCount = config.timeSlots?.length || 0;

  return (
    <div
      className="flex items-center gap-2 bg-white border border-blue-100 px-3 py-1.5 rounded-lg text-xs text-blue-700 shadow-sm hover:bg-blue-50 cursor-pointer"
      onClick={onEdit}
    >
      <span className="font-medium">
        {patternLabel}{" "}
        {slotCount > 0 && `(${slotCount} slot${slotCount > 1 ? "s" : ""})`}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();

          onRemove();
        }}
        className="hover:text-red-500 p-0.5 rounded-full hover:bg-gray-50"
      >
        ✕
      </button>
    </div>
  );
};

const SpecificDateConfigItem = ({ config, onRemove }) => (
  <div className="flex items-center gap-2 bg-white border border-green-100 px-3 py-1.5 rounded-lg text-xs text-green-700 shadow-sm">
    <span className="font-medium">
      {formatDisplayDate(config.date)}{" "}
      {config.timeSlots.length > 0 &&
        `(${config.timeSlots.length} slot${
          config.timeSlots.length > 1 ? "s" : ""
        })`}
    </span>

    <button
      onClick={onRemove}
      className="hover:text-red-500 p-0.5 rounded-full hover:bg-gray-50"
    >
      ✕
    </button>
  </div>
);

export default FundSetup;
