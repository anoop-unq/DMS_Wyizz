
import React, { useEffect, useRef, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
import { getBorderClass } from "../utils/formStyles";
import Swal from "sweetalert2";
import StepHeader from "../StepReusable/Stepheader";

const BINConfig = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  campaignId,
  isEditMode,
  onRefresh,
}) => {
  const [availableSegments, setAvailableSegments] = useState([]);
  const [loadingSegments, setLoadingSegments] = useState(false);
  const [segmentsOpen, setSegmentsOpen] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [segmentRanges, setSegmentRanges] = useState({});
  
  // ✅ LOGIC MIRROR: Using segmentTokens object instead of a global array
  const [segmentTokens, setSegmentTokens] = useState({}); // e.g., { "Youth Segment": ["token1", "token2"] }

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);

  const [errors, setErrors] = useState({ segment: false });

  const segRef = useRef(null);
  const isInitialized = useRef(false);

  const formatBinRange = (binObj) => {
    if (!binObj) return "";
    return `${binObj.start_bin} - ${binObj.end_bin}`;
  };

  // const generatePayload = (
  //   currSegments = selectedSegments,
  //   currRanges = segmentRanges,
  //   currTokensMap = segmentTokens // ✅ Pull from Map
  // ) => {
  //   return currSegments.map((segName) => {
  //     const originalSeg = availableSegments.find(
  //       (s) => (s.segment_name || s.name) === segName
  //     );

  //     const masterRanges = originalSeg?.bin_ranges?.map(formatBinRange) || [];
  //     const masterTokens = (
  //       originalSeg?.apple_tokens ||
  //       originalSeg?.discount_apple_tokens ||
  //       []
  //     ).map((t) => t.token_value || t);

  //     const selectedRanges = currRanges[segName] || [];
  //     const selectedTokens = currTokensMap[segName] || []; // ✅ Segment specific

  //     const isAllBins = masterRanges.length > 0 && selectedRanges.length === masterRanges.length;
  //     const isAllTokens = masterTokens.length > 0 && selectedTokens.length === masterTokens.length;

  //     const discountBins = selectedRanges
  //       .filter((r) => r !== "N/A - N/A")
  //       .map((range) => {
  //         const [start, end] = range.split(" - ");
  //         return { start_bin: start.trim(), end_bin: end.trim() };
  //       });

  //     const discountAppleTokens = selectedTokens.map((v) => ({ token_value: v }));

  //     return {
  //       segment_id: originalSeg?.id,
  //       segment_name: segName,
  //       all_bins: isAllBins,
  //       all_tokens: isAllTokens,
  //       discount_bins: discountBins,
  //       discount_apple_tokens: discountAppleTokens,
  //     };
  //   });
  // };


  const generatePayload = (
    currSegments = selectedSegments,
    currRanges = segmentRanges,
    currTokensMap = segmentTokens
  ) => {
    return currSegments.map((segName) => {
      const originalSeg = availableSegments.find(
        (s) => (s.segment_name || s.name) === segName
      );

      const masterRanges = originalSeg?.bin_ranges?.map(formatBinRange) || [];
      const masterTokens = (
        originalSeg?.apple_tokens ||
        originalSeg?.discount_apple_tokens ||
        []
      ).map((t) => t.token_value || t);

      const selectedRanges = currRanges[segName] || [];
      const selectedTokens = currTokensMap[segName] || [];

      // Logic for All Bins
      const isAllBins = masterRanges.length > 0 && selectedRanges.length === masterRanges.length;

      // ✅ Updated Logic: If no master tokens exist, default to true
      const isAllTokens = masterTokens.length === 0 ? true : (selectedTokens.length === masterTokens.length);

      const discountBins = selectedRanges
        .filter((r) => r !== "N/A - N/A")
        .map((range) => {
          const [start, end] = range.split(" - ");
          return { start_bin: start.trim(), end_bin: end.trim() };
        });

      const discountAppleTokens = selectedTokens.map((v) => ({ token_value: v }));

      return {
        segment_id: originalSeg?.id,
        segment_name: segName,
        all_bins: isAllBins,
        all_tokens: isAllTokens, // This will be true if metadata is empty
        discount_bins: discountBins,
        discount_apple_tokens: discountAppleTokens,
      };
    });
  };

  const updateParent = (updates) => {
    const currentNames = updates.selectedSegments !== undefined ? updates.selectedSegments : selectedSegments;
    const currentRanges = updates.segmentRanges !== undefined ? updates.segmentRanges : segmentRanges;
    const currentTokensMap = updates.segmentTokens !== undefined ? updates.segmentTokens : segmentTokens;

    onUpdate({
      ...updates,
      selectedSegments: currentNames,
      segmentRanges: currentRanges,
      segmentTokens: currentTokensMap,
      finalSegmentsData: generatePayload(currentNames, currentRanges, currentTokensMap),
    });
  };

  const handleToggleAllRanges = (segName, masterRanges) => {
    setSegmentRanges((prev) => {
      const current = prev[segName] || [];
      const next = current.length === masterRanges.length ? [] : [...masterRanges];
      const updated = { ...prev, [segName]: next };
      updateParent({ segmentRanges: updated });
      return updated;
    });
  };

  // ✅ NEW TOKEN LOGIC: Mirrors handleToggleAllRanges
  const handleToggleAllTokens = (segName, masterTokens) => {
    setSegmentTokens((prev) => {
      const current = prev[segName] || [];
      const next = current.length === masterTokens.length ? [] : [...masterTokens];
      const updated = { ...prev, [segName]: next };
      updateParent({ segmentTokens: updated });
      return updated;
    });
  };

  const mapApiDataToState = (discountData) => {
    const segmentsApi = discountData.discount_segments || discountData.segments || [];
    const newSelectedSegments = [];
    const newSegmentRanges = {};
    const newSegmentTokens = {};

    segmentsApi.forEach((segment) => {
      const segName = segment.segment_name || segment.name;
      if (!newSelectedSegments.includes(segName)) newSelectedSegments.push(segName);

      const masterSegment = availableSegments.find((s) => (s.segment_name || s.name) === segName);
      
      let masterRanges = masterSegment?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
      newSegmentRanges[segName] = segment.all_bins 
        ? masterRanges 
        : (segment.discount_bins || []).map(formatBinRange);
      
      const masterTokens = (masterSegment?.apple_tokens || []).map(t => t.token_value || t);
      newSegmentTokens[segName] = segment.all_tokens
        ? masterTokens
        : (segment.discount_apple_tokens || []).map(t => t.token_value || t);
    });

    setSelectedSegments(newSelectedSegments);
    setSegmentRanges(newSegmentRanges);
    setSegmentTokens(newSegmentTokens);
  };

  useEffect(() => {
    const fetchSegments = async () => {
      setLoadingSegments(true);
      try {
        const res = await metadataApi.getSegments();
        const rows = res.data?.rows || res.data || [];
        setAvailableSegments(rows);
      } catch (err) { console.error(err); }
      finally { setLoadingSegments(false); }
    };
    fetchSegments();
  }, []);

  // ✅ SYNC FROM LOCALSTORAGE: Represents data in respective fields from finalSegmentsData
  useEffect(() => {
    if (availableSegments.length > 0 && !isInitialized.current) {
      if (data?.finalSegmentsData?.length > 0) {
        const names = [];
        const ranges = {};
        const tokensMap = {};

        data.finalSegmentsData.forEach(seg => {
          const sName = seg.segment_name;
          names.push(sName);
          ranges[sName] = (seg.discount_bins || []).map(formatBinRange);
          tokensMap[sName] = (seg.discount_apple_tokens || []).map(t => t.token_value || t);
        });

        setSelectedSegments(names);
        setSegmentRanges(ranges);
        setSegmentTokens(tokensMap);
        isInitialized.current = true;
      }
    }
  }, [availableSegments, data]);

  useEffect(() => {
    if (campaignId && availableSegments.length > 0 && !isInitialized.current) {
      const fetchStepData = async () => {
        setIsLoadingData(true);
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const d = res.data?.discount || {};
          if (d.discount_segments?.length > 0) {
            mapApiDataToState(d);
            isInitialized.current = true;
          }
        } catch (err) { console.error(err); }
        finally { setIsLoadingData(false); }
      };
      fetchStepData();
    }
  }, [campaignId, availableSegments.length]);

  const toggleSegment = (segment) => {
    setErrors({ ...errors, segment: false });

    const name = segment.segment_name || segment.name;
    const isSelected = selectedSegments.includes(name);
    let nextNames = isSelected ? selectedSegments.filter((s) => s !== name) : [...selectedSegments, name];
    
    let nextRanges = { ...segmentRanges };
    let nextTokensMap = { ...segmentTokens };

    if (isSelected) {
      delete nextRanges[name];
      delete nextTokensMap[name];
    } else {
      nextRanges[name] = segment.bin_ranges?.length ? segment.bin_ranges.map(formatBinRange) : ["N/A - N/A"];
      nextTokensMap[name] = (segment.apple_tokens || []).map(t => t.token_value || t);
    }

    setSelectedSegments(nextNames);
    setSegmentRanges(nextRanges);
    setSegmentTokens(nextTokensMap);

    updateParent({ 
        selectedSegments: nextNames, 
        segmentRanges: nextRanges, 
        segmentTokens: nextTokensMap 
    });
  };

  // const handleSubmit = async (action) => {
  //   if (selectedSegments.length === 0) {
  //     setErrors({ ...errors, segment: true });
  //     return Swal.fire({ icon: "warning", title: "Selection Required", text: "Please select at least one segment." });
  //   }

  //   for (const segName of selectedSegments) {
  //     const ranges = segmentRanges[segName] || [];
  //     const tks = segmentTokens[segName] || [];
  //     if (ranges.length === 0) return Swal.fire({ icon: "error", title: "BIN Required", html: `Please Select At least One BIN Range for <b>${segName}</b>` });
  //     if (tks.length === 0) return Swal.fire({ icon: "error", title: "Token Required", html: `Please Select At least One Apple Token for <b>${segName}</b>` });
  //   }

  //   if (isEditMode && action === "next") return onNext();

  //   action === "update" ? setIsUpdateSubmitting(true) : setIsNextSubmitting(true);
  //   try {
  //     const rawPayload = generatePayload(selectedSegments, segmentRanges, segmentTokens);
  //     const apiPayload = rawPayload.map(seg => ({
  //       segment_id: seg.segment_id,
  //       all_bins: seg.all_bins,
  //       all_tokens: seg.all_tokens,
  //       discount_bins: seg.all_bins ? [] : seg.discount_bins,
  //       discount_apple_tokens: seg.all_tokens ? [] : seg.discount_apple_tokens
  //     }));

  //     await campaignDiscountApi.update(campaignId, { 
  //       discount: { discount_segments: apiPayload } 
  //     });

  //     if (onRefresh) await onRefresh();
  //     Swal.fire({ icon: "success", title: "Success!", text: "Configuration Saved Successfully", timer: 2000, showConfirmButton: false });
  //     if (action === "next") onNext();
  //   } catch (error) {
  //     Swal.fire({ icon: "error", title: "Request Error", text: "Save failed. Please try again." });
  //   } finally {
  //     setIsUpdateSubmitting(false);
  //     setIsNextSubmitting(false);
  //   }
  // };

  const handleSubmit = async (action) => {
    if (selectedSegments.length === 0) {
      setErrors({ ...errors, segment: true });
      return Swal.fire({ 
        icon: "warning", 
        title: "Selection Required", 
        text: "Please select at least one segment." 
      });
    }

    // ✅ Loop through each selected segment to validate
    for (const segName of selectedSegments) {
      // 1. Find the master metadata for this segment to see what is actually available
      const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
      
      const availableBinRanges = originalSeg?.bin_ranges || [];
      const availableAppleTokens = originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || [];

      const currentSelRanges = segmentRanges[segName] || [];
      const currentSelTokens = segmentTokens[segName] || [];

      // 2. Only show "BIN Required" if the segment actually has BIN ranges available to select
      if (availableBinRanges.length > 0 && currentSelRanges.length === 0) {
        return Swal.fire({ 
          icon: "error", 
          title: "BIN Required", 
          html: `Please Select At least One BIN Range for <b>${segName}</b>` 
        });
      }

      // 3. Only show "Token Required" if the segment actually has Apple Tokens available to select
      if (availableAppleTokens.length > 0 && currentSelTokens.length === 0) {
        return Swal.fire({ 
          icon: "error", 
          title: "Token Required", 
          html: `Please Select At least One Apple Token for <b>${segName}</b>` 
        });
      }
    }

    if (isEditMode && action === "next") return onNext();

    action === "update" ? setIsUpdateSubmitting(true) : setIsNextSubmitting(true);
    
  //   try {
  //     const rawPayload = generatePayload(selectedSegments, segmentRanges, segmentTokens);
  //     const apiPayload = rawPayload.map(seg => ({
  //       segment_id: seg.segment_id,
  //       all_bins: seg.all_bins,
  //       all_tokens: seg.all_tokens,
  //       discount_bins: seg.all_bins ? [] : seg.discount_bins,
  //       discount_apple_tokens: seg.all_tokens ? [] : seg.discount_apple_tokens
  //     }));

  //     await campaignDiscountApi.update(campaignId, { 
  //       discount: { discount_segments: apiPayload } 
  //     });

  //     if (onRefresh) await onRefresh();
      
  //     Swal.fire({ 
  //       icon: "success", 
  //       title: "Success!", 
  //       text: "Configuration Saved Successfully", 
  //       timer: 2000, 
  //           showConfirmButton: true, // Enables the confirmation button
  //         confirmButtonText: "OK", // Custom text for the button
  //         confirmButtonColor: "#6366F1",
  //     });
      
  //     if (action === "next") onNext();
  //  } catch (error) {
  //     // 1. Extract the specific detail message from the API response
  //     // We use optional chaining to safely check if the property exists
  //     const errorMessage = error.response?.data?.detail || "Save failed. Please try again.";

  //     Swal.fire({ 
  //       icon: "error", 
  //       title: "Error", 
  //       text: errorMessage // This will now show: "Invalid segments at index 1: When all_tokens is false..."
  //     });

  //   } finally {
  //     setIsUpdateSubmitting(false);
  //     setIsNextSubmitting(false);
  //   }

  try {
      const rawPayload = generatePayload(selectedSegments, segmentRanges, segmentTokens);
      
      const apiPayload = rawPayload.map(seg => ({
        segment_id: seg.segment_id,
        all_bins: seg.all_bins,
        all_tokens: seg.all_tokens,
        // ✅ If all_tokens is true (because it was empty), this becomes []
        discount_bins: seg.all_bins ? [] : seg.discount_bins,
        discount_apple_tokens: seg.all_tokens ? [] : seg.discount_apple_tokens
      }));

      await campaignDiscountApi.update(campaignId, { 
        discount: { discount_segments: apiPayload } 
      });

      if (onRefresh) await onRefresh();
      
      Swal.fire({ 
        icon: "success", 
        title: "Success!", 
        text: "Configuration Saved Successfully", 
        timer: 2000, 
        confirmButtonColor: "#6366F1",
      });
      
      if (action === "next") onNext();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Save failed. Please try again.";
      Swal.fire({ icon: "error", title: "Error", text: errorMessage });
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <StepHeader step={2} totalSteps={9} title="BIN Configuration" />

      {/* Select Dropdown */}
      <div className="bg-[#F7F9FB] border border-[#E2E8F0] rounded p-4 mb-6">
        <div ref={segRef} className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 font-medium">Select Segment Name <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setSegmentsOpen(!segmentsOpen);
                setErrors({ ...errors, segment: false });
              }}
              className={`flex-1 flex items-center justify-between border rounded p-2 bg-white text-sm h-10 overflow-hidden text-left transition-all ${getBorderClass(errors.segment)}`}
            >
              <span className="truncate block">
                {selectedSegments.length ? selectedSegments.join(", ") : "Select segment"}
              </span>
              <svg 
                className={`w-4 h-4 ${errors.segment ? "text-orange-500" : "text-gray-400"}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            <button type="button" onClick={() => setSegmentsOpen(true)} className="px-8 bg-[#7747EE] text-white rounded-full text-sm h-9">Add</button>
          </div>
          {segmentsOpen && (
            <div className="absolute z-30 mt-2 w-full bg-white border border-[#E2E8F0] rounded shadow-md p-3 max-h-48 overflow-auto hide-scroll">
              {availableSegments.map((seg) => {
                const name = seg.segment_name || seg.name;
                const isChecked = selectedSegments.includes(name);
                return (
                  <label key={seg.id} className="flex items-center gap-3 py-2 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={isChecked} onChange={() => toggleSegment(seg)} className="sr-only" />
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isChecked ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-300 bg-white"}`}>
                      {isChecked && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                    </span>
                    <span>{name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${selectedSegments.length > 4 ? "max-h-[700px] overflow-y-auto pr-2 hide-scroll" : ""}`}>
        {selectedSegments.map((segName) => {
          const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
          const segMetaTokens = (originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || []).map(t => t.token_value || t);
          const availableRanges = originalSeg?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
          
          const currentSelRanges = segmentRanges[segName] || [];
          const currentSelTokens = segmentTokens[segName] || [];

          const isAllRanges = availableRanges.length > 0 && currentSelRanges.length === availableRanges.length;
          const isAllTokens = segMetaTokens.length > 0 && currentSelTokens.length === segMetaTokens.length;

          return (
            <div key={segName} className="bg-white border border-gray-100 rounded p-4 relative shadow-sm h-fit">
              <button onClick={() => toggleSegment(originalSeg)} className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#7747EE] text-[8px] flex items-center justify-center text-[#ffffff] z-10">✕</button>
              <div className="text-sm font-medium mb-2">{segName}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-4">
                
                {/* BIN Ranges Column */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">All</span>
                      <input type="checkbox" className="sr-only" checked={isAllRanges} onChange={() => handleToggleAllRanges(segName, availableRanges)} />
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllRanges ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
                        <svg className={`${isAllRanges ? "opacity-100" : "opacity-0"} w-3 h-3 text-white`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                      </span>
                    </label>
                  </div>
                  <div className={`space-y-3 pr-1 ${availableRanges.length > 5 ? "max-h-[120px] overflow-y-auto hide-scroll" : ""}`}>
                    {availableRanges.map(r => (
                      <label key={r} className="flex items-start gap-3 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={currentSelRanges.includes(r)} onChange={() => {
                            setSegmentRanges(prev => {
                                const curr = prev[segName] || [];
                                const next = curr.includes(r) ? curr.filter(x => x !== r) : [...curr, r];
                                const updated = { ...prev, [segName]: next };
                                updateParent({ segmentRanges: updated });
                                return updated;
                            });
                        }} className="sr-only" />
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${currentSelRanges.includes(r) ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
                          {currentSelRanges.includes(r) && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                        </span>
                        <div className="text-[11px] text-gray-700 flex items-center gap-1.5 font-medium leading-none">
                          {r.split(" - ")[0]} <ArrowRight size={10} className="text-gray-400" /> {r.split(" - ")[1]}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ✅ Apple Tokens Column: Individual segment logic implemented */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">All</span>
                      <input type="checkbox" className="sr-only" checked={isAllTokens} onChange={() => handleToggleAllTokens(segName, segMetaTokens)} />
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllTokens ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
                        <svg className={`${isAllTokens ? "opacity-100" : "opacity-0"} w-3 h-3 text-white`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                      </span>
                    </label>
                  </div>
                  <div className={`space-y-3 pr-1 ${segMetaTokens.length > 5 ? "max-h-[120px] overflow-y-auto hide-scroll" : ""}`}>
                    {segMetaTokens.length ? segMetaTokens.map((tVal) => (
                        <label key={tVal} className="flex items-start gap-3 text-sm cursor-pointer select-none">
                          <input type="checkbox" checked={currentSelTokens.includes(tVal)} onChange={() => {
                              setSegmentTokens(prev => {
                                  const curr = prev[segName] || [];
                                  const next = curr.includes(tVal) ? curr.filter(v => v !== tVal) : [...curr, tVal];
                                  const updated = { ...prev, [segName]: next };
                                  updateParent({ segmentTokens: updated });
                                  return updated;
                              });
                          }} className="sr-only" />
                          <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${currentSelTokens.includes(tVal) ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
                            {currentSelTokens.includes(tVal) && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                          </span>
                          <div className="text-[11px] text-gray-700 truncate font-medium leading-none">{tVal}</div>
                        </label>
                    )) : <div className="text-[10px] text-gray-400 italic">No tokens</div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 border-t border-[#E2E8F0] pt-4 flex justify-between items-center bg-white">
        <button onClick={onPrevious} className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#334155] text-[14px] font-medium hover:bg-gray-50 transition-colors"> 
          <span className="flex justify-center items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            Previous
          </span>
        </button>
        <div className="flex gap-3">
          {isEditMode && (
            <button onClick={() => handleSubmit("update")} disabled={isNextSubmitting || isUpdateSubmitting} className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-70">
              {isUpdateSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Updating...</span></> : <span>Update</span>}
            </button>
          )}
          <button onClick={() => handleSubmit("next")} disabled={isNextSubmitting || isUpdateSubmitting} className="bg-[#6366F1] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-medium hover:bg-[#4f46e5] transition-colors flex items-center gap-2 disabled:opacity-70">
            {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isNextSubmitting ? "Saving..." : "Next →"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BINConfig;