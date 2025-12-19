// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import { Loader2 } from "lucide-react";
// // // // import { metadataApi, campaignDiscountApi, campaignApi } from "../utils/metadataApi";
// // // // import StepHeader from "../StepReusable/Stepheader";

// // // // const BINConfig = ({
// // // //   data,
// // // //   onUpdate,
// // // //   onNext,
// // // //   onPrevious,
// // // //   campaignId,
// // // //   isEditMode,
// // // //   onRefresh
// // // // }) => {
// // // //   // ... [Keep all your existing state and logic exactly the same] ...
// // // //   const [availableSegments, setAvailableSegments] = useState([]);
// // // //   const [loadingSegments, setLoadingSegments] = useState(false);
// // // //   const [segmentsOpen, setSegmentsOpen] = useState(false);
// // // //   const [selectedSegments, setSelectedSegments] = useState([]);
// // // //   const [selectedSegmentIds, setSelectedSegmentIds] = useState([]);
// // // //   const [segmentRanges, setSegmentRanges] = useState({});
// // // //   const [tokens, setTokens] = useState([]);
// // // //   const [tokenInput, setTokenInput] = useState("");
// // // //   const [isLoadingData, setIsLoadingData] = useState(false);
// // // //   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
// // // //   const [isNextSubmitting, setIsNextSubmitting] = useState(false);
// // // //   const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;
// // // //   const segRef = useRef(null);

// // // //   // ... [Keep helper functions formatBinRange, mapApiDataToState, useEffects, etc.] ...

// // // //   const formatBinRange = (binObj) => {
// // // //       if (!binObj) return "";
// // // //       return `${binObj.start_bin} - ${binObj.end_bin}`;
// // // //   };

// // // //   const mapApiDataToState = (discountData) => {
// // // //       // ... [Keep existing implementation] ...
// // // //         const segmentsApi = discountData.discount_segments || discountData.segments || [];

// // // //         const newSelectedSegments = [];
// // // //         const newSelectedSegmentIds = [];
// // // //         const newSegmentRanges = {};
// // // //         const newTokens = [];

// // // //         segmentsApi.forEach(segment => {
// // // //             const segName = segment.segment_name || segment.name;
// // // //             if (!newSelectedSegments.includes(segName)) {
// // // //                 newSelectedSegments.push(segName);
// // // //                 newSelectedSegmentIds.push(segment.id || segment.segment_id);
// // // //             }

// // // //             const masterSegment = availableSegments.find(s => s.id === (segment.id || segment.segment_id) || (s.segment_name || s.name) === segName);

// // // //             let masterRanges = [];
// // // //             if (masterSegment && masterSegment.bin_ranges?.length > 0) {
// // // //                 masterRanges = masterSegment.bin_ranges.map(formatBinRange);
// // // //             } else {
// // // //                 masterRanges = ["N/A - N/A"];
// // // //             }

// // // //             let selectedRanges = [];
// // // //             const apiBins = segment.discount_bins || segment.bin_ranges;

// // // //             if (segment.all_bins === true) {
// // // //                 selectedRanges = masterRanges;
// // // //             }
// // // //             else if (apiBins && apiBins.length > 0) {
// // // //                 selectedRanges = apiBins.map(formatBinRange);
// // // //             }
// // // //             else {
// // // //                 selectedRanges = masterRanges;
// // // //             }

// // // //             newSegmentRanges[segName] = selectedRanges;

// // // //             const apiTokens = segment.discount_apple_tokens || segment.apple_tokens;
// // // //             if (apiTokens && apiTokens.length > 0) {
// // // //                 apiTokens.forEach(token => {
// // // //                     if (!newTokens.some(t => t.value === token.token_value)) {
// // // //                         newTokens.push({
// // // //                             value: token.token_value,
// // // //                             checked: true
// // // //                         });
// // // //                     }
// // // //                 });
// // // //             }
// // // //         });

// // // //         setSelectedSegments(newSelectedSegments);
// // // //         setSelectedSegmentIds(newSelectedSegmentIds);
// // // //         setSegmentRanges(newSegmentRanges);
// // // //         setTokens(newTokens);

// // // //         updateParent({
// // // //             selectedSegments: newSelectedSegments,
// // // //             selectedSegmentIds: newSelectedSegmentIds,
// // // //             segmentRanges: newSegmentRanges,
// // // //             tokens: newTokens,
// // // //             finalSegmentsData: generatePayload(newSelectedSegments, newSegmentRanges, newTokens)
// // // //         });
// // // //   };

// // // //   // ... [Keep useEffects 1, 2, 3 and close dropdown logic] ...
// // // //   useEffect(() => {
// // // //     const fetchSegments = async () => {
// // // //       setLoadingSegments(true);
// // // //       try {
// // // //         const res = await metadataApi.getSegments();
// // // //         const rows = res.data?.rows || res.data || [];
// // // //         setAvailableSegments(rows);
// // // //       } catch (err) {
// // // //         console.error("Failed to load segments", err);
// // // //       } finally {
// // // //         setLoadingSegments(false);
// // // //       }
// // // //     };
// // // //     fetchSegments();
// // // //   }, []);

// // // //     useEffect(() => {
// // // //         if (campaignId && availableSegments.length > 0) {
// // // //             const fetchStepData = async () => {
// // // //                 setIsLoadingData(true);
// // // //                 try {
// // // //                     const res = await campaignDiscountApi.getById(campaignId);
// // // //                     const d = res.data?.discount || {};
// // // //                     const hasSegments = (d.discount_segments && d.discount_segments.length > 0) || (d.segments && d.segments.length > 0);
// // // //                     if (d && hasSegments) {
// // // //                         mapApiDataToState(d);
// // // //                     }
// // // //                 } catch (err) {
// // // //                     console.error("Failed to load Step 2 details", err);
// // // //                 } finally {
// // // //                     setIsLoadingData(false);
// // // //                 }
// // // //             };
// // // //             fetchStepData();
// // // //         }
// // // //     }, [campaignId, availableSegments.length]);

// // // //   useEffect(() => {
// // // //     if (data && !isLoadingData && selectedSegments.length === 0) {
// // // //       const cleanData = {
// // // //         selectedSegments: Array.isArray(data.selectedSegments) ? data.selectedSegments : [],
// // // //         selectedSegmentIds: Array.isArray(data.selectedSegmentIds) ? data.selectedSegmentIds : [],
// // // //         segmentRanges: data.segmentRanges && typeof data.segmentRanges === 'object' ? data.segmentRanges : {},
// // // //         tokens: Array.isArray(data.tokens) ? data.tokens : [],
// // // //       };
// // // //       if (cleanData.selectedSegments.length > 0) {
// // // //           setSelectedSegments(cleanData.selectedSegments);
// // // //           setSelectedSegmentIds(cleanData.selectedSegmentIds);
// // // //           setSegmentRanges(cleanData.segmentRanges);
// // // //           if (cleanData.tokens && Array.isArray(cleanData.tokens)) {
// // // //             setTokens(cleanData.tokens.map((t) => typeof t === "string" ? { value: t, checked: true } : { ...t, checked: !!t.checked }));
// // // //           }
// // // //       }
// // // //     }
// // // //   }, [data, isLoadingData]);

// // // //   useEffect(() => {
// // // //     const handleClick = (e) => {
// // // //       if (segRef.current && !segRef.current.contains(e.target)) setSegmentsOpen(false);
// // // //     };
// // // //     document.addEventListener("mousedown", handleClick);
// // // //     return () => document.removeEventListener("mousedown", handleClick);
// // // //   }, []);

// // // // const generatePayload = (
// // // //       currSegments = selectedSegments,
// // // //       currRanges = segmentRanges,
// // // //       currTokens = tokens
// // // //   ) => {
// // // //       if (currSegments.length === 0) return [];

// // // //       const payload = currSegments.map(segName => {
// // // //           const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
// // // //           const selectedRanges = currRanges[segName] || [];

// // // //           // Generate the bins list
// // // //           const binRanges = selectedRanges
// // // //             .filter(range => range !== "N/A - N/A")
// // // //             .map(range => {
// // // //               const [startBin, endBin] = range.split(" - ");
// // // //               return {
// // // //                 start_bin: startBin.trim(),
// // // //                 end_bin: endBin.trim(),
// // // //               };
// // // //             });

// // // //           // Generate the tokens list
// // // //           const hasSelectedTokens = currTokens.some(t => t.checked);
// // // //           const appleTokens = hasSelectedTokens ? currTokens
// // // //             .filter(t => t.checked)
// // // //             .map(t => ({
// // // //               token_value: t.value
// // // //             })) : [];

// // // //           const isAllBins = binRanges.length === 0;
// // // //           const isAllTokens = !hasSelectedTokens;

// // // //           // --- UPDATED KEYS BASED ON IMAGE ---
// // // //           const payloadObj = {
// // // //             segment_id: originalSeg?.id,
// // // //             all_bins: isAllBins,
// // // //             all_tokens: isAllTokens,
// // // //             discount_apple_tokens: appleTokens // Changed from 'apple_tokens'
// // // //           };

// // // //           if (!isAllBins) {
// // // //             payloadObj.discount_bins = binRanges; // Changed from 'bin_ranges'
// // // //           }

// // // //           return payloadObj;
// // // //       }).filter(Boolean);

// // // //       return payload;
// // // //   };

// // // //   const updateParent = (updates) => {
// // // //     const mergedState = {
// // // //         selectedSegments: updates.selectedSegments !== undefined ? updates.selectedSegments : selectedSegments,
// // // //         selectedSegmentIds: updates.selectedSegmentIds !== undefined ? updates.selectedSegmentIds : selectedSegmentIds,
// // // //         segmentRanges: updates.segmentRanges !== undefined ? updates.segmentRanges : segmentRanges,
// // // //         tokens: updates.tokens !== undefined ? updates.tokens : tokens,
// // // //         finalSegmentsData: updates.finalSegmentsData !== undefined
// // // //             ? updates.finalSegmentsData
// // // //             : generatePayload(
// // // //                 updates.selectedSegments !== undefined ? updates.selectedSegments : selectedSegments,
// // // //                 updates.segmentRanges !== undefined ? updates.segmentRanges : segmentRanges,
// // // //                 updates.tokens !== undefined ? updates.tokens : tokens
// // // //               )
// // // //     };
// // // //     onUpdate(mergedState);
// // // //   };

// // // //   const handleSubmit = async (action) => {
// // // //     if (selectedSegments.length === 0) {
// // // //       alert("Please select at least one segment.");
// // // //       return;
// // // //     }

// // // //     if (action === 'update') setIsUpdateSubmitting(true);
// // // //     else setIsNextSubmitting(true);

// // // //     try {
// // // //       // 1. Generate the array with the new keys (discount_bins, etc.)
// // // //       const formattedSegments = generatePayload(selectedSegments, segmentRanges, tokens);

// // // //       updateParent({ finalSegmentsData: formattedSegments });

// // // //       const shouldCallApi = !isEditMode || action === 'update';

// // // //       if (shouldCallApi) {
// // // //           if (!campaignId) {
// // // //               throw new Error("Missing Campaign ID. Cannot update.");
// // // //           }

// // // //           // 2. Wrap it in the structure shown in the image (discount_segments)
// // // //           const apiBody = {
// // // //               discount: {
// // // //                   discount_segments: formattedSegments || [] // Changed from 'segments' to 'discount_segments'
// // // //               }
// // // //           };

// // // //           console.log(`📤 PUT Payload to ID ${campaignId}:`, JSON.stringify(apiBody, null, 2));
// // // //           await campaignDiscountApi.update(campaignId, apiBody);

// // // //           if (action === 'update') {
// // // //               if (onRefresh) await onRefresh();
// // // //               console.log("✅ Step 2 Updated.");
// // // //           }
// // // //       }

// // // //       if (action === 'next') {
// // // //         onNext();
// // // //       }

// // // //     } catch (error) {
// // // //       console.error("❌ Error saving BIN configuration:", error);
// // // //       const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
// // // //       alert(`Failed to save configuration. Error: ${errorMsg}`);
// // // //     } finally {
// // // //       setIsUpdateSubmitting(false);
// // // //       setIsNextSubmitting(false);
// // // //     }
// // // //   };

// // // //   const toggleSegment = (segment) => {
// // // //     // ... [Keep existing toggleSegment logic] ...
// // // //     const name = segment.segment_name || segment.name;
// // // //     const segmentId = segment.id;
// // // //     const isSelected = selectedSegments.includes(name);

// // // //     let newSelectedNames;
// // // //     let newSelectedIds;
// // // //     let newRanges = { ...segmentRanges };
// // // //     let newTokens = [...tokens];

// // // //     if (isSelected) {
// // // //       newSelectedNames = selectedSegments.filter((s) => s !== name);
// // // //       newSelectedIds = selectedSegmentIds.filter((sid) => sid !== segmentId);
// // // //       delete newRanges[name];

// // // //       const segTokens = segment.apple_tokens || segment.discount_apple_tokens || [];
// // // //       if (segTokens.length > 0) {
// // // //           const otherTokensSet = new Set();
// // // //           newSelectedNames.forEach(otherName => {
// // // //               const otherSeg = availableSegments.find(s => (s.segment_name || s.name) === otherName);
// // // //               if (otherSeg) {
// // // //                   const otherSegTokens = otherSeg.apple_tokens || otherSeg.discount_apple_tokens || [];
// // // //                   otherSegTokens.forEach(t => otherTokensSet.add(t.token_value || t));
// // // //               }
// // // //           });

// // // //           newTokens = tokens.filter(t => {
// // // //               const tokenValue = t.value;
// // // //               const isTokenInRemovedSeg = segTokens.some(st => (st.token_value || st) === tokenValue);
// // // //               if (!isTokenInRemovedSeg) return true;
// // // //               if (otherTokensSet.has(tokenValue)) return true;
// // // //               return false;
// // // //           });
// // // //       }

// // // //     } else {
// // // //       newSelectedNames = [...selectedSegments, name];
// // // //       newSelectedIds = [...selectedSegmentIds, segmentId];

// // // //       let currentBins = [];
// // // //       if (segment.bin_ranges && segment.bin_ranges.length > 0) {
// // // //         currentBins = segment.bin_ranges.map(formatBinRange);
// // // //       } else {
// // // //         currentBins = ["N/A - N/A"];
// // // //       }
// // // //       newRanges[name] = currentBins;

// // // //       const metaTokens = segment.apple_tokens || segment.discount_apple_tokens || [];
// // // //       if (metaTokens.length > 0) {
// // // //           metaTokens.forEach(t => {
// // // //               const val = t.token_value || t;
// // // //               if (!newTokens.some(existing => existing.value === val)) {
// // // //                   newTokens.push({ value: val, checked: true });
// // // //               }
// // // //           });
// // // //       }
// // // //     }

// // // //     setSelectedSegments(newSelectedNames);
// // // //     setSelectedSegmentIds(newSelectedIds);
// // // //     setSegmentRanges(newRanges);
// // // //     setTokens(newTokens);

// // // //     updateParent({
// // // //       selectedSegments: newSelectedNames,
// // // //       selectedSegmentIds: newSelectedIds,
// // // //       segmentRanges: newRanges,
// // // //       tokens: newTokens
// // // //     });
// // // //   };

// // // //   const toggleRangeForSegment = (segmentName, rangeString) => {
// // // //     const currentRanges = segmentRanges[segmentName] || [];
// // // //     let updated;
// // // //     if (currentRanges.includes(rangeString)) {
// // // //       updated = currentRanges.filter((r) => r !== rangeString);
// // // //     } else {
// // // //       updated = [...currentRanges, rangeString];
// // // //     }
// // // //     const newSegmentRanges = { ...segmentRanges, [segmentName]: updated };
// // // //     setSegmentRanges(newSegmentRanges);
// // // //     updateParent({ segmentRanges: newSegmentRanges });
// // // //   };

// // // //   const removeSegmentCard = (segmentName) => {
// // // //     const segObj = availableSegments.find(s => (s.segment_name || s.name) === segmentName);
// // // //     if (segObj) toggleSegment(segObj);
// // // //   };

// // // //   // ✅ REVERTED TO FULL LIST (CSS will handle the cutting off)
// // // //   const segmentsDisplay = selectedSegments.length ? selectedSegments.join(", ") : "Select segment";

// // // //   // ... [Keep the rest of helper functions: parseInputToValues, handleAddTokens, etc.] ...
// // // //   const parseInputToValues = (input) => {
// // // //     return input
// // // //       .split(/\r?\n|,|;/)
// // // //       .map((s) => s.trim())
// // // //       .filter((s) => s.length > 0);
// // // //   };

// // // //   const handleAddTokens = () => {
// // // //     const values = parseInputToValues(tokenInput);
// // // //     if (values.length === 0) {
// // // //       setTokenInput("");
// // // //       return;
// // // //     }
// // // //     const existingValues = new Set(tokens.map((t) => t.value));
// // // //     const newTokens = values
// // // //       .filter((v) => !existingValues.has(v))
// // // //       .map((v) => ({ value: v, checked: true }));

// // // //     if (newTokens.length > 0) {
// // // //       const updated = [...tokens, ...newTokens];
// // // //       setTokens(updated);
// // // //       updateParent({ tokens: updated });
// // // //     }
// // // //     setTokenInput("");
// // // //   };

// // // //   const toggleTokenChecked = (value) => {
// // // //     const updatedTokens = tokens.map((t) =>
// // // //       t.value === value ? { ...t, checked: !t.checked } : t
// // // //     );
// // // //     setTokens(updatedTokens);
// // // //     updateParent({ tokens: updatedTokens });
// // // //   };

// // // //   const handleTokenKeyDown = (e) => {
// // // //     if (e.key === "Enter" && !e.shiftKey) {
// // // //       e.preventDefault();
// // // //       handleAddTokens();
// // // //     }
// // // //   };

// // // //   if (isLoadingData) {
// // // //     return (
// // // //       <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
// // // //         <div className="flex items-center justify-center h-64">
// // // //           <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
// // // //           <span className="ml-2 text-gray-600">Loading BIN configuration...</span>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
// // // //       {/* Header */}
// // // //           <StepHeader step={2} totalSteps={9} title="BIN Configuration" />

// // // //       {/* Controls Row */}
// // // //       <div className="bg-[#F7F9FB] border border-[#E2E8F0] rounded p-4 grid grid-cols-1 lg:grid-cols-1 gap-4 items-end">
// // // //         <div ref={segRef} className="relative justify-self-start w-full">
// // // //           <label className="block text-sm text-gray-700 mb-2">Select Segment Name <span className="text-red-500">*</span></label>
// // // //           <div className="flex items-center w-full">
// // // //             <button
// // // //               type="button"
// // // //               onClick={() => setSegmentsOpen(!segmentsOpen)}
// // // //               // ✅ MODIFIED CLASSES: Added 'overflow-hidden' to the button to contain the span
// // // //               className="flex-1 flex items-center justify-between border border-[#B0B2F7] rounded p-2 bg-white text-sm h-10 overflow-hidden"
// // // //               disabled={isAnySubmitting}
// // // //             >
// // // //               {/* ✅ MODIFIED SPAN: 'truncate' handles the ... when it touches the border */}
// // // //               <span
// // // //                 className="text-sm text-gray-700 truncate block w-full text-left"
// // // //                 title={segmentsDisplay} // Shows full list on hover
// // // //               >
// // // //                 {segmentsDisplay}
// // // //               </span>
// // // //               <svg className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
// // // //             </button>
// // // //             <button
// // // //               type="button"
// // // //               onClick={() => setSegmentsOpen(true)}
// // // //               className="ml-4 px-8 bg-[#7747EE] text-white rounded-full text-sm flex-shrink-0 h-9"
// // // //               disabled={isAnySubmitting}
// // // //             >
// // // //               Add
// // // //             </button>
// // // //           </div>

// // // //           {segmentsOpen && (
// // // //             <div className="absolute z-30 mt-2 w-full bg-white border border-[#E2E8F0] rounded shadow-sm p-3 max-h-48 overflow-auto hide-scroll">
// // // //               {loadingSegments ? (
// // // //                 <div className="text-sm text-gray-500 text-center py-2">Loading segments...</div>
// // // //               ) : availableSegments.length === 0 ? (
// // // //                 <div className="text-sm text-gray-500 text-center py-2">No segments found</div>
// // // //               ) : (
// // // //                 availableSegments.map((seg) => {
// // // //                   const name = seg.segment_name || seg.name;
// // // //                   const isChecked = selectedSegments.includes(name);
// // // //                   return (
// // // //                     <label key={seg.id} className="flex items-center gap-3 py-2 text-sm cursor-pointer select-none">
// // // //                       <input type="checkbox" checked={isChecked} onChange={() => !isAnySubmitting && toggleSegment(seg)} className="sr-only" disabled={isAnySubmitting} />
// // // //                       <span className={"w-4 h-4 rounded border-2 flex items-center justify-center transition-all " + (isChecked ? "border-[#7747EE] bg-[#7747EE]" : "border-[#7747EE] bg-white")}>
// // // //                         <svg className={`${isChecked ? "opacity-100" : "opacity-0"} w-3 h-3 text-white transition-opacity`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
// // // //                       </span>
// // // //                       <span>{name}</span>
// // // //                     </label>
// // // //                   );
// // // //                 })
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* ... [Rest of the JSX for Cards, Tokens, Footer remains exactly the same] ... */}
// // // //       <div className="mt-6 bg-[#FBFCFD] border border-gray-100 rounded p-4">
// // // //         <div className="mb-4 inter-20">BIN Ranges:</div>
// // // //         <div className="overflow-auto hide-scroll" style={{ maxHeight: "150px" }}>
// // // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // // //             {selectedSegments.length === 0 ? (
// // // //               <div className="col-span-1 md:col-span-3 text-sm text-gray-500">No segments selected</div>
// // // //             ) : (
// // // //               selectedSegments.map((segName) => {
// // // //                 const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
// // // //                 let availableRanges = originalSeg && originalSeg.bin_ranges ? originalSeg.bin_ranges.map(formatBinRange) : ["N/A - N/A"];
// // // //                 return (
// // // //                   <div key={segName} className="bg-white border border-gray-100 p-4 rounded relative">
// // // //                     <button onClick={() => !isAnySubmitting && removeSegmentCard(segName)} className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#7747EE] text-[8px] flex items-center justify-center text-[#ffffff]" disabled={isAnySubmitting}>✕</button>
// // // //                     <div className="text-sm font-medium mb-2 ">{segName}</div>
// // // //                     <div className="text-xs text-gray-400 mb-3 border-t border-[#E2E8F0]" />
// // // //                     <div className="space-y-3">
// // // //                       {availableRanges.map((r) => {
// // // //                         const isChecked = (segmentRanges[segName] || []).includes(r);
// // // //                         return (
// // // //                           <label key={`${segName}-${r}`} className="flex items-start gap-3 text-sm cursor-pointer select-none">
// // // //                             <input type="checkbox" checked={isChecked} onChange={() => !isAnySubmitting && toggleRangeForSegment(segName, r)} className="sr-only" disabled={isAnySubmitting} />
// // // //                             <span className={"w-4 h-4 rounded border-2 flex items-center justify-center transition-all " + (isChecked ? "border-[#7747EE] bg-[#7747EE]" : "border-[#7747EE] bg-white")}>
// // // //                               <svg className={`${isChecked ? "opacity-100" : "opacity-0"} w-4 h-4 text-white transition-opacity`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
// // // //                             </span>
// // // //                             <div className="text-xs text-gray-700 leading-5">From - {r.split(" - ")[0]} &nbsp; TO - &nbsp; {r.split(" - ")[1]}</div>
// // // //                           </label>
// // // //                         );
// // // //                       })}
// // // //                       {availableRanges.length === 0 && <div className="text-xs text-gray-400">No BIN ranges defined</div>}
// // // //                     </div>
// // // //                   </div>
// // // //                 );
// // // //               })
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="mt-4 bg-[#F7F9FB] border border-[#E2E8F0] rounded p-4">
// // // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
// // // //           <div className="p-3 flex flex-col self-stretch min-h-[160px]">
// // // //             <label className="block text-sm text-gray-700 mb-2">Apple Tokens</label>
// // // //             <textarea
// // // //               value={tokenInput}
// // // //               onChange={(e) => setTokenInput(e.target.value)}
// // // //               onKeyDown={handleTokenKeyDown}
// // // //               placeholder="Enter Apple Tokens (comma separated)"
// // // //               className="w-full flex-1 bg-[#ffffff] resize-none border border-[#B0B2F7] rounded p-2 text-sm placeholder-gray-300 focus:outline-none focus:border-2 focus:border-[#7747EE]"
// // // //               disabled={isAnySubmitting}
// // // //             />
// // // //             <button onClick={handleAddTokens} className="mt-3 px-8 h-9 bg-[#7747EE] text-white rounded-full text-sm self-start" type="button" disabled={isAnySubmitting}>ADD</button>
// // // //           </div>
// // // //           <div className="bg-white border border-[#E2E8F0] rounded p-3 self-stretch min-h-[120px]">
// // // //             <div className="text-sm text-gray-700 mb-2">Added Tokens</div>
// // // //             <div className="max-h-[160px] hide-scroll overflow-auto">
// // // //               {tokens.length === 0 ? <div className="text-xs text-gray-400">No tokens added</div> : (
// // // //                 <ul className="space-y-2">
// // // //                   {tokens.map((t) => (
// // // //                     <li key={t.value} className="flex items-center justify-between">
// // // //                       <label className="relative flex items-center gap-3 py-1 cursor-pointer select-none text-sm">
// // // //                         <input type="checkbox" checked={t.checked} onChange={() => !isAnySubmitting && toggleTokenChecked(t.value)} className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 w-4 h-4" disabled={isAnySubmitting} />
// // // //                         <span className={"w-4 h-4 rounded border-2 flex items-center justify-center transition-all " + (t.checked ? "border-[#7747EE] bg-[#7747EE]" : "border-[#7747EE] bg-white")}>
// // // //                           <svg className={`${t.checked ? "opacity-100" : "opacity-0"} w-3 h-3 text-white transition-opacity`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
// // // //                         </span>
// // // //                         <span className="text-xs text-gray-700 pl-1">{t.value}</span>
// // // //                       </label>
// // // //                     </li>
// // // //                   ))}
// // // //                 </ul>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex justify-between items-center">
// // // //         <button onClick={onPrevious} className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] disabled:opacity-50" disabled={isAnySubmitting}>
// // // //           <span className="flex justify-center items-center gap-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>Previous</span>
// // // //         </button>
// // // //         <div className="flex gap-3">
// // // //           {isEditMode && (
// // // //             <button onClick={() => handleSubmit('update')} disabled={isAnySubmitting} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70 transition-colors">
// // // //               {isUpdateSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
// // // //               {isUpdateSubmitting ? "Updating..." : "Update"}
// // // //             </button>
// // // //           )}
// // // //           <button onClick={() => handleSubmit('next')} disabled={isLoadingData || isAnySubmitting} className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center disabled:opacity-70">
// // // //             {isLoadingData ? <Loader2 className="w-4 h-4 animate-spin" /> : (isNextSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
// // // //             {isLoadingData ? "Loading..." : (isNextSubmitting ? "Saving..." : "Next →")}
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {isAnySubmitting && (
// // // //           <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
// // // //               <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
// // // //           </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default BINConfig;


// // import React, { useEffect, useRef, useState } from "react";
// // import { Loader2, ArrowRight } from "lucide-react";
// // import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
// // import Swal from "sweetalert2";
// // import StepHeader from "../StepReusable/Stepheader";

// // const BINConfig = ({
// //   data,
// //   onUpdate,
// //   onNext,
// //   onPrevious,
// //   campaignId,
// //   isEditMode,
// //   onRefresh,
// // }) => {
// //   const [availableSegments, setAvailableSegments] = useState([]);
// //   const [loadingSegments, setLoadingSegments] = useState(false);
// //   const [segmentsOpen, setSegmentsOpen] = useState(false);
// //   const [selectedSegments, setSelectedSegments] = useState([]);
// //   const [segmentRanges, setSegmentRanges] = useState({});
// //   const [tokens, setTokens] = useState([]); // Global state for tokens across all segments
// //   const [isLoadingData, setIsLoadingData] = useState(false);
// //   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
// //   const [isNextSubmitting, setIsNextSubmitting] = useState(false);

// //   const segRef = useRef(null);
// //   const isInitialized = useRef(false);

// //   const formatBinRange = (binObj) => {
// //     if (!binObj) return "";
// //     return `${binObj.start_bin} - ${binObj.end_bin}`;
// //   };

// //   // ✅ Clean Payload Logic: Omit detail arrays if "All" is true
// //   const generatePayload = (
// //     currSegments = selectedSegments,
// //     currRanges = segmentRanges,
// //     currTokens = tokens
// //   ) => {
// //     return currSegments.map((segName) => {
// //       const originalSeg = availableSegments.find(
// //         (s) => (s.segment_name || s.name) === segName
// //       );

// //       const masterRanges = originalSeg?.bin_ranges?.map(formatBinRange) || [];
// //       const masterTokens = (
// //         originalSeg?.apple_tokens ||
// //         originalSeg?.discount_apple_tokens ||
// //         []
// //       ).map((t) => t.token_value || t);

// //       const selectedRanges = currRanges[segName] || [];
// //       const selectedTokens = currTokens
// //         .filter((t) => t.checked && masterTokens.includes(t.value))
// //         .map((t) => t.value);

// //       const isAllBins = masterRanges.length > 0 && selectedRanges.length === masterRanges.length;
// //       const isAllTokens = masterTokens.length > 0 && selectedTokens.length === masterTokens.length;

// //       const segmentObj = {
// //         segment_id: originalSeg?.id,
// //         all_bins: isAllBins,
// //         all_tokens: isAllTokens,
// //       };

// //       if (!isAllBins && selectedRanges.length > 0) {
// //         const binPayload = selectedRanges
// //           .filter((r) => r !== "N/A - N/A")
// //           .map((range) => {
// //             const [start, end] = range.split(" - ");
// //             return { start_bin: start.trim(), end_bin: end.trim() };
// //           });
// //         if (binPayload.length > 0) segmentObj.discount_bins = binPayload;
// //       }

// //       if (!isAllTokens && selectedTokens.length > 0) {
// //         segmentObj.discount_apple_tokens = selectedTokens.map((v) => ({ token_value: v }));
// //       }

// //       return segmentObj;
// //     });
// //   };

// //   const updateParent = (updates) => {
// //     onUpdate({
// //       ...updates,
// //       finalSegmentsData: generatePayload(
// //         updates.selectedSegments || selectedSegments,
// //         updates.segmentRanges || segmentRanges,
// //         updates.tokens || tokens
// //       ),
// //     });
// //   };

// //   // ✅ Functional Updater for BIN Ranges
// //   const handleToggleAllRanges = (segName, masterRanges) => {
// //     setSegmentRanges((prev) => {
// //       const current = prev[segName] || [];
// //       const next = current.length === masterRanges.length ? [] : [...masterRanges];
// //       const updated = { ...prev, [segName]: next };
// //       updateParent({ segmentRanges: updated });
// //       return updated;
// //     });
// //   };

// //   // ✅ Fixed: Functional Updater for Apple Tokens (Mirroring BIN logic)
// //   const handleToggleAllTokens = (segMetaTokens) => {
// //     const tokenValues = segMetaTokens.map((t) => t.token_value || t);
// //     setTokens((prev) => {
// //       const isAllChecked = tokenValues.every(
// //         (v) => prev.find((tk) => tk.value === v)?.checked
// //       );
// //       const next = prev.map((tk) =>
// //         tokenValues.includes(tk.value) ? { ...tk, checked: !isAllChecked } : tk
// //       );
// //       updateParent({ tokens: next });
// //       return next;
// //     });
// //   };

// //   const mapApiDataToState = (discountData) => {
// //     const segmentsApi = discountData.discount_segments || discountData.segments || [];
// //     const newSelectedSegments = [];
// //     const newSegmentRanges = {};
// //     const newTokens = [...tokens]; // Start with current local tokens

// //     segmentsApi.forEach((segment) => {
// //       const segName = segment.segment_name || segment.name;
// //       if (!newSelectedSegments.includes(segName)) newSelectedSegments.push(segName);

// //       const masterSegment = availableSegments.find((s) => (s.segment_name || s.name) === segName);
      
// //       // Map Bins
// //       let masterRanges = masterSegment?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
// //       newSegmentRanges[segName] = segment.all_bins ? masterRanges : (segment.discount_bins || []).map(formatBinRange);

// //       // Map Tokens (Ensuring checked status from API is respected)
// //       const apiTokens = (segment.discount_apple_tokens || []).map(t => t.token_value || t);
      
// //       // Get all available tokens for this segment from Metadata
// //       const metadataTokens = (masterSegment?.apple_tokens || []).map(t => t.token_value || t);

// //       metadataTokens.forEach(tokenVal => {
// //         const existingIndex = newTokens.findIndex(t => t.value === tokenVal);
// //         const isCheckedInApi = apiTokens.includes(tokenVal);
        
// //         if (existingIndex > -1) {
// //           newTokens[existingIndex].checked = isCheckedInApi;
// //         } else {
// //           newTokens.push({ value: tokenVal, checked: isCheckedInApi });
// //         }
// //       });
// //     });

// //     setSelectedSegments(newSelectedSegments);
// //     setSegmentRanges(newSegmentRanges);
// //     setTokens(newTokens);
// //   };

// //   useEffect(() => {
// //     const fetchSegments = async () => {
// //       setLoadingSegments(true);
// //       try {
// //         const res = await metadataApi.getSegments();
// //         const rows = res.data?.rows || res.data || [];
// //         setAvailableSegments(rows);
        
// //         // Pre-populate global tokens state with all metadata tokens (initially unchecked)
// //         const allMetaTokens = [];
// //         rows.forEach(seg => {
// //           (seg.apple_tokens || []).forEach(t => {
// //             const val = t.token_value || t;
// //             if (!allMetaTokens.some(mt => mt.value === val)) {
// //               allMetaTokens.push({ value: val, checked: false });
// //             }
// //           });
// //         });
// //         setTokens(allMetaTokens);
// //       } catch (err) { console.error(err); }
// //       finally { setLoadingSegments(false); }
// //     };
// //     fetchSegments();
// //   }, []);

// //   useEffect(() => {
// //     if (campaignId && availableSegments.length > 0 && !isInitialized.current) {
// //       const fetchStepData = async () => {
// //         setIsLoadingData(true);
// //         try {
// //           const res = await campaignDiscountApi.getById(campaignId);
// //           const d = res.data?.discount || {};
// //           if (d.discount_segments?.length > 0) {
// //             mapApiDataToState(d);
// //             isInitialized.current = true;
// //           }
// //         } catch (err) { console.error(err); }
// //         finally { setIsLoadingData(false); }
// //       };
// //       fetchStepData();
// //     }
// //   }, [campaignId, availableSegments.length]);

// //   const toggleSegment = (segment) => {
// //     const name = segment.segment_name || segment.name;
// //     const isSelected = selectedSegments.includes(name);

// //     let newNames = isSelected ? selectedSegments.filter((s) => s !== name) : [...selectedSegments, name];
// //     let newRanges = { ...segmentRanges };
// //     if (isSelected) delete newRanges[name];
// //     else newRanges[name] = segment.bin_ranges?.length ? segment.bin_ranges.map(formatBinRange) : ["N/A - N/A"];

// //     setSelectedSegments(newNames);
// //     setSegmentRanges(newRanges);
// //     updateParent({ selectedSegments: newNames, segmentRanges: newRanges });
// //   };

// //   const handleSubmit = async (action) => {
// //     if (selectedSegments.length === 0) {
// //       return Swal.fire({ icon: "warning", title: "Selection Required", text: "Please select a segment." });
// //     }

// //     for (const segName of selectedSegments) {
// //       const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
// //       const masterTokens = (originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || []).map(t => t.token_value || t);
// //       const currentRanges = segmentRanges[segName] || [];
// //       const currentTokens = tokens.filter(t => t.checked && masterTokens.includes(t.value));

// //       if (currentRanges.length === 0) return Swal.fire({ icon: "error", title: "BIN Required", html: `Select BIN Range for <b>${segName}</b>` });
// //       if (currentTokens.length === 0) return Swal.fire({ icon: "error", title: "Token Required", html: `Select Apple Token for <b>${segName}</b>` });
// //     }

// //     action === "update" ? setIsUpdateSubmitting(true) : setIsNextSubmitting(true);
// //     try {
// //       const payload = generatePayload();
// //       await campaignDiscountApi.update(campaignId, { discount: { discount_segments: payload } });
// //       if (onRefresh) await onRefresh();
// //       if (action === "next") onNext();
// //       Swal.fire({ icon: "success", title: "Saved", timer: 1500, showConfirmButton: false });
// //     } catch (error) { Swal.fire({ icon: "error", title: "Error", text: "Save failed" }); }
// //     finally {
// //       setIsUpdateSubmitting(false);
// //       setIsNextSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
// //       <StepHeader step={2} totalSteps={9} title="BIN Configuration" />

// //       {/* Segment Selector */}
// //       <div className="bg-[#F7F9FB] border border-[#E2E8F0] rounded p-4 mb-6">
// //         <label className="block text-sm text-gray-700 mb-2 font-medium">Select Segment Name <span className="text-red-500">*</span></label>
// //         <div className="flex gap-4">
// //           <button type="button" onClick={() => setSegmentsOpen(!segmentsOpen)} className="flex-1 flex items-center justify-between border border-[#B0B2F7] rounded p-2 bg-white text-sm h-10 overflow-hidden text-left">
// //             <span className="truncate block">{selectedSegments.length ? selectedSegments.join(", ") : "Select segment"}</span>
// //             <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" /></svg>
// //           </button>
// //           <button type="button" onClick={() => setSegmentsOpen(true)} className="px-8 bg-[#7747EE] text-white rounded-full text-sm h-9">Add</button>
// //         </div>
// //         {segmentsOpen && (
// //           <div className="absolute z-30 mt-2 w-full bg-white border border-[#E2E8F0] rounded shadow-md p-3 max-h-48 overflow-auto">
// //             {availableSegments.map((seg) => {
// //               const name = seg.segment_name || seg.name;
// //               const isChecked = selectedSegments.includes(name);
// //               return (
// //                 <label key={seg.id} className="flex items-center gap-3 py-2 text-sm cursor-pointer select-none">
// //                   <input type="checkbox" checked={isChecked} onChange={() => toggleSegment(seg)} className="sr-only" />
// //                   <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isChecked ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-300 bg-white"}`}>
// //                     {isChecked && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
// //                   </span>
// //                   <span>{name}</span>
// //                 </label>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>

// //       <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${selectedSegments.length > 4 ? "max-h-[700px] overflow-y-auto pr-2 hide-scroll" : ""}`}>
// //         {selectedSegments.map((segName) => {
// //           const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
// //           const segMetaTokens = originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || [];
// //           const availableRanges = originalSeg?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
          
// //           const isAllRanges = (segmentRanges[segName] || []).length === availableRanges.length;
// //           const isAllTokens = segMetaTokens.length > 0 && segMetaTokens.every(t => tokens.find(tk => tk.value === (t.token_value || t))?.checked);

// //           return (
// //             <div key={segName} className="bg-white border border-gray-100 rounded p-4 relative shadow-sm h-fit">
// //               <button onClick={() => toggleSegment(originalSeg)} className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#7747EE] text-[8px] flex items-center justify-center text-[#ffffff] z-10">✕</button>
// //               <div className="text-sm font-medium mb-2">{segName}</div>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-4">
// //                 {/* BIN Ranges Column */}
// //                 <div>
// //                   <div className="flex items-center justify-between mb-3 pr-2 border-b border-[#E2E8F0] pb-2">
// //                     <label className="flex items-center gap-2 cursor-pointer select-none">
// //                       <span className="text-[10px] text-gray-500 font-bold uppercase">All</span>
// //                       <input type="checkbox" className="sr-only" checked={isAllRanges} onChange={() => handleToggleAllRanges(segName, availableRanges)} />
// //                       <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllRanges ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
// //                         <svg className={`${isAllRanges ? "opacity-100" : "opacity-0"} w-3 h-3 text-white`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
// //                       </span>
// //                     </label>
// //                   </div>
// //                   <div className="space-y-3">
// //                     {availableRanges.map(r => (
// //                       <label key={r} className="flex items-start gap-3 text-sm cursor-pointer select-none">
// //                         <input type="checkbox" checked={(segmentRanges[segName] || []).includes(r)} onChange={() => {
// //                           setSegmentRanges(prev => {
// //                             const curr = prev[segName] || [];
// //                             const next = curr.includes(r) ? curr.filter(x => x !== r) : [...curr, r];
// //                             const updated = { ...prev, [segName]: next };
// //                             updateParent({ segmentRanges: updated });
// //                             return updated;
// //                           });
// //                         }} className="sr-only" />
// //                         <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${(segmentRanges[segName] || []).includes(r) ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
// //                           {(segmentRanges[segName] || []).includes(r) && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
// //                         </span>
// //                         <div className="text-[11px] text-gray-700 flex items-center gap-1.5 font-medium leading-none">
// //                           {r.split(" - ")[0]} <ArrowRight size={10} className="text-gray-400" /> {r.split(" - ")[1]}
// //                         </div>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Apple Tokens Column */}
// //                 <div>
// //                   <div className="flex items-center justify-between mb-3 pr-2 border-b border-[#E2E8F0] pb-2">
// //                     <label className="flex items-center gap-2 cursor-pointer select-none">
// //                       <span className="text-[10px] text-gray-500 font-bold uppercase">All</span>
// //                       <input type="checkbox" className="sr-only" checked={isAllTokens} onChange={() => handleToggleAllTokens(segMetaTokens)} />
// //                       <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllTokens ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
// //                         <svg className={`${isAllTokens ? "opacity-100" : "opacity-0"} w-3 h-3 text-white`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
// //                       </span>
// //                     </label>
// //                   </div>
// //                   <div className="space-y-3">
// //                     {segMetaTokens.length ? segMetaTokens.map((t) => {
// //                       const val = t.token_value || t;
// //                       const isTChecked = tokens.find(tk => tk.value === val)?.checked;
// //                       return (
// //                         <label key={val} className="flex items-start gap-3 text-sm cursor-pointer select-none">
// //                           <input type="checkbox" checked={isTChecked} onChange={() => {
// //                             // ✅ FIXED: Using Functional Updater for Individual Tokens
// //                             setTokens((prev) => {
// //                               const next = prev.map((tk) => tk.value === val ? { ...tk, checked: !tk.checked } : tk);
// //                               updateParent({ tokens: next });
// //                               return next;
// //                             });
// //                           }} className="sr-only" />
// //                           <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isTChecked ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
// //                             {isTChecked && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
// //                           </span>
// //                           <div className="text-[11px] text-gray-700 truncate font-medium leading-none">{val}</div>
// //                         </label>
// //                       );
// //                     }) : <div className="text-[10px] text-gray-400 italic">No tokens</div>}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       <div className="mt-8 border-t border-[#E2E8F0] pt-4 flex justify-between items-center bg-white">
// //         <button onClick={onPrevious} className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#334155] text-[14px] font-medium hover:bg-gray-50 transition-colors">← Previous</button>
// //         <div className="flex gap-3">
// //           {isEditMode && <button onClick={() => handleSubmit("update")} className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">Update</button>}
// //           <button onClick={() => handleSubmit("next")} className="bg-[#6366F1] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-medium hover:bg-[#4f46e5] transition-colors">Next →</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default BINConfig;


// import React, { useEffect, useRef, useState } from "react";
// import { Loader2, ArrowRight } from "lucide-react";
// import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
// import Swal from "sweetalert2";
// import StepHeader from "../StepReusable/Stepheader";

// const BINConfig = ({
//   data,
//   onUpdate,
//   onNext,
//   onPrevious,
//   campaignId,
//   isEditMode,
//   onRefresh,
// }) => {
//   const [availableSegments, setAvailableSegments] = useState([]);
//   const [loadingSegments, setLoadingSegments] = useState(false);
//   const [segmentsOpen, setSegmentsOpen] = useState(false);
//   const [selectedSegments, setSelectedSegments] = useState([]);
//   const [segmentRanges, setSegmentRanges] = useState({});
//   const [tokens, setTokens] = useState([]);
//   const [isLoadingData, setIsLoadingData] = useState(false);
//   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
//   const [isNextSubmitting, setIsNextSubmitting] = useState(false);

//   const segRef = useRef(null);
//   const isInitialized = useRef(false);

//   const formatBinRange = (binObj) => {
//     if (!binObj) return "";
//     return `${binObj.start_bin} - ${binObj.end_bin}`;
//   };

//   const generatePayload = (
//     currSegments = selectedSegments,
//     currRanges = segmentRanges,
//     currTokens = tokens
//   ) => {
//     return currSegments.map((segName) => {
//       const originalSeg = availableSegments.find(
//         (s) => (s.segment_name || s.name) === segName
//       );

//       const masterRanges = originalSeg?.bin_ranges?.map(formatBinRange) || [];
//       const masterTokens = (
//         originalSeg?.apple_tokens ||
//         originalSeg?.discount_apple_tokens ||
//         []
//       ).map((t) => t.token_value || t);

//       const selectedRanges = currRanges[segName] || [];
//       const selectedTokens = currTokens
//         .filter((t) => t.checked && masterTokens.includes(t.value))
//         .map((t) => t.value);

//       const isAllBins = masterRanges.length > 0 && selectedRanges.length === masterRanges.length;
//       const isAllTokens = masterTokens.length > 0 && selectedTokens.length === masterTokens.length;

//       const segmentObj = {
//         segment_id: originalSeg?.id,
//         all_bins: isAllBins,
//         all_tokens: isAllTokens,
//       };

//       if (!isAllBins && selectedRanges.length > 0) {
//         const binPayload = selectedRanges
//           .filter((r) => r !== "N/A - N/A")
//           .map((range) => {
//             const [start, end] = range.split(" - ");
//             return { start_bin: start.trim(), end_bin: end.trim() };
//           });
//         if (binPayload.length > 0) segmentObj.discount_bins = binPayload;
//       }

//       if (!isAllTokens && selectedTokens.length > 0) {
//         segmentObj.discount_apple_tokens = selectedTokens.map((v) => ({ token_value: v }));
//       }

//       return segmentObj;
//     });
//   };

//   const updateParent = (updates) => {
//     onUpdate({
//       ...updates,
//       finalSegmentsData: generatePayload(
//         updates.selectedSegments || selectedSegments,
//         updates.segmentRanges || segmentRanges,
//         updates.tokens || tokens
//       ),
//     });
//   };

//   const handleToggleAllRanges = (segName, masterRanges) => {
//     setSegmentRanges((prev) => {
//       const current = prev[segName] || [];
//       const next = current.length === masterRanges.length ? [] : [...masterRanges];
//       const updated = { ...prev, [segName]: next };
//       updateParent({ segmentRanges: updated });
//       return updated;
//     });
//   };

//   const handleToggleAllTokens = (segMetaTokens) => {
//     const tokenValues = segMetaTokens.map((t) => t.token_value || t);
//     setTokens((prev) => {
//       const isAllChecked = tokenValues.every(
//         (v) => prev.find((tk) => tk.value === v)?.checked
//       );
//       const next = prev.map((tk) =>
//         tokenValues.includes(tk.value) ? { ...tk, checked: !isAllChecked } : tk
//       );
//       updateParent({ tokens: next });
//       return next;
//     });
//   };

//   const mapApiDataToState = (discountData) => {
//     const segmentsApi = discountData.discount_segments || discountData.segments || [];
//     const newSelectedSegments = [];
//     const newSegmentRanges = {};
//     const newTokens = [...tokens];

//     segmentsApi.forEach((segment) => {
//       const segName = segment.segment_name || segment.name;
//       if (!newSelectedSegments.includes(segName)) newSelectedSegments.push(segName);

//       const masterSegment = availableSegments.find((s) => (s.segment_name || s.name) === segName);
//       let masterRanges = masterSegment?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
//       newSegmentRanges[segName] = segment.all_bins ? masterRanges : (segment.discount_bins || []).map(formatBinRange);

//       const apiTokens = (segment.discount_apple_tokens || []).map(t => t.token_value || t);
//       const metadataTokens = (masterSegment?.apple_tokens || []).map(t => t.token_value || t);

//       metadataTokens.forEach(tokenVal => {
//         const existingIndex = newTokens.findIndex(t => t.value === tokenVal);
//         const isCheckedInApi = apiTokens.includes(tokenVal);
//         if (existingIndex > -1) {
//           newTokens[existingIndex].checked = isCheckedInApi;
//         } else {
//           newTokens.push({ value: tokenVal, checked: isCheckedInApi });
//         }
//       });
//     });

//     setSelectedSegments(newSelectedSegments);
//     setSegmentRanges(newSegmentRanges);
//     setTokens(newTokens);
//   };

//   useEffect(() => {
//     const fetchSegments = async () => {
//       setLoadingSegments(true);
//       try {
//         const res = await metadataApi.getSegments();
//         const rows = res.data?.rows || res.data || [];
//         setAvailableSegments(rows);
//         const allMetaTokens = [];
//         rows.forEach(seg => {
//           (seg.apple_tokens || []).forEach(t => {
//             const val = t.token_value || t;
//             if (!allMetaTokens.some(mt => mt.value === val)) {
//               allMetaTokens.push({ value: val, checked: false });
//             }
//           });
//         });
//         setTokens(allMetaTokens);
//       } catch (err) { console.error(err); }
//       finally { setLoadingSegments(false); }
//     };
//     fetchSegments();
//   }, []);

//   useEffect(() => {
//     if (campaignId && availableSegments.length > 0 && !isInitialized.current) {
//       const fetchStepData = async () => {
//         setIsLoadingData(true);
//         try {
//           const res = await campaignDiscountApi.getById(campaignId);
//           const d = res.data?.discount || {};
//           if (d.discount_segments?.length > 0) {
//             mapApiDataToState(d);
//             isInitialized.current = true;
//           }
//         } catch (err) { console.error(err); }
//         finally { setIsLoadingData(false); }
//       };
//       fetchStepData();
//     }
//   }, [campaignId, availableSegments.length]);

//   // ✅ Updated Toggle logic for Create Mode (All Default)
//   const toggleSegment = (segment) => {
//     const name = segment.segment_name || segment.name;
//     const isSelected = selectedSegments.includes(name);
//     let newNames = isSelected ? selectedSegments.filter((s) => s !== name) : [...selectedSegments, name];
    
//     let newRanges = { ...segmentRanges };
//     if (isSelected) {
//       delete newRanges[name];
//     } else {
//       // In Create Mode or when adding new, default to "All"
//       newRanges[name] = segment.bin_ranges?.length ? segment.bin_ranges.map(formatBinRange) : ["N/A - N/A"];
//     }

//     setTokens((prev) => {
//       let next = [...prev];
//       if (!isSelected) {
//         // When adding a new segment, mark all its metadata tokens as checked: true
//         const segmentMetaTokens = (segment.apple_tokens || []).map(t => t.token_value || t);
//         next = next.map(tk => segmentMetaTokens.includes(tk.value) ? { ...tk, checked: true } : tk);
//       }
      
//       updateParent({ 
//         selectedSegments: newNames, 
//         segmentRanges: newRanges,
//         tokens: next 
//       });
//       return next;
//     });

//     setSelectedSegments(newNames);
//     setSegmentRanges(newRanges);
//   };

//   const handleSubmit = async (action) => {
//     if (selectedSegments.length === 0) {
//       return Swal.fire({ icon: "warning", title: "Selection Required", text: "Please select at least one segment." });
//     }

//     for (const segName of selectedSegments) {
//       const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
//       const masterTokens = (originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || []).map(t => t.token_value || t);
//       const currentRanges = segmentRanges[segName] || [];
//       const currentTokens = tokens.filter(t => t.checked && masterTokens.includes(t.value));

//       if (currentRanges.length === 0) return Swal.fire({ icon: "error", title: "BIN Required", html: `Select BIN Range for <b>${segName}</b>` });
//       if (currentTokens.length === 0) return Swal.fire({ icon: "error", title: "Token Required", html: `Select Apple Token for <b>${segName}</b>` });
//     }

//     action === "update" ? setIsUpdateSubmitting(true) : setIsNextSubmitting(true);
//     try {
//       const payload = generatePayload();
//       await campaignDiscountApi.update(campaignId, { discount: { discount_segments: payload } });
//       if (onRefresh) await onRefresh();
//       if (action === "next") onNext();
//       Swal.fire({ icon: "success", title: "Saved", timer: 1500, showConfirmButton: false });
//     } catch (error) {
//       const errorMessage = error.response?.data?.detail || "Save failed. Please try again.";
//       Swal.fire({ icon: "error", title: "Request Error", text: errorMessage });
//     } finally {
//       setIsUpdateSubmitting(false);
//       setIsNextSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
//       <StepHeader step={2} totalSteps={9} title="BIN Configuration" />

//       {/* Select Dropdown */}
//       <div className="bg-[#F7F9FB] border border-[#E2E8F0] rounded p-4 mb-6">
//         <div ref={segRef} className="relative w-full">
//           <label className="block text-sm text-gray-700 mb-2 font-medium">Select Segment Name <span className="text-red-500">*</span></label>
//           <div className="flex gap-4">
//             <button type="button" onClick={() => setSegmentsOpen(!segmentsOpen)} className="flex-1 flex items-center justify-between border border-[#B0B2F7] rounded p-2 bg-white text-sm h-10 overflow-hidden text-left">
//               <span className="truncate block">{selectedSegments.length ? selectedSegments.join(", ") : "Select segment"}</span>
//               <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" /></svg>
//             </button>
//             <button type="button" onClick={() => setSegmentsOpen(true)} className="px-8 bg-[#7747EE] text-white rounded-full text-sm h-9">Add</button>
//           </div>
//           {segmentsOpen && (
//             <div className="absolute z-30 mt-2 w-full bg-white border border-[#E2E8F0] rounded shadow-md p-3 max-h-48 overflow-auto hide-scroll">
//               {availableSegments.map((seg) => {
//                 const name = seg.segment_name || seg.name;
//                 const isChecked = selectedSegments.includes(name);
//                 return (
//                   <label key={seg.id} className="flex items-center gap-3 py-2 text-sm cursor-pointer select-none">
//                     <input type="checkbox" checked={isChecked} onChange={() => toggleSegment(seg)} className="sr-only" />
//                     <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isChecked ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-300 bg-white"}`}>
//                       {isChecked && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
//                     </span>
//                     <span>{name}</span>
//                   </label>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${selectedSegments.length > 4 ? "max-h-[700px] overflow-y-auto pr-2 hide-scroll" : ""}`}>
//         {selectedSegments.map((segName) => {
//           const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
//           const segMetaTokens = originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || [];
//           const availableRanges = originalSeg?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
//           const isAllRanges = (segmentRanges[segName] || []).length === availableRanges.length;
//           const isAllTokens = segMetaTokens.length > 0 && segMetaTokens.every(t => tokens.find(tk => tk.value === (t.token_value || t))?.checked);

//           return (
//             <div key={segName} className="bg-white border border-gray-100 rounded p-4 relative shadow-sm h-fit">
//               <button onClick={() => toggleSegment(originalSeg)} className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#7747EE] text-[8px] flex items-center justify-center text-[#ffffff] z-10">✕</button>
//               <div className="text-sm font-medium mb-2">{segName}</div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-4">
                
//                 {/* BIN Ranges Column */}
//                 <div>
//                   <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
//                     <label className="flex items-center gap-2 cursor-pointer select-none">
//                       <span className="text-[10px] text-gray-500 font-bold uppercase">All</span>
//                       <input type="checkbox" className="sr-only" checked={isAllRanges} onChange={() => handleToggleAllRanges(segName, availableRanges)} />
//                       <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllRanges ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
//                         <svg className={`${isAllRanges ? "opacity-100" : "opacity-0"} w-3 h-3 text-white`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
//                       </span>
//                     </label>
//                   </div>
//                   <div className={`space-y-3 pr-1 ${availableRanges.length > 5 ? "max-h-[120px] overflow-y-auto hide-scroll" : ""}`}>
//                     {availableRanges.map(r => (
//                       <label key={r} className="flex items-start gap-3 text-sm cursor-pointer select-none">
//                         <input type="checkbox" checked={(segmentRanges[segName] || []).includes(r)} onChange={() => {
//                           setSegmentRanges(prev => {
//                             const curr = prev[segName] || [];
//                             const next = curr.includes(r) ? curr.filter(x => x !== r) : [...curr, r];
//                             const updated = { ...prev, [segName]: next };
//                             updateParent({ segmentRanges: updated });
//                             return updated;
//                           });
//                         }} className="sr-only" />
//                         <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${(segmentRanges[segName] || []).includes(r) ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
//                           {(segmentRanges[segName] || []).includes(r) && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
//                         </span>
//                         <div className="text-[11px] text-gray-700 flex items-center gap-1.5 font-medium leading-none">
//                           {r.split(" - ")[0]} <ArrowRight size={10} className="text-gray-400" /> {r.split(" - ")[1]}
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Apple Tokens Column */}
//                 <div>
//                   <div className="flex items-center justify-between mb-3 border-b border-[#E2E8F0] pb-2">
//                     <label className="flex items-center gap-2 cursor-pointer select-none">
//                       <span className="text-[10px] text-gray-500 font-bold uppercase">All</span>
//                       <input type="checkbox" className="sr-only" checked={isAllTokens} onChange={() => handleToggleAllTokens(segMetaTokens)} />
//                       <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllTokens ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
//                         <svg className={`${isAllTokens ? "opacity-100" : "opacity-0"} w-3 h-3 text-white`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
//                       </span>
//                     </label>
//                   </div>
//                   <div className={`space-y-3 pr-1 ${segMetaTokens.length > 5 ? "max-h-[120px] overflow-y-auto hide-scroll" : ""}`}>
//                     {segMetaTokens.length ? segMetaTokens.map((t) => {
//                       const val = t.token_value || t;
//                       const isTChecked = tokens.find(tk => tk.value === val)?.checked;
//                       return (
//                         <label key={val} className="flex items-start gap-3 text-sm cursor-pointer select-none">
//                           <input type="checkbox" checked={isTChecked} onChange={() => {
//                             setTokens((prev) => {
//                               const next = prev.map((tk) => tk.value === val ? { ...tk, checked: !tk.checked } : tk);
//                               updateParent({ tokens: next });
//                               return next;
//                             });
//                           }} className="sr-only" />
//                           <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isTChecked ? "bg-[#7747EE] border-[#7747EE]" : "border-gray-200 bg-white"}`}>
//                             {isTChecked && <svg className="w-3 h-3 text-white transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
//                           </span>
//                           <div className="text-[11px] text-gray-700 truncate font-medium leading-none">{val}</div>
//                         </label>
//                       );
//                     }) : <div className="text-[10px] text-gray-400 italic">No tokens</div>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-8 border-t border-[#E2E8F0] pt-4 flex justify-between items-center bg-white">
//         <button onClick={onPrevious} className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#334155] text-[14px] font-medium hover:bg-gray-50 transition-colors">← Previous</button>
//         <div className="flex gap-3">
//           {isEditMode && <button onClick={() => handleSubmit("update")} className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">Update</button>}
//           <button onClick={() => handleSubmit("next")} className="bg-[#6366F1] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-medium hover:bg-[#4f46e5] transition-colors">Next →</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BINConfig;

import React, { useEffect, useRef, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
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

  const segRef = useRef(null);
  const isInitialized = useRef(false);

  const formatBinRange = (binObj) => {
    if (!binObj) return "";
    return `${binObj.start_bin} - ${binObj.end_bin}`;
  };

  const generatePayload = (
    currSegments = selectedSegments,
    currRanges = segmentRanges,
    currTokens = tokens
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
      const selectedTokens = currTokens
        .filter((t) => t.checked && masterTokens.includes(t.value))
        .map((t) => t.value);

      const isAllBins = masterRanges.length > 0 && selectedRanges.length === masterRanges.length;
      const isAllTokens = masterTokens.length > 0 && selectedTokens.length === masterTokens.length;

      const segmentObj = {
        segment_id: originalSeg?.id,
        all_bins: isAllBins,
        all_tokens: isAllTokens,
      };

      if (!isAllBins && selectedRanges.length > 0) {
        const binPayload = selectedRanges
          .filter((r) => r !== "N/A - N/A")
          .map((range) => {
            const [start, end] = range.split(" - ");
            return { start_bin: start.trim(), end_bin: end.trim() };
          });
        if (binPayload.length > 0) segmentObj.discount_bins = binPayload;
      }

      if (!isAllTokens && selectedTokens.length > 0) {
        segmentObj.discount_apple_tokens = selectedTokens.map((v) => ({ token_value: v }));
      }

      return segmentObj;
    });
  };

  const updateParent = (updates) => {
    onUpdate({
      ...updates,
      finalSegmentsData: generatePayload(
        updates.selectedSegments || selectedSegments,
        updates.segmentRanges || segmentRanges,
        updates.tokens || tokens
      ),
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

  const mapApiDataToState = (discountData) => {
    const segmentsApi = discountData.discount_segments || discountData.segments || [];
    const newSelectedSegments = [];
    const newSegmentRanges = {};
    const newTokens = [...tokens];

    segmentsApi.forEach((segment) => {
      const segName = segment.segment_name || segment.name;
      if (!newSelectedSegments.includes(segName)) newSelectedSegments.push(segName);

      const masterSegment = availableSegments.find((s) => (s.segment_name || s.name) === segName);
      let masterRanges = masterSegment?.bin_ranges?.map(formatBinRange) || ["N/A - N/A"];
      newSegmentRanges[segName] = segment.all_bins ? masterRanges : (segment.discount_bins || []).map(formatBinRange);

      const apiTokens = (segment.discount_apple_tokens || []).map(t => t.token_value || t);
      const metadataTokens = (masterSegment?.apple_tokens || []).map(t => t.token_value || t);

      metadataTokens.forEach(tokenVal => {
        const existingIndex = newTokens.findIndex(t => t.value === tokenVal);
        const isCheckedInApi = apiTokens.includes(tokenVal);
        if (existingIndex > -1) {
          newTokens[existingIndex].checked = isCheckedInApi;
        } else {
          newTokens.push({ value: tokenVal, checked: isCheckedInApi });
        }
      });
    });

    setSelectedSegments(newSelectedSegments);
    setSegmentRanges(newSegmentRanges);
    setTokens(newTokens);
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
    const name = segment.segment_name || segment.name;
    const isSelected = selectedSegments.includes(name);
    let newNames = isSelected ? selectedSegments.filter((s) => s !== name) : [...selectedSegments, name];
    
    let newRanges = { ...segmentRanges };
    if (isSelected) {
      delete newRanges[name];
    } else {
      // Default to "All" when adding a new segment
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
    // 1. Basic Validation
    if (selectedSegments.length === 0) {
      return Swal.fire({ icon: "warning", title: "Selection Required", text: "Please select at least one segment." });
    }

    for (const segName of selectedSegments) {
      const originalSeg = availableSegments.find(s => (s.segment_name || s.name) === segName);
      const masterTokens = (originalSeg?.apple_tokens || originalSeg?.discount_apple_tokens || []).map(t => t.token_value || t);
      const currentRanges = segmentRanges[segName] || [];
      const currentTokens = tokens.filter(t => t.checked && masterTokens.includes(t.value));

      if (currentRanges.length === 0) return Swal.fire({ icon: "error", title: "BIN Required", html: `Select BIN Range for <b>${segName}</b>` });
      if (currentTokens.length === 0) return Swal.fire({ icon: "error", title: "Token Required", html: `Select Apple Token for <b>${segName}</b>` });
    }

    // ✅ Requirement: If in Edit Mode and clicking "Next", skip API and navigate
    if (isEditMode && action === "next") {
      return onNext();
    }

    // Call API for Create Mode (Next) or for Update button
    action === "update" ? setIsUpdateSubmitting(true) : setIsNextSubmitting(true);
    try {
      const payload = generatePayload();
      await campaignDiscountApi.update(campaignId, { discount: { discount_segments: payload } });
      if (onRefresh) await onRefresh();
      if (action === "next") onNext();
      Swal.fire({ icon: "success", title: "Saved", timer: 1500, showConfirmButton: false });
    } catch (error) {
      // ✅ Handle specific API error details
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
            <button type="button" onClick={() => setSegmentsOpen(!segmentsOpen)} className="flex-1 flex items-center justify-between border border-[#B0B2F7] rounded p-2 bg-white text-sm h-10 overflow-hidden text-left">
              <span className="truncate block">{selectedSegments.length ? selectedSegments.join(", ") : "Select segment"}</span>
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" /></svg>
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
                  {/* ✅ Fixed Scroll: 5 items visible, 6th half */}
                  <div className={`space-y-3 pr-1 ${availableRanges.length > 5 ? "max-h-[155px] overflow-y-auto hide-scroll" : ""}`}>
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
                  {/* ✅ Fixed Scroll: 5 items visible, 6th half */}
                  <div className={`space-y-3 pr-1 ${segMetaTokens.length > 5 ? "max-h-[155px] overflow-y-auto hide-scroll" : ""}`}>
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
          {isEditMode && <button onClick={() => handleSubmit("update")} className="px-6 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">Update</button>}
          <button onClick={() => handleSubmit("next")} className="bg-[#6366F1] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-medium hover:bg-[#4f46e5] transition-colors">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default BINConfig;