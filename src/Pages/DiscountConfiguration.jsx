// import React, { useState, useEffect } from "react";
// import { Trash2, Loader2 } from "lucide-react";
// // 👇 Import updated API wrapper
// import { campaignDiscountApi, campaignApi } from "../utils/metadataApi"; 

// const DiscountConfiguration = ({ 
//     data, 
//     onUpdate, 
//     onNext, 
//     onPrevious, 
//     onSuccess, 
//     campaignId, // Passed from Step 1 (e.g., 117)
//     isEditMode,
//     onRefresh // Passed from CampaignForm -> CampaignsPage
// }) => {
//     // --- STATE MANAGEMENT ---
    
//     // Decoupled loading states
//     const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false); // For Update button
//     const [isNextSubmitting, setIsNextSubmitting] = useState(false);     // For Next button
//     const [isLoadingData, setIsLoadingData] = useState(false);           // For fetching initial data
    
//     const isAnySubmitting = isUpdateSubmitting || isNextSubmitting || isLoadingData;

//     // Default structure for a single range row
//     const defaultRange = (idSuffix = "") => ({
//         id: `range_${Date.now()}_${idSuffix}`,
//         minTxn: "",
//         maxTxn: "",
//         value: "",
//         valueType: "%",
//         txnCap: "",
//         taxPercent: "",
//         limitDaily: "", 
//         limitWeekly: "", 
//         limitMonthly: "", 
//     });

//     const [ranges, setRanges] = useState([]);

//     // --- HELPER: Format Data for API Payload ---
//     const prepareFinalData = (currentRanges) => {
//         return currentRanges.map((r) => ({
//             min_txn_amount: r.minTxn ? parseFloat(r.minTxn) : 0,
//             max_txn_amount: r.maxTxn ? parseFloat(r.maxTxn) : null,
            
//             is_percentage: r.valueType === "%",
//             discount_percentage: r.valueType === "%" && r.value ? parseFloat(r.value) : null,
//             discount_amount: r.valueType === "$" && r.value ? parseFloat(r.value) : null,
            
//             max_discount_cap: r.txnCap ? parseFloat(r.txnCap) : null,
//             tax_percentage: r.taxPercent ? parseFloat(r.taxPercent) : null,

//             daily: r.limitDaily ? parseInt(r.limitDaily, 10) : null, 
//             weekly: r.limitWeekly ? parseInt(r.limitWeekly, 10) : null, 
//             monthly: r.limitMonthly ? parseInt(r.limitMonthly, 10) : null, 
//         }));
//     };
    
//     // --- HELPER: Map API Data to Local State ---
//     const mapApiDataToState = (discountData) => {
//         const discountAmounts = discountData.discount_amounts || [];
        
//         if (discountAmounts.length > 0) {
//             const newRanges = discountAmounts.map((r, idx) => ({
//                 id: `range_${Date.now()}_${idx}`, 
//                 minTxn: r.min_txn_amount || "",
//                 maxTxn: r.max_txn_amount || "",
//                 value: r.is_percentage ? r.discount_percentage : r.discount_amount,
//                 valueType: r.is_percentage ? "%" : "$",
//                 txnCap: r.max_discount_cap || "",
//                 taxPercent: r.tax_percentage || "",
//                 limitDaily: r.daily || "", 
//                 limitWeekly: r.weekly || "", 
//                 limitMonthly: r.monthly || "", 
//             }));
//             setRanges(newRanges);
//             // Sync to parent immediately so Summary page has data
//             updateParent(newRanges);
//         } else {
//             // If no ranges exist yet, initialize with one empty row
//             if (ranges.length === 0) setRanges([defaultRange("1")]);
//         }
//     };

//     // --- 1. Fetch Existing Discount Data ---
//     useEffect(() => {
//         if (campaignId) { 
//             console.log(`⏳ Step 3: Fetching Data for Campaign ID: ${campaignId}`);
            
//             const fetchDiscountData = async () => {
//                 setIsLoadingData(true); 
//                 try {
//                     // ✅ Get full campaign details to extract discount amounts
//                     const res = await campaignDiscountApi.getById(campaignId);
//                     const d = res.data?.discount || {};
                    
//                     if (d && d.discount_amounts) {
//                         mapApiDataToState(d);      
//                     } else {
//                         // Init empty if nothing found
//                         setRanges([defaultRange("1")]);
//                     }
//                 } catch (err) {
//                     console.error("Failed to load discount details for step 3", err);
//                 } finally {
//                     setIsLoadingData(false); 
//                 }
//             };
//             fetchDiscountData();
//         }
//     }, [campaignId]); 
    
//     // --- 2. Initialize from Props (Backup) ---
//     useEffect(() => {
//         // Only if we haven't loaded from API yet
//         if (data && data.ranges && ranges.length === 0 && !isLoadingData) {
//             setRanges(data.ranges);
//         } else if (ranges.length === 0 && !isLoadingData) {
//             setRanges([defaultRange("init")]);
//         }
//     }, [data]);


//     // --- CRUD Handlers ---

//     const updateParent = (newRanges) => {
//         onUpdate({ 
//             ranges: newRanges,
//             finalDiscountAmounts: prepareFinalData(newRanges),
//         });
//     };

//     const addRange = () => {
//         const newRanges = [...ranges, defaultRange(String(ranges.length + 1))];
//         setRanges(newRanges);
//         updateParent(newRanges);
//     };

//     const removeRange = (id) => {
//         const newRanges = ranges.filter((r) => r.id !== id);
//         setRanges(newRanges);
//         updateParent(newRanges);
//     };

//     const updateRange = (id, field, val) => {
//         const newRanges = ranges.map((r) => (r.id === id ? { ...r, [field]: val } : r));
//         setRanges(newRanges);
//         updateParent(newRanges);
//     };

//     // --- 🚀 SUBMIT LOGIC ---
//     const handleSubmit = async (action) => {
//         // Basic Validation
//         const invalidRange = ranges.find(r => !r.minTxn || !r.value);
//         if (invalidRange) {
//             alert("Please fill in Min Txn and Percentage/Amount for all ranges.");
//             return;
//         }

//         // Set Loading State
//         if (action === 'update') setIsUpdateSubmitting(true);
//         else setIsNextSubmitting(true);
        
//         try {
//             // 1. Prepare Data
//             const formattedAmounts = prepareFinalData(ranges);
            
//             // Update parent for Summary page
//             updateParent(ranges);

//             // 2. ✅ LOGIC: STRICTLY PUT to Campaign ID
//             if (!campaignId) {
//                 throw new Error("Missing Campaign ID. Please ensure Step 1 is saved.");
//             }

//             // 3. ✅ CONSTRUCT PAYLOAD WITH "discount" WRAPPER
//             const payload = {
//                 discount: {
//                     discount_amounts: formattedAmounts
//                 }
//             };

//             console.log(`📤 Step 3: PUT Payload to Campaign ID ${campaignId}...`, JSON.stringify(payload, null, 2));
            
//             // ✅ CALL PUT API
//             await campaignDiscountApi.update(campaignId, payload); 
            
//             // 3. Handle Navigation / Refresh
//             if (action === 'next') {
//                 console.log("⏭️ Navigating to next step.");
//                 onNext(); 
//             } else if (action === 'update') {
//                 console.log("✅ Step 3 Updated.");
//                 if (onRefresh) await onRefresh(); // Refresh parent list
//             }

//         } catch (error) {
//             console.error("❌ Error saving configuration:", error);
//             const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
//             alert(`Failed to save configuration. Error: ${errorMsg}`);
//         } finally {
//             if (action === 'update') setIsUpdateSubmitting(false);
//             else setIsNextSubmitting(false);
//         }
//     };

//     const fmt = (v) => (v === "" || v == null ? "—" : String(v));
//     const isFormDisabled = isAnySubmitting;

//     return (
//         <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-4">
//                 <div className="flex gap-2 items-center">
//                     <span
//                         className="w-5 h-5 inline-flex items-center justify-center rounded-full"
//                         style={{ background: "#EFEFFD", color: "#7747EE", fontSize: 12 }}
//                     >
//                         3
//                     </span>
//                     <h3 className="card-inside-head">Discount Configuration</h3>
//                 </div>
//                 <div className="text-xs text-gray-500">Step 3 of 6</div>
//             </div>

//             {/* Main Content Area */}
//             <div className="bg-[#F7F9FB] border border-gray-100 rounded p-4 mb-4">
//                 <div className="flex items-center justify-between mb-4">
//                     <div className="text-sm font-medium">Amount Ranges</div>
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={addRange}
//                             className="px-3 py-1 text-sm rounded bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
//                             disabled={isFormDisabled}
//                         >
//                             + Add Range
//                         </button>
//                     </div>
//                 </div>

//                 <div className="max-h-60 overflow-y-auto pr-1 space-y-0 custom-scrollbar">
//                     {ranges.map((r, idx) => (
//                         <div
//                             key={r.id}
//                             className={`grid grid-cols-2 md:grid-cols-12 gap-3 items-start p-4 bg-white relative ${
//                                 idx === 0 ? "rounded-t" : ""
//                             } ${idx === ranges.length - 1 ? "rounded-b" : ""}`}
//                         >
//                             {idx !== ranges.length - 1 && (
//                                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] border-b border-gray-100"></div>
//                             )}

//                             {/* Index Number */}
//                             <div className="col-span-2 md:col-span-1 flex md:justify-center md:pt-2">
//                                 <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#7747EE] text-[#FFFFFF] font-medium text-xs shadow-sm">
//                                     {idx + 1}
//                                 </span>
//                             </div>

//                             {/* Min Txn */}
//                             <div className="col-span-1 md:col-span-2">
//                                 <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Min Txn *</label>
//                                 <input
//                                     type="number"
//                                     value={r.minTxn}
//                                     placeholder="1000"
//                                     onChange={(e) => updateRange(r.id, "minTxn", e.target.value)}
//                                     className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] disabled:bg-gray-50"
//                                     disabled={isFormDisabled}
//                                 />
//                             </div>

//                             {/* Max Txn */}
//                             <div className="col-span-1 md:col-span-2">
//                                 <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Max Txn</label>
//                                 <input
//                                     type="number"
//                                     value={r.maxTxn}
//                                     placeholder="50000"
//                                     onChange={(e) => updateRange(r.id, "maxTxn", e.target.value)}
//                                     className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] disabled:bg-gray-50"
//                                     disabled={isFormDisabled}
//                                 />
//                             </div>

//                             {/* Percentage/Amount */}
//                             <div className="col-span-2 md:col-span-2">
//                                 <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Value *</label>
//                                 <div className="flex items-center">
//                                     <input
//                                         type="number"
//                                         value={r.value}
//                                         placeholder="10"
//                                         onChange={(e) => updateRange(r.id, "value", e.target.value)}
//                                         className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] border-r-0 disabled:bg-gray-50"
//                                         disabled={isFormDisabled}
//                                     />
//                                     <div className="inline-flex shrink-0">
//                                         <button
//                                             onClick={() => updateRange(r.id, "valueType", "%")}
//                                             className={`px-2 py-1.5 text-xs border rounded-l-none border-gray-300 border-l-0 transition-colors disabled:opacity-50 ${
//                                                 r.valueType === "%"
//                                                     ? "bg-[#7747EE] text-white border-[#7747EE]"
//                                                     : "bg-gray-50 text-gray-600 hover:bg-gray-100"
//                                             }`}
//                                             disabled={isFormDisabled}
//                                         >
//                                             %
//                                         </button>
//                                         <button
//                                             onClick={() => updateRange(r.id, "valueType", "$")}
//                                             className={`px-2 py-1.5 text-xs border border-gray-300 border-l-0 rounded-r transition-colors disabled:opacity-50 ${
//                                                 r.valueType === "$"
//                                                     ? "bg-[#7747EE] text-white border-[#7747EE]"
//                                                     : "bg-gray-50 text-gray-600 hover:bg-gray-100"
//                                             }`}
//                                             disabled={isFormDisabled}
//                                         >
//                                             $
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Max Discount Cap */}
//                             <div className="col-span-1 md:col-span-1">
//                                 <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Cap</label>
//                                 <input
//                                     type="number"
//                                     value={r.txnCap}
//                                     placeholder="0"
//                                     onChange={(e) => updateRange(r.id, "txnCap", e.target.value)}
//                                     className="w-full border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
//                                     disabled={isFormDisabled}
//                                 />
//                             </div>
                            
//                             {/* Tax % */}
//                             <div className="col-span-1 md:col-span-1">
//                                 <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tax%</label>
//                                 <input
//                                     type="number"
//                                     value={r.taxPercent}
//                                     placeholder="0"
//                                     onChange={(e) => updateRange(r.id, "taxPercent", e.target.value)}
//                                     className="w-full border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
//                                     disabled={isFormDisabled}
//                                 />
//                             </div>

//                             {/* Usage Limits */}
//                             <div className="col-span-2 md:col-span-4">
//                                 <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Usage Limit</label>
//                                 <div className="flex items-center gap-2">
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         value={r.limitDaily}
//                                         placeholder="Daily"
//                                         onChange={(e) => updateRange(r.id, "limitDaily", e.target.value)}
//                                         className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
//                                         disabled={isFormDisabled}
//                                         title="Daily Limit"
//                                     />
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         value={r.limitWeekly}
//                                         placeholder="Weekly"
//                                         onChange={(e) => updateRange(r.id, "limitWeekly", e.target.value)}
//                                         className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
//                                         disabled={isFormDisabled}
//                                         title="Weekly Limit"
//                                     />
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         value={r.limitMonthly}
//                                         placeholder="Monthly"
//                                         onChange={(e) => updateRange(r.id, "limitMonthly", e.target.value)}
//                                         className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
//                                         disabled={isFormDisabled}
//                                         title="Monthly Limit"
//                                     />
//                                 </div>
//                             </div>
                            
//                             {/* Delete Button */}
//                             <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center md:pt-6">
//                                 <button
//                                     onClick={() => removeRange(r.id)}
//                                     className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
//                                     title="Remove Range"
//                                     disabled={isFormDisabled}
//                                 >
//                                     <Trash2 className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Preview Section */}
//             <div className="bg-[#F7F9FB] overflow-y-auto border border-gray-100 rounded p-4 mb-4" style={{ maxHeight: "150px" }}>
//                 <div className="text-sm font-medium mb-3">Amount Ranges Preview</div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
//                     {ranges.length === 0 || (ranges.length === 1 && !ranges[0].minTxn) ? (
//                         <div className="text-gray-400 text-xs italic col-span-full">Add ranges above to see preview.</div>
//                     ) : (
//                         ranges.map((r, idx) => {
//                             if(!r.minTxn && !r.value) return null;
                            
//                             const left = `${fmt(r.minTxn)} - ${fmt(r.maxTxn)}`;
//                             const valueLabel = r.value ? `${fmt(r.value)}${r.valueType === "%" ? "%" : " Fixed"}` : "";
                            
//                             return (
//                                 <div key={`preview-${r.id}`} className="flex gap-3 items-start bg-white p-2 rounded border border-gray-100">
//                                     <div className="font-medium text-[#7747EE] text-xs pt-0.5">{idx + 1}.</div>
//                                     <div className="text-gray-700 w-full">
//                                         <div className="flex justify-between font-medium">
//                                             <span>Spend: {left}</span>
//                                             <span className="text-green-600">{valueLabel} OFF</span>
//                                         </div>
//                                         <div className="text-[10px] text-gray-400 mt-1 flex gap-2 flex-wrap">
//                                             {r.txnCap && <span className="bg-gray-100 px-1 rounded">Cap: {fmt(r.txnCap)}</span>}
//                                             {r.taxPercent && <span className="bg-gray-100 px-1 rounded">Tax: {fmt(r.taxPercent)}%</span>}
//                                             {r.limitDaily && <span className="bg-gray-100 px-1 rounded">Daily: {r.limitDaily}</span>}
//                                             {r.limitWeekly && <span className="bg-gray-100 px-1 rounded">Weekly: {r.limitWeekly}</span>}
//                                             {r.limitMonthly && <span className="bg-gray-100 px-1 rounded">Monthly: {r.limitMonthly}</span>}
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-6 flex items-center justify-between">
//                 <button
//                     onClick={onPrevious}
//                     className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
//                     disabled={isFormDisabled}
//                 >
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M15 18l-6-6 6-6" />
//                     </svg>
//                     Previous
//                 </button>

//                 <div className="flex gap-3">
//                     {isEditMode && (
//                         <button
//                             onClick={() => handleSubmit('update')}
//                             disabled={isFormDisabled}
//                             className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70 transition-colors"
//                         >
//                             {isUpdateSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
//                             {isUpdateSubmitting ? "Updating..." : "Update"}
//                         </button>
//                     )}
                    
//                     <button
//                         onClick={() => handleSubmit('next')}
//                         disabled={isFormDisabled || isLoadingData}
//                         className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center hover:bg-[#5558dd] transition-colors disabled:opacity-70"
//                     >
//                         {isNextSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
//                         {isNextSubmitting ? "Saving..." : "Next →"}
//                     </button>
//                 </div>
//             </div>

//             {/* Global Loader for blocking UI during fetch/submit */}
//             {isAnySubmitting && (
//                 <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
//                     <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DiscountConfiguration;

import React, { useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";
// 👇 Import updated API wrapper
import { campaignDiscountApi, campaignApi } from "../utils/metadataApi"; 

const DiscountConfiguration = ({ 
    data, 
    onUpdate, 
    onNext, 
    onPrevious, 
    onSuccess, 
    campaignId, // Passed from Step 1 (e.g., 117)
    isEditMode,
    onRefresh // 👇 Received from CampaignForm
}) => {
    // --- STATE MANAGEMENT ---
    
    const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false); 
    const [isNextSubmitting, setIsNextSubmitting] = useState(false);     
    const [isLoadingData, setIsLoadingData] = useState(false);           
    
    const isAnySubmitting = isUpdateSubmitting || isNextSubmitting || isLoadingData;

    // Default structure for a single range row
    const defaultRange = (idSuffix = "") => ({
        id: `range_${Date.now()}_${idSuffix}`,
        minTxn: "",
        maxTxn: "",
        value: "",
        valueType: "%",
        txnCap: "",
        taxPercent: "",
        limitDaily: "", 
        limitWeekly: "", 
        limitMonthly: "", 
    });

    const [ranges, setRanges] = useState([]);

    // --- HELPER: Format Data for API Payload ---
    const prepareFinalData = (currentRanges) => {
        return currentRanges.map((r) => ({
            min_txn_amount: r.minTxn ? parseFloat(r.minTxn) : 0,
            max_txn_amount: r.maxTxn ? parseFloat(r.maxTxn) : null,
            
            is_percentage: r.valueType === "%",
            discount_percentage: r.valueType === "%" && r.value ? parseFloat(r.value) : null,
            discount_amount: r.valueType === "$" && r.value ? parseFloat(r.value) : null,
            
            max_discount_cap: r.txnCap ? parseFloat(r.txnCap) : null,
            tax_percentage: r.taxPercent ? parseFloat(r.taxPercent) : null,

            daily: r.limitDaily ? parseInt(r.limitDaily, 10) : null, 
            weekly: r.limitWeekly ? parseInt(r.limitWeekly, 10) : null, 
            monthly: r.limitMonthly ? parseInt(r.limitMonthly, 10) : null, 
        }));
    };
    
    // --- HELPER: Map API Data to Local State ---
    const mapApiDataToState = (discountData) => {
        const discountAmounts = discountData.discount_amounts || [];
        
        if (discountAmounts.length > 0) {
            const newRanges = discountAmounts.map((r, idx) => ({
                id: `range_${Date.now()}_${idx}`, 
                minTxn: r.min_txn_amount || "",
                maxTxn: r.max_txn_amount || "",
                value: r.is_percentage ? r.discount_percentage : r.discount_amount,
                valueType: r.is_percentage ? "%" : "$",
                txnCap: r.max_discount_cap || "",
                taxPercent: r.tax_percentage || "",
                limitDaily: r.daily || "", 
                limitWeekly: r.weekly || "", 
                limitMonthly: r.monthly || "", 
            }));
            setRanges(newRanges);
            updateParent(newRanges);
        } else {
            if (ranges.length === 0) setRanges([defaultRange("1")]);
        }
    };

    // --- 1. Fetch Existing Discount Data ---
    useEffect(() => {
        if (campaignId) { 
            console.log(`⏳ Step 3: Fetching Data for Campaign ID: ${campaignId}`);
            
            const fetchDiscountData = async () => {
                setIsLoadingData(true); 
                try {
                    const res = await campaignDiscountApi.getById(campaignId);
                    const d = res.data?.discount || {};
                    
                    if (d && d.discount_amounts) {
                        mapApiDataToState(d);      
                    } else {
                        setRanges([defaultRange("1")]);
                    }
                } catch (err) {
                    console.error("Failed to load discount details for step 3", err);
                } finally {
                    setIsLoadingData(false); 
                }
            };
            fetchDiscountData();
        }
    }, [campaignId]); 
    
    // --- 2. Initialize from Props (Backup) ---
    useEffect(() => {
        if (data && data.ranges && ranges.length === 0 && !isLoadingData) {
            setRanges(data.ranges);
        } else if (ranges.length === 0 && !isLoadingData) {
            setRanges([defaultRange("init")]);
        }
    }, [data]);


    // --- CRUD Handlers ---

    const updateParent = (newRanges) => {
        onUpdate({ 
            ranges: newRanges,
            finalDiscountAmounts: prepareFinalData(newRanges),
        });
    };

    const addRange = () => {
        const newRanges = [...ranges, defaultRange(String(ranges.length + 1))];
        setRanges(newRanges);
        updateParent(newRanges);
    };

    const removeRange = (id) => {
        const newRanges = ranges.filter((r) => r.id !== id);
        setRanges(newRanges);
        updateParent(newRanges);
    };

    const updateRange = (id, field, val) => {
        const newRanges = ranges.map((r) => (r.id === id ? { ...r, [field]: val } : r));
        setRanges(newRanges);
        updateParent(newRanges);
    };

    // --- 🚀 SUBMIT LOGIC ---
    const handleSubmit = async (action) => {
        // Basic Validation
        const invalidRange = ranges.find(r => !r.minTxn || !r.value);
        if (invalidRange && !isEditMode) {
            alert("Please fill in Min Txn and Percentage/Amount for all ranges.");
            return;
        }

        // Logic: Decide if we need to call API
        // 1. If Action is Update -> ALWAYS Call API
        // 2. If Action is Next AND Not Edit Mode -> Call API (Save progress)
        // 3. If Action is Next AND Edit Mode -> DO NOT Call API (Just Navigate)
        
        let shouldCallApi = true;
        
        if (isEditMode && action === 'next') {
            shouldCallApi = false;
        }

        // Set Loading State
        if (shouldCallApi) {
            if (action === 'update') setIsUpdateSubmitting(true);
            else setIsNextSubmitting(true);
        }
        
        try {
            // 1. Prepare Data
            const formattedAmounts = prepareFinalData(ranges);
            
            // Update parent for Summary page
            updateParent(ranges);

            if (shouldCallApi) {
                // 2. ✅ LOGIC: STRICTLY PUT to Campaign ID
                if (!campaignId) {
                    throw new Error("Missing Campaign ID. Please ensure Step 1 is saved.");
                }

                // 3. ✅ CONSTRUCT PAYLOAD
                const payload = {
                    discount: {
                        discount_amounts: formattedAmounts
                    }
                };

                console.log(`📤 Step 3: PUT Payload to Campaign ID ${campaignId}...`, JSON.stringify(payload, null, 2));
                
                // ✅ CALL PUT API
                await campaignDiscountApi.update(campaignId, payload); 
                
                if (action === 'update') {
                    console.log("✅ Step 3 Updated.");
                    // ✅ CALL REFRESH
                    if (onRefresh) await onRefresh(); 
                }
            }
            
            // 3. Handle Navigation
            if (action === 'next') {
                onNext(); 
            }

        } catch (error) {
            console.error("❌ Error saving configuration:", error);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to save configuration. Error: ${errorMsg}`);
        } finally {
            setIsUpdateSubmitting(false);
            setIsNextSubmitting(false);
        }
    };

    const fmt = (v) => (v === "" || v == null ? "—" : String(v));
    const isFormDisabled = isAnySubmitting;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2 items-center">
                    <span
                        className="w-5 h-5 inline-flex items-center justify-center rounded-full"
                        style={{ background: "#EFEFFD", color: "#7747EE", fontSize: 12 }}
                    >
                        3
                    </span>
                    <h3 className="card-inside-head">Discount Configuration</h3>
                </div>
                <div className="text-xs text-gray-500">Step 3 of 6</div>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#F7F9FB] border border-gray-100 rounded p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium">Amount Ranges</div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={addRange}
                            className="px-3 py-1 text-sm rounded bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                            disabled={isFormDisabled}
                        >
                            + Add Range
                        </button>
                    </div>
                </div>

                <div className="max-h-60 overflow-y-auto pr-1 space-y-0 custom-scrollbar">
                    {ranges.map((r, idx) => (
                        <div
                            key={r.id}
                            className={`grid grid-cols-2 md:grid-cols-12 gap-3 items-start p-4 bg-white relative ${
                                idx === 0 ? "rounded-t" : ""
                            } ${idx === ranges.length - 1 ? "rounded-b" : ""}`}
                        >
                            {idx !== ranges.length - 1 && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] border-b border-gray-100"></div>
                            )}

                            {/* Index Number */}
                            <div className="col-span-2 md:col-span-1 flex md:justify-center md:pt-2">
                                <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#7747EE] text-[#FFFFFF] font-medium text-xs shadow-sm">
                                    {idx + 1}
                                </span>
                            </div>

                            {/* Min Txn */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Min Txn *</label>
                                <input
                                    type="number"
                                    value={r.minTxn}
                                    placeholder="1000"
                                    onChange={(e) => updateRange(r.id, "minTxn", e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] disabled:bg-gray-50"
                                    disabled={isFormDisabled}
                                />
                            </div>

                            {/* Max Txn */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Max Txn</label>
                                <input
                                    type="number"
                                    value={r.maxTxn}
                                    placeholder="50000"
                                    onChange={(e) => updateRange(r.id, "maxTxn", e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] disabled:bg-gray-50"
                                    disabled={isFormDisabled}
                                />
                            </div>

                            {/* Percentage/Amount */}
                            <div className="col-span-2 md:col-span-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Value *</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={r.value}
                                        placeholder="10"
                                        onChange={(e) => updateRange(r.id, "value", e.target.value)}
                                        className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] border-r-0 disabled:bg-gray-50"
                                        disabled={isFormDisabled}
                                    />
                                    <div className="inline-flex shrink-0">
                                        <button
                                            onClick={() => updateRange(r.id, "valueType", "%")}
                                            className={`px-2 py-1.5 text-xs border rounded-l-none border-gray-300 border-l-0 transition-colors disabled:opacity-50 ${
                                                r.valueType === "%"
                                                    ? "bg-[#7747EE] text-white border-[#7747EE]"
                                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                            disabled={isFormDisabled}
                                        >
                                            %
                                        </button>
                                        <button
                                            onClick={() => updateRange(r.id, "valueType", "$")}
                                            className={`px-2 py-1.5 text-xs border border-gray-300 border-l-0 rounded-r transition-colors disabled:opacity-50 ${
                                                r.valueType === "$"
                                                    ? "bg-[#7747EE] text-white border-[#7747EE]"
                                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                            disabled={isFormDisabled}
                                        >
                                            $
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Max Discount Cap */}
                            <div className="col-span-1 md:col-span-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Cap</label>
                                <input
                                    type="number"
                                    value={r.txnCap}
                                    placeholder="0"
                                    onChange={(e) => updateRange(r.id, "txnCap", e.target.value)}
                                    className="w-full border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
                                    disabled={isFormDisabled}
                                />
                            </div>
                            
                            {/* Tax % */}
                            <div className="col-span-1 md:col-span-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Tax%</label>
                                <input
                                    type="number"
                                    value={r.taxPercent}
                                    placeholder="0"
                                    onChange={(e) => updateRange(r.id, "taxPercent", e.target.value)}
                                    className="w-full border border-gray-300 rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
                                    disabled={isFormDisabled}
                                />
                            </div>

                            {/* Usage Limits */}
                            <div className="col-span-2 md:col-span-4">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Usage Limit</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={r.limitDaily}
                                        placeholder="Daily"
                                        onChange={(e) => updateRange(r.id, "limitDaily", e.target.value)}
                                        className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
                                        disabled={isFormDisabled}
                                        title="Daily Limit"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={r.limitWeekly}
                                        placeholder="Weekly"
                                        onChange={(e) => updateRange(r.id, "limitWeekly", e.target.value)}
                                        className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
                                        disabled={isFormDisabled}
                                        title="Weekly Limit"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        value={r.limitMonthly}
                                        placeholder="Monthly"
                                        onChange={(e) => updateRange(r.id, "limitMonthly", e.target.value)}
                                        className="w-1/3 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7747EE] disabled:bg-gray-50"
                                        disabled={isFormDisabled}
                                        title="Monthly Limit"
                                    />
                                </div>
                            </div>
                            
                            {/* Delete Button */}
                            <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center md:pt-6">
                                <button
                                    onClick={() => removeRange(r.id)}
                                    className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Remove Range"
                                    disabled={isFormDisabled}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-[#F7F9FB] overflow-y-auto border border-gray-100 rounded p-4 mb-4" style={{ maxHeight: "150px" }}>
                <div className="text-sm font-medium mb-3">Amount Ranges Preview</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    {ranges.length === 0 || (ranges.length === 1 && !ranges[0].minTxn) ? (
                        <div className="text-gray-400 text-xs italic col-span-full">Add ranges above to see preview.</div>
                    ) : (
                        ranges.map((r, idx) => {
                            if(!r.minTxn && !r.value) return null;
                            
                            const left = `${fmt(r.minTxn)} - ${fmt(r.maxTxn)}`;
                            const valueLabel = r.value ? `${fmt(r.value)}${r.valueType === "%" ? "%" : " Fixed"}` : "";
                            
                            return (
                                <div key={`preview-${r.id}`} className="flex gap-3 items-start bg-white p-2 rounded border border-gray-100">
                                    <div className="font-medium text-[#7747EE] text-xs pt-0.5">{idx + 1}.</div>
                                    <div className="text-gray-700 w-full">
                                        <div className="flex justify-between font-medium">
                                            <span>Spend: {left}</span>
                                            <span className="text-green-600">{valueLabel} OFF</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 flex gap-2 flex-wrap">
                                            {r.txnCap && <span className="bg-gray-100 px-1 rounded">Cap: {fmt(r.txnCap)}</span>}
                                            {r.taxPercent && <span className="bg-gray-100 px-1 rounded">Tax: {fmt(r.taxPercent)}%</span>}
                                            {r.limitDaily && <span className="bg-gray-100 px-1 rounded">Daily: {r.limitDaily}</span>}
                                            {r.limitWeekly && <span className="bg-gray-100 px-1 rounded">Weekly: {r.limitWeekly}</span>}
                                            {r.limitMonthly && <span className="bg-gray-100 px-1 rounded">Monthly: {r.limitMonthly}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={onPrevious}
                    className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={isFormDisabled}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Previous
                </button>

                <div className="flex gap-3">
                    {isEditMode && (
                        <button
                            onClick={() => handleSubmit('update')}
                            disabled={isFormDisabled}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70 transition-colors"
                        >
                            {isUpdateSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {isUpdateSubmitting ? "Updating..." : "Update"}
                        </button>
                    )}
                    
                    <button
                        onClick={() => handleSubmit('next')}
                        disabled={isFormDisabled || isLoadingData}
                        className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center hover:bg-[#5558dd] transition-colors disabled:opacity-70"
                    >
                        {isNextSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isNextSubmitting ? "Saving..." : "Next →"}
                    </button>
                </div>
            </div>

            {/* Global Loader for blocking UI during fetch/submit */}
            {isAnySubmitting && (
                <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
                </div>
            )}
        </div>
    );
};

export default DiscountConfiguration;