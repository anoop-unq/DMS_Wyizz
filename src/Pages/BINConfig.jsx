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
  const [tokens, setTokens] = useState([]);
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
  //   currTokens = tokens
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
  //     const selectedTokens = currTokens
  //       .filter((t) => t.checked && masterTokens.includes(t.value))
  //       .map((t) => t.value);

  //     const isAllBins = masterRanges.length > 0 && selectedRanges.length === masterRanges.length;
  //     const isAllTokens = masterTokens.length > 0 && selectedTokens.length === masterTokens.length;

  //     const segmentObj = {
  //       segment_id: originalSeg?.id,
  //       all_bins: isAllBins,
  //       all_tokens: isAllTokens,
  //     };

  //     // ✅ LOGIC FIX: Only send arrays if NOT "All"
  //     if (!isAllBins && selectedRanges.length > 0) {
  //       const binPayload = selectedRanges
  //         .filter((r) => r !== "N/A - N/A")
  //         .map((range) => {
  //           const [start, end] = range.split(" - ");
  //           return { start_bin: start.trim(), end_bin: end.trim() };
  //         });
  //       if (binPayload.length > 0) segmentObj.discount_bins = binPayload;
  //     } else if (isAllBins) {
  //       segmentObj.discount_bins = []; // Explicitly clear if all_bins is true
  //     }

  //     if (!isAllTokens && selectedTokens.length > 0) {
  //       segmentObj.discount_apple_tokens = selectedTokens.map((v) => ({ token_value: v }));
  //     } else if (isAllTokens) {
  //       segmentObj.discount_apple_tokens = []; // Explicitly clear if all_tokens is true
  //     }

  //     return segmentObj;
  //   });
  // };

    const generatePayload = (
    currSegments = selectedSegments,
    currRanges = segmentRanges,
    currTokens = tokens
  ) => {
    return currSegments.map((segName) => {
      const originalSeg = availableSegments.find(
        (s) => (s.segment_name || s.name) === segName
      );

      // 1. Get Master Data for this segment
      const masterRanges = originalSeg?.bin_ranges?.map(formatBinRange) || [];
      const masterTokens = (
        originalSeg?.apple_tokens ||
        originalSeg?.discount_apple_tokens ||
        []
      ).map((t) => t.token_value || t);

      // 2. Get Current Selections
      const selectedRanges = currRanges[segName] || [];
      const selectedTokens = currTokens
        .filter((t) => t.checked && masterTokens.includes(t.value))
        .map((t) => t.value);

      // 3. Determine "All" Flags
      const isAllBins = masterRanges.length > 0 && selectedRanges.length === masterRanges.length;
      const isAllTokens = masterTokens.length > 0 && selectedTokens.length === masterTokens.length;

      // 4. Map the data to objects (Always map them, don't clear to [])
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
        all_tokens: isAllTokens,
        // ✅ ALWAYS passing the full data to the Summary UI
        discount_bins: discountBins,
        discount_apple_tokens: discountAppleTokens,
      };
    });
  };

  // const updateParent = (updates) => {
  //   onUpdate({
  //     ...updates,
  //     finalSegmentsData: generatePayload(
  //       updates.selectedSegments || selectedSegments,
  //       updates.segmentRanges || segmentRanges,
  //       updates.tokens || tokens
  //     ),
  //   });
  // };

  const updateParent = (updates) => {
    const currentNames = updates.selectedSegments || selectedSegments;
    const currentRanges = updates.segmentRanges || segmentRanges;
    const currentTokens = updates.tokens || tokens;

    onUpdate({
      ...updates,
      selectedSegments: currentNames,
      segmentRanges: currentRanges,
      tokens: currentTokens,
      // Pass the fully populated array to the Summary UI
      finalSegmentsData: generatePayload(currentNames, currentRanges, currentTokens),
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

  const handleToggleAllTokens = (segMetaTokens) => {
    const tokenValues = segMetaTokens.map((t) => t.token_value || t);
    setTokens((prev) => {
      const isAllChecked = tokenValues.every(
        (v) => prev.find((tk) => tk.value === v)?.checked
      );
      const next = prev.map((tk) =>
        tokenValues.includes(tk.value) ? { ...tk, checked: !isAllChecked } : tk
      );
      updateParent({ tokens: next });
      return next;
    });
  };

  // ✅ FIXED PERSISTENCE LOGIC: Maps API tokens and Bins accurately
  const mapApiDataToState = (discountData) => {
    const segmentsApi = discountData.discount_segments || discountData.segments || [];
    const newSelectedSegments = [];
    const newSegmentRanges = {};

    // 1. Collect unique checked tokens from the API response
    const checkedTokenValuesFromApi = new Set();
    segmentsApi.forEach(seg => {
      (seg.discount_apple_tokens || []).forEach(t => {
        checkedTokenValuesFromApi.add(t.token_value || t);
      });
    });

    // 2. Map Segments and Bins
    segmentsApi.forEach((segment) => {
      const segName = segment.segment_name || segment.name;
      if (!newSelectedSegments.includes(segName)) newSelectedSegments.push(segName);

      const masterSegment = availableSegments.find((s) => (s.segment_name || s.name) === segName);
      
      // If all_bins is true in API, select all master ranges
      let masterRanges = masterSegment?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
      newSegmentRanges[segName] = segment.all_bins 
        ? masterRanges 
        : (segment.discount_bins || []).map(formatBinRange);
      
      // If all_tokens is true for this segment, add all its master tokens to the checked set
      if (segment.all_tokens) {
        (masterSegment?.apple_tokens || []).forEach(t => {
          checkedTokenValuesFromApi.add(t.token_value || t);
        });
      }
    });

    // 3. Update master tokens state
    setTokens(prev => prev.map(t => ({
      ...t,
      checked: checkedTokenValuesFromApi.has(t.value)
    })));

    setSelectedSegments(newSelectedSegments);
    setSegmentRanges(newSegmentRanges);
  };

  useEffect(() => {
    const fetchSegments = async () => {
      setLoadingSegments(true);
      try {
        const res = await metadataApi.getSegments();
        const rows = res.data?.rows || res.data || [];
        setAvailableSegments(rows);
        
        const allMetaTokens = [];
        rows.forEach(seg => {
          (seg.apple_tokens || []).forEach(t => {
            const val = t.token_value || t;
            if (!allMetaTokens.some(mt => mt.value === val)) {
              allMetaTokens.push({ value: val, checked: false });
            }
          });
        });
        setTokens(allMetaTokens);
      } catch (err) { console.error(err); }
      finally { setLoadingSegments(false); }
    };
    fetchSegments();
  }, []);

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
    let newNames = isSelected ? selectedSegments.filter((s) => s !== name) : [...selectedSegments, name];
    
    let newRanges = { ...segmentRanges };
    if (isSelected) {
      delete newRanges[name];
    } else {
      newRanges[name] = segment.bin_ranges?.length ? segment.bin_ranges.map(formatBinRange) : ["N/A - N/A"];
    }

    setTokens((prev) => {
      let next = [...prev];
      if (!isSelected) {
        const segmentMetaTokens = (segment.apple_tokens || []).map(t => t.token_value || t);
        next = next.map(tk => segmentMetaTokens.includes(tk.value) ? { ...tk, checked: true } : tk);
      }
      updateParent({ selectedSegments: newNames, segmentRanges: newRanges, tokens: next });
      return next;
    });

    setSelectedSegments(newNames);
    setSegmentRanges(newRanges);
  };


  const handleSubmit = async (action) => {
    if (selectedSegments.length === 0) {
      setErrors({ ...errors, segment: true });
      return Swal.fire({ icon: "warning", title: "Selection Required", text: "Please select at least one segment." });
    }

    for (const segName of selectedSegments) {
      const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
      const masterTokens = (originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || []).map(t => t.token_value || t);
      const currentRanges = segmentRanges[segName] || [];
      const currentTokens = tokens.filter(t => t.checked && masterTokens.includes(t.value));

      if (currentRanges.length === 0) return Swal.fire({ icon: "error", title: "BIN Required", html: `Please Select At least One BIN Range for <b>${segName}</b>` });
      if (currentTokens.length === 0) return Swal.fire({ icon: "error", title: "Token Required", html: `Please Select At least One Apple Token for <b>${segName}</b>` });
    }

    if (isEditMode && action === "next") {
      return onNext();
    }

    action === "update" ? setIsUpdateSubmitting(true) : setIsNextSubmitting(true);
    // try {
    //   const payload = generatePayload();
    //   await campaignDiscountApi.update(campaignId, { discount: { discount_segments: payload } });
    //   if (onRefresh) await onRefresh();
    //   if (action === "next") onNext();
    //   Swal.fire({
    //             icon: "success",
    //             title: "Success",
    //             text: "Campaign Updated Successfully",
    //             timer: 1500,
    //             showConfirmButton: false,
    //       });
    // } 

    try {
      // 1. Get the descriptive payload
      const rawPayload = generatePayload();

      // 2. Clean the payload ONLY for the API call (Backend requirement)
      const apiPayload = rawPayload.map(seg => ({
        segment_id: seg.segment_id,
        all_bins: seg.all_bins,
        all_tokens: seg.all_tokens,
        // Backend logic: If all_bins is true, send [], otherwise send the list
        discount_bins: seg.all_bins ? [] : seg.discount_bins,
        discount_apple_tokens: seg.all_tokens ? [] : seg.discount_apple_tokens
      }));

      // 3. Send the CLEANED payload to the database
      await campaignDiscountApi.update(campaignId, { 
        discount: { discount_segments: apiPayload } 
      });

      if (onRefresh) await onRefresh();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: action === "update" 
          ? "BIN Configuration Updated Successfully" 
          : "BIN Configuration Saved Successfully",
        timer: 2000,
        showConfirmButton: false,
        background: "#FFFFFF",
        color: "#1e293b",
      });
      if (action === "next") onNext();
      
      
    }
    catch (error) {
      const errorMessage = error.response?.data?.detail || "Save failed. Please try again.";
      Swal.fire({ icon: "error", title: "Request Error", text: errorMessage });
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
              // Apply the imported class here
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
          const segMetaTokens = originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || [];
          const availableRanges = originalSeg?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
          const isAllRanges = (segmentRanges[segName] || []).length === availableRanges.length;
          const isAllTokens = segMetaTokens.length > 0 && segMetaTokens.every(t => tokens.find(tk => tk.value === (t.token_value || t))?.checked);

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
                        <input type="checkbox" checked={(segmentRanges[segName] || []).includes(r)} onChange={() => {
                          setSegmentRanges(prev => {
                            const curr = prev[segName] || [];
                            const next = curr.includes(r) ? curr.filter(x => x !== r) : [...curr, r];
                            const updated = { ...prev, [segName]: next };
                            updateParent({ segmentRanges: updated });
                            return updated;
                          });
                        }} className="sr-only" />
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${(segmentRanges[segName] || []).includes(r) ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
                          {(segmentRanges[segName] || []).includes(r) && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                        </span>
                        <div className="text-[11px] text-gray-700 flex items-center gap-1.5 font-medium leading-none">
                          {r.split(" - ")[0]} <ArrowRight size={10} className="text-gray-400" /> {r.split(" - ")[1]}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apple Tokens Column */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">All</span>
                      <input type="checkbox" className="sr-only" checked={isAllTokens} onChange={() => handleToggleAllTokens(segMetaTokens)} />
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllTokens ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
                        <svg className={`${isAllTokens ? "opacity-100" : "opacity-0"} w-3 h-3 text-white`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                      </span>
                    </label>
                  </div>
                  <div className={`space-y-3 pr-1 ${segMetaTokens.length > 5 ? "max-h-[120px] overflow-y-auto hide-scroll" : ""}`}>
                    {segMetaTokens.length ? segMetaTokens.map((t) => {
                      const val = t.token_value || t;
                      const isTChecked = tokens.find(tk => tk.value === val)?.checked;
                      return (
                        <label key={val} className="flex items-start gap-3 text-sm cursor-pointer select-none">
                          <input type="checkbox" checked={isTChecked} onChange={() => {
                            setTokens((prev) => {
                              const next = prev.map((tk) => tk.value === val ? { ...tk, checked: !tk.checked } : tk);
                              updateParent({ tokens: next });
                              return next;
                            });
                          }} className="sr-only" />
                          <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isTChecked ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
                            {isTChecked && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                          </span>
                          <div className="text-[11px] text-gray-700 truncate font-medium leading-none">{val}</div>
                        </label>
                      );
                    }) : <div className="text-[10px] text-gray-400 italic">No tokens</div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-[#E2E8F0] pt-4 flex justify-between items-center bg-white">
        <button onClick={onPrevious} className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#334155] text-[14px] font-medium hover:bg-gray-50 transition-colors"> 
              <span className="flex justify-center items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </span>
        </button>
        <div className="flex gap-3">
{isEditMode && (
      <button 
        onClick={() => handleSubmit("update")} 
        disabled={isNextSubmitting || isUpdateSubmitting}
        className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {isUpdateSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Updating...</span>
          </>
        ) : (
          <span>Update</span>
        )}
      </button>
    )}
<button 
      onClick={() => handleSubmit("next")} 
      disabled={isNextSubmitting || isUpdateSubmitting}
      className="bg-[#6366F1] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-medium hover:bg-[#4f46e5] transition-colors flex items-center gap-2 disabled:opacity-70"
    >
      {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{isNextSubmitting ? "Saving..." : "Next →"}</span>
    </button>
        </div>
      </div>
    </div>
  );
};

export default BINConfig;