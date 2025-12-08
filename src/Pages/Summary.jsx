


// import React, { useState, useEffect } from "react";
// import { campaignApi, campaignDiscountApi } from "../utils/metadataApi"; 
// import { Loader2 } from "lucide-react"; 

// // --- Helper Components ---
// const Tag = ({ children, variant = "purple" }) => {
//   const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-1";
//   const styles = {
//     purple: "bg-purple-50 text-[#7B3FE4]",
//     gold: "bg-yellow-50 text-yellow-700",
//     gray: "bg-gray-100 text-gray-700",
//     blue: "bg-blue-50 text-blue-700",
//   };
//   let activeVariant = variant;
//   const lower = typeof children === 'string' ? children.toLowerCase() : '';
//   if (lower.includes('gold')) activeVariant = 'gold';
//   if (lower.includes('platinum')) activeVariant = 'gray';
//   if (lower.includes('diamond')) activeVariant = 'blue';
//   return <span className={`${base} ${styles[activeVariant] || styles.gray}`}>{children}</span>;
// };

// const SummaryCard = ({ title, children }) => (
//   <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200 shadow-sm">
//     <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2 flex items-center justify-between">
//       <span>{title}</span>
//     </h3>
//     <div className="text-sm text-gray-600 space-y-2">{children}</div>
//   </div>
// );

// const DetailRow = ({ label, value, isTagRow = false }) => (
//   <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
//     <div className="text-xs text-gray-500 w-36 min-w-[9rem]">{label}:</div>
//     <div className="flex-1 text-right">
//       {isTagRow ? (
//         value && value.length > 0 ? (
//           <div className="flex flex-wrap justify-end gap-2">
//             {value.map((t, i) => (
//               <Tag key={i}>{t}</Tag>
//             ))}
//           </div>
//         ) : (
//           <div className="text-sm font-semibold text-gray-400">Not set</div>
//         )
//       ) : (
//         <div className="text-sm font-semibold text-gray-900">{value || 'Not set'}</div>
//       )}
//     </div>
//   </div>
// );

// // --- Helper: Format Date for API if Step 5 is skipped ---
// const formatToApiDate = (dateStr, isEnd = false) => {
//     if (!dateStr) return null;
//     if (isEnd) return `${dateStr}T23:59:59Z`;
//     return `${dateStr}T00:00:00Z`;
// };

// // --- Main Component ---
// export default function CampaignSummaryUI({ 
//   data = {}, 
//   onPrevious = () => {}, 
//   onSubmit = () => {},
//   isEditMode, 
//   onUpdate,
//   onRefresh, 
//   campaignId 
// }) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [userType, setUserType] = useState("");
//   const [serverData, setServerData] = useState(null);

//   useEffect(() => {
//       const role = localStorage.getItem("usertype");
//       setUserType(role ? role.toLowerCase() : ""); 
//   }, []);

//   // --- DATA EXTRACTION ---
//   const step1 = data.step1 || {};
//   const step2 = data.step2 || {};
//   const step3 = data.step3 || {};
//   const step4 = data.step4 || {};
//   const step5 = data.step5 || {};

//   // 1. FETCH EXISTING DATA
//   useEffect(() => {
//     const fetchExistingData = async () => {
//       if (campaignId) {
//         try {
//           const res = await campaignDiscountApi.getById(campaignId);
//           const apiData = res.data || res; 
          
//           if (apiData) {
//             setServerData(apiData);
//             if(onUpdate && !step1.discount_id && apiData.discount?.id) {
//                 onUpdate({ discount_id: apiData.discount.id });
//             }
//           }
//         } catch (err) {
//           console.error("⚠️ Failed to fetch server data:", err);
//         }
//       }
//     };
//     fetchExistingData();
//   }, [campaignId]);

//   // --- DISPLAY LOGIC ---
//   const displaySegments = (step2.selectedSegments && step2.selectedSegments.length > 0)
//     ? step2.selectedSegments 
//     : (serverData?.discount?.discount_segments?.map(s => s.segment_name || s.name) || []);

//   const binCount = step2.segmentRanges 
//     ? Object.values(step2.segmentRanges).flat().length 
//     : (serverData?.discount?.bin_based ? "Configured on Server" : 0);

//   const discountCount = step3.ranges?.length > 0 
//     ? step3.ranges.length 
//     : (serverData?.discount?.discount_amounts?.length || 0);

//   const timeRulesCount = (step5.patternConfigs?.length || 0) + (step5.specificDateConfigs?.length || 0);
//   const displayTimeRules = timeRulesCount > 0 
//     ? `${timeRulesCount} Rules (New)` 
//     : (serverData?.discount?.discount_dates?.length > 0 ? `${serverData.discount.discount_dates.length} Rules (Existing)` : "All Day / All Week");

//   const displayMids = (step4.selectedMIDs && step4.selectedMIDs.length > 0)
//     ? `${step4.selectedMIDs.length} Brands Selected`
//     : (serverData?.discount?.discount_mids?.length > 0 ? "Merchant Specific (Existing)" : "Global (All Merchants)");


//   // --- SUBMIT HANDLER ---
//   const handleFinalSubmit = async (buttonType) => {
//       if (!campaignId) {
//           alert("⚠️ Error: Campaign ID is missing. Please complete Step 1 first.");
//           return;
//       }

//       setIsSubmitting(true);

//       try {
//           // ==========================================
//           // 1. PREPARE SEGMENTS (Dynamic Boolean Logic)
//           // ==========================================
          
//           let sourceSegments = [];
//           if (Array.isArray(step2.finalSegmentsData) && step2.finalSegmentsData.length > 0) {
//               sourceSegments = step2.finalSegmentsData;
//           } else if (serverData?.discount?.discount_segments) {
//               sourceSegments = serverData.discount.discount_segments;
//           }

//           const finalSegments = sourceSegments.map(s => {
//               // 1. EXTRACT ARRAYS FIRST
//               const binRanges = s.bin_ranges || s.discount_bins || [];
//               const appleTokens = s.apple_tokens || s.discount_apple_tokens || [];

//               // 2. DYNAMIC BOOLEAN CALCULATION (Override server flags)
//               // If Array has items -> false. If Array is empty -> true.
//               const derivedAllBins = binRanges.length > 0 ? false : true;
//               const derivedAllTokens = appleTokens.length > 0 ? false : true;

//               return {
//                   segment_id: s.segment_id || s.id, 
                  
//                   // Use derived values instead of s.all_bins
//                   all_bins: derivedAllBins,
//                   all_tokens: derivedAllTokens,
                  
//                   bin_ranges: binRanges,
//                   apple_tokens: appleTokens
//               };
//           });

//           // ==========================================
//           // 2. PREPARE DATES
//           // ==========================================
//           let finalDates = [];
//           if (Array.isArray(step5.finalDiscountDates) && step5.finalDiscountDates.length > 0) {
//               finalDates = step5.finalDiscountDates;
//           } else if (serverData?.discount?.discount_dates && serverData.discount.discount_dates.length > 0) {
//               finalDates = serverData.discount.discount_dates;
//           } else {
//               finalDates = [{
//                   start_date: formatToApiDate(step1.startDate),
//                   end_date: formatToApiDate(step1.endDate, true),
//                   all_day: true,
//                   discount_times: []
//               }];
//           }

//           // ==========================================
//           // 3. PREPARE AMOUNTS
//           // ==========================================
//           let finalAmounts = [];
//           if (Array.isArray(step3.finalDiscountAmounts) && step3.finalDiscountAmounts.length > 0) {
//               finalAmounts = step3.finalDiscountAmounts;
//           } else if (serverData?.discount?.discount_amounts) {
//               finalAmounts = serverData.discount.discount_amounts;
//           }

//           // ==========================================
//           // 4. PREPARE MIDs
//           // ==========================================
//           let finalMids = [];
//           if (Array.isArray(step4.finalMidRestrictions) && step4.finalMidRestrictions.length > 0) {
//               finalMids = step4.finalMidRestrictions;
//           } else if (serverData?.discount?.discount_mids) {
//               finalMids = serverData.discount.discount_mids;
//           }

//           // ==========================================
//           // 5. CONSTRUCT FINAL PAYLOAD
//           // ==========================================
          
//           // Re-check logic for flags based on finalSegments
//           const isBinBased = finalSegments.some(s => !s.all_bins);
//           const isTokenBased = finalSegments.some(s => !s.all_tokens);

//           const discountPayload = {
//               acquirer_campaign_id: campaignId,
//               segments: finalSegments,
//               discount_mids: finalMids,
//               discount_dates: finalDates,
//               discount_amounts: finalAmounts,
//               discount_sponsors: [
//                   { name: "Bank", fund_percentage: Number(step1.bankShare || 0) },
//                   { name: "Merchant", fund_percentage: Number(step1.merchantShare || 0) },
//                   ...(step1.extraShares || []).map(s => ({ name: s.name, fund_percentage: Number(s.share) }))
//               ],

//               // discount_mccs: (Array.isArray(step5.finalMccs) && step5.finalMccs.length > 0)
//               //   ? step5.finalMccs
//               //   : (serverData?.discount?.discount_mccs || []),
//               // discount_card_networks: serverData?.discount?.discount_card_networks || [], 
//               // discount_card_types: serverData?.discount?.discount_card_types || [], 
              
//               bin_based: isBinBased,
//               appletoken_based: isTokenBased,
//               card_based: serverData?.discount?.card_based ?? false
//           };

//           // UPDATE
//           await campaignDiscountApi.update(campaignId, { discount: discountPayload });
          
//           if (buttonType === 'launch') {
//               if (userType === 'admin') {
//                   await campaignApi.approveCampaign(campaignId); 
//                   alert("Campaign Updated, Approved & Launched!");
//               } else {
//                   alert("Campaign Updated & Submitted for Approval!");
//               }
//           } else {
//               alert("Campaign Saved Successfully!");
//           }
          
//           if (onRefresh) await onRefresh();
//           onSubmit(); 

//       } catch (error) {
//           console.error("Submission Error:", error);
//           if (error.response?.data?.detail) {
//              alert(`Error: ${error.response.data.detail}`);
//           } else {
//              alert("Failed to save campaign.");
//           }
//       } finally {
//           setIsSubmitting(false);
//       }
//   };

//   const submitButtonLabel = userType === 'admin' ? "Launch Campaign" : "Submit for Approval";

//   return (
//     <div className="w-full max-w-6xl mx-auto">
//       <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex gap-2 items-center">
//             <span className="w-5 h-5 inline-flex items-center justify-center rounded-full" style={{ background: "#EFEFFD", color: "#7747EE", fontSize: 12 }}>6</span>
//             <h3 className="card-inside-head">Campaign Summary & Review</h3>
//           </div>
//           <div className="text-xs text-gray-500">Step 6 of 6</div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-6">
//             <SummaryCard title="Campaign Details">
//               <DetailRow label="Campaign Name" value={step1.name || "Unnamed"} />
//               <DetailRow label="Type" value="Discount Campaign" />
//               <DetailRow label="Start Date" value={step1.startDate || "Not set"} />
//               <DetailRow label="End Date" value={step1.endDate || "Not set"} />
//             </SummaryCard>
            
//             <SummaryCard title="BIN Configuration">
//               <DetailRow label="Segment" value={displaySegments} isTagRow />
//               <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
//                 <div className="text-xs text-gray-500 w-36">BIN Ranges:</div>
//                 <div className="flex-1 text-right text-sm text-gray-900 font-semibold">
//                     {typeof binCount === 'number' && binCount > 0 ? `${binCount} ranges` : binCount}
//                 </div>
//               </div>
//             </SummaryCard>
            
//             <SummaryCard title="Discount Configuration">
//               <DetailRow label="Discount Type" value="Discount" />
//               <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
//                 <div className="text-xs text-gray-500 w-36">Discount Slabs:</div>
//                 <div className="flex-1 text-right text-sm text-gray-900 font-semibold">
//                     {discountCount > 0 ? `${discountCount} slabs configured` : 'No slabs configured'}
//                 </div>
//               </div>
//             </SummaryCard>
//           </div>

//           <div className="space-y-6">
//             <SummaryCard title="Restrictions">
//               <DetailRow label="Merchant Scope" value={displayMids.includes("Global") ? "Global" : "Merchant Specific"} />
//               <DetailRow label="Included" value={displayMids} />
//               <DetailRow label="TID" value="All Terminals" />
//               <DetailRow label="Date & Time Rules" value={displayTimeRules} />
//             </SummaryCard>
            
//             <SummaryCard title="Fund Setup">
//               <DetailRow label="Total Budget" value={step1.fundAmount ? Number(step1.fundAmount).toLocaleString() : "0"} />
//               <DetailRow label="Bank Share" value={`${step1.bankShare || 0}%`} />
//               <DetailRow label="Merchant Share" value={`${step1.merchantShare || 0}%`} />
//               <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
//                 <div className="text-xs text-gray-500 w-36">Extra Shares:</div>
//                 <div className="flex-1 text-right">
//                   {(step1.extraShares && step1.extraShares.length > 0) ? (
//                     <div className="text-sm text-gray-900 font-semibold">
//                       {step1.extraShares.map((s, i) => <div key={i} className="text-xs text-gray-700">{s.name}: {s.share}%</div>)}
//                     </div>
//                   ) : <div className="text-sm font-semibold text-gray-400">None</div>}
//                 </div>
//               </div>
//             </SummaryCard>
//           </div>
//         </div>

//         <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
//           <button onClick={onPrevious} disabled={isSubmitting} className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
//             ← Previous
//           </button>

//           <div className="flex justify-end gap-4">
//             <button 
//                 onClick={() => handleFinalSubmit('draft')} 
//                 disabled={isSubmitting}
//                 className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
//             >
//               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Save as Draft"}
//             </button>
            
//             <button 
//                 onClick={() => handleFinalSubmit('launch')}
//                 disabled={isSubmitting}
//                 className="px-8 py-2.5 bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white rounded-lg text-sm font-bold shadow-md hover:from-[#6B3CD6] hover:to-[#8B4DE6] transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70"
//             >
//                {isSubmitting ? "Processing..." : submitButtonLabel}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div> 
//   );
// }

import React, { useState, useEffect } from "react";
import { campaignApi, campaignDiscountApi } from "../utils/metadataApi"; 
import { Loader2 } from "lucide-react"; 
import Swal from 'sweetalert2'; // ✅ Import SweetAlert

// --- Helper Components ---
const Tag = ({ children, variant = "purple" }) => {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-1";
  const styles = {
    purple: "bg-purple-50 text-[#7B3FE4]",
    gold: "bg-yellow-50 text-yellow-700",
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
  };
  let activeVariant = variant;
  const lower = typeof children === 'string' ? children.toLowerCase() : '';
  if (lower.includes('gold')) activeVariant = 'gold';
  if (lower.includes('platinum')) activeVariant = 'gray';
  if (lower.includes('diamond')) activeVariant = 'blue';
  return <span className={`${base} ${styles[activeVariant] || styles.gray}`}>{children}</span>;
};

const SummaryCard = ({ title, children }) => (
  <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200 shadow-sm">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2 flex items-center justify-between">
      <span>{title}</span>
    </h3>
    <div className="text-sm text-gray-600 space-y-2">{children}</div>
  </div>
);

const DetailRow = ({ label, value, isTagRow = false }) => (
  <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
    <div className="text-xs text-gray-500 w-36 min-w-[9rem]">{label}:</div>
    <div className="flex-1 text-right">
      {isTagRow ? (
        value && value.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-2">
            {value.map((t, i) => (
              <Tag key={i}>{t}</Tag>
            ))}
          </div>
        ) : (
          <div className="text-sm font-semibold text-gray-400">Not set</div>
        )
      ) : (
        <div className="text-sm font-semibold text-gray-900">{value || 'Not set'}</div>
      )}
    </div>
  </div>
);

// --- Main Component ---
export default function CampaignSummaryUI({ 
  data = {}, 
  onPrevious = () => {}, 
  onSubmit = () => {},
  isEditMode, 
  onUpdate,
  onRefresh, 
  campaignId 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState("");
  const [serverData, setServerData] = useState(null);

  useEffect(() => {
      const role = localStorage.getItem("usertype");
      setUserType(role ? role.toLowerCase() : ""); 
  }, []);

  // --- DATA EXTRACTION ---
  const step1 = data.step1 || {};
  const step2 = data.step2 || {};
  const step3 = data.step3 || {};
  const step4 = data.step4 || {};
  const step5 = data.step5 || {};

  // 1. FETCH EXISTING DATA
  useEffect(() => {
    const fetchExistingData = async () => {
      if (campaignId) {
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const apiData = res.data || res; 
          
          if (apiData) {
            setServerData(apiData);
            if(onUpdate && !step1.discount_id && apiData.discount?.id) {
                onUpdate({ discount_id: apiData.discount.id });
            }
          }
        } catch (err) {
          console.error("⚠️ Failed to fetch server data:", err);
        }
      }
    };
    fetchExistingData();
  }, [campaignId]);

  // --- DISPLAY LOGIC ---
  const displaySegments = (step2.selectedSegments && step2.selectedSegments.length > 0)
    ? step2.selectedSegments 
    : (serverData?.discount?.discount_segments?.map(s => s.segment_name || s.name) || []);

  const binCount = step2.segmentRanges 
    ? Object.values(step2.segmentRanges).flat().length 
    : (serverData?.discount?.bin_based ? "Configured on Server" : 0);

  const discountCount = step3.ranges?.length > 0 
    ? step3.ranges.length 
    : (serverData?.discount?.discount_amounts?.length || 0);

  const timeRulesCount = (step5.patternConfigs?.length || 0) + (step5.specificDateConfigs?.length || 0);
  const displayTimeRules = timeRulesCount > 0 
    ? `${timeRulesCount} Rules (New)` 
    : (serverData?.discount?.discount_dates?.length > 0 ? `${serverData.discount.discount_dates.length} Rules (Existing)` : "All Day / All Week");

  const displayMids = (step4.selectedMIDs && step4.selectedMIDs.length > 0)
    ? `${step4.selectedMIDs.length} Brands Selected`
    : (serverData?.discount?.discount_mids?.length > 0 ? "Merchant Specific (Existing)" : "Global (All Merchants)");


  // --- SUBMIT HANDLER ---
  const handleFinalSubmit = async (buttonType) => {
      if (!campaignId) {
          Swal.fire({
            icon: 'error',
            title: 'Missing Campaign ID',
            text: 'Please complete Step 1 first.',
            confirmButtonColor: '#7B3FE4'
          });
          return;
      }

      setIsSubmitting(true);

      try {
          // ==========================================
          // 1. PREPARE SEGMENTS (Dynamic Boolean Logic)
          // ==========================================
          let sourceSegments = [];
          if (Array.isArray(step2.finalSegmentsData) && step2.finalSegmentsData.length > 0) {
              sourceSegments = step2.finalSegmentsData;
          } else if (serverData?.discount?.discount_segments) {
              sourceSegments = serverData.discount.discount_segments;
          }

          const finalSegments = sourceSegments.map(s => {
              const binRanges = s.bin_ranges || s.discount_bins || [];
              const appleTokens = s.apple_tokens || s.discount_apple_tokens || [];

              const derivedAllBins = binRanges.length > 0 ? false : true;
              const derivedAllTokens = appleTokens.length > 0 ? false : true;

              return {
                  segment_id: s.segment_id || s.id, 
                  all_bins: derivedAllBins,
                  all_tokens: derivedAllTokens,
                  bin_ranges: binRanges,
                  apple_tokens: appleTokens
              };
          });

          // ==========================================
          // 2. PREPARE DATES (Validation Check)
          // ==========================================
          let finalDates = [];
          
          if (Array.isArray(step5.finalDiscountDates) && step5.finalDiscountDates.length > 0) {
              finalDates = step5.finalDiscountDates;
          } else if (serverData?.discount?.discount_dates && serverData.discount.discount_dates.length > 0) {
              finalDates = serverData.discount.discount_dates;
          } else {
              finalDates = []; 
          }

          // 🛑 VALIDATION: Block if Discount Dates are Empty
          if (finalDates.length === 0) {
             setIsSubmitting(false); // Stop loader
             Swal.fire({
                icon: 'warning',
                title: 'Missing Date Rules',
                text: 'Please select Discount Dates in Step 5 before saving.',
                confirmButtonColor: '#7B3FE4'
             });
             return; // ⛔ STOP EXECUTION HERE
          }

          // ==========================================
          // 3. PREPARE AMOUNTS
          // ==========================================
          let finalAmounts = [];
          if (Array.isArray(step3.finalDiscountAmounts) && step3.finalDiscountAmounts.length > 0) {
              finalAmounts = step3.finalDiscountAmounts;
          } else if (serverData?.discount?.discount_amounts) {
              finalAmounts = serverData.discount.discount_amounts;
          }

          // ==========================================
          // 4. PREPARE MIDs
          // ==========================================
          let finalMids = [];
          if (Array.isArray(step4.finalMidRestrictions) && step4.finalMidRestrictions.length > 0) {
              finalMids = step4.finalMidRestrictions;
          } else if (serverData?.discount?.discount_mids) {
              finalMids = serverData.discount.discount_mids;
          }

          // ==========================================
          // 5. CONSTRUCT FINAL PAYLOAD
          // ==========================================
          const isBinBased = finalSegments.some(s => !s.all_bins);
          const isTokenBased = finalSegments.some(s => !s.all_tokens);

          const discountPayload = {
              acquirer_campaign_id: campaignId,
              segments: finalSegments,
              discount_mids: finalMids,
              discount_dates: finalDates,
              discount_amounts: finalAmounts,
              discount_sponsors: [
                  { name: "Bank", fund_percentage: Number(step1.bankShare || 0) },
                  { name: "Merchant", fund_percentage: Number(step1.merchantShare || 0) },
                  ...(step1.extraShares || []).map(s => ({ name: s.name, fund_percentage: Number(s.share) }))
              ],
              discount_card_networks: serverData?.discount?.discount_card_networks || [], 
              discount_card_types: serverData?.discount?.discount_card_types || [], 
              
              bin_based: isBinBased,
              appletoken_based: isTokenBased,
              card_based: serverData?.discount?.card_based ?? false
          };

          // UPDATE
          await campaignDiscountApi.update(campaignId, { discount: discountPayload });
          
          if (buttonType === 'launch') {
              if (userType === 'admin') {
                  await campaignApi.approveCampaign(campaignId); 
                  Swal.fire({
                    icon: 'success',
                    title: 'Launched!',
                    text: 'Campaign Updated, Approved & Launched!',
                    confirmButtonColor: '#7B3FE4'
                  });
              } else {
                  Swal.fire({
                    icon: 'success',
                    title: 'Submitted!',
                    text: 'Campaign Updated & Submitted for Approval!',
                    confirmButtonColor: '#7B3FE4'
                  });
              }
          } else {
              Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Campaign Saved Successfully!',
                confirmButtonColor: '#7B3FE4',
                timer: 2000,
                showConfirmButton: false
              });
          }
          
          if (onRefresh) await onRefresh();
          onSubmit(); 

      } catch (error) {
          console.error("Submission Error:", error);
          if (error.response?.data?.detail) {
             Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.detail,
                confirmButtonColor: '#d33'
             });
          } else {
             Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Failed to save campaign. Please try again.',
                confirmButtonColor: '#d33'
             });
          }
      } finally {
          setIsSubmitting(false);
      }
  };

  const submitButtonLabel = userType === 'admin' ? "Launch Campaign" : "Submit for Approval";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2 items-center">
            <span className="w-5 h-5 inline-flex items-center justify-center rounded-full" style={{ background: "#EFEFFD", color: "#7747EE", fontSize: 12 }}>6</span>
            <h3 className="card-inside-head">Campaign Summary & Review</h3>
          </div>
          <div className="text-xs text-gray-500">Step 6 of 6</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SummaryCard title="Campaign Details">
              <DetailRow label="Campaign Name" value={step1.name || "Unnamed"} />
              <DetailRow label="Type" value="Discount Campaign" />
              <DetailRow label="Start Date" value={step1.startDate || "Not set"} />
              <DetailRow label="End Date" value={step1.endDate || "Not set"} />
            </SummaryCard>
            
            <SummaryCard title="BIN Configuration">
              <DetailRow label="Segment" value={displaySegments} isTagRow />
              <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
                <div className="text-xs text-gray-500 w-36">BIN Ranges:</div>
                <div className="flex-1 text-right text-sm text-gray-900 font-semibold">
                    {typeof binCount === 'number' && binCount > 0 ? `${binCount} ranges` : binCount}
                </div>
              </div>
            </SummaryCard>
            
            <SummaryCard title="Discount Configuration">
              <DetailRow label="Discount Type" value="Discount" />
              <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
                <div className="text-xs text-gray-500 w-36">Discount Slabs:</div>
                <div className="flex-1 text-right text-sm text-gray-900 font-semibold">
                    {discountCount > 0 ? `${discountCount} slabs configured` : 'No slabs configured'}
                </div>
              </div>
            </SummaryCard>
          </div>

          <div className="space-y-6">
            <SummaryCard title="Restrictions">
              <DetailRow label="Merchant Scope" value={displayMids.includes("Global") ? "Global" : "Merchant Specific"} />
              <DetailRow label="Included" value={displayMids} />
              <DetailRow label="TID" value="All Terminals" />
              <DetailRow label="Date & Time Rules" value={displayTimeRules} />
            </SummaryCard>
            
            <SummaryCard title="Fund Setup">
              <DetailRow label="Total Budget" value={step1.fundAmount ? Number(step1.fundAmount).toLocaleString() : "0"} />
              <DetailRow label="Bank Share" value={`${step1.bankShare || 0}%`} />
              <DetailRow label="Merchant Share" value={`${step1.merchantShare || 0}%`} />
              <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
                <div className="text-xs text-gray-500 w-36">Extra Shares:</div>
                <div className="flex-1 text-right">
                  {(step1.extraShares && step1.extraShares.length > 0) ? (
                    <div className="text-sm text-gray-900 font-semibold">
                      {step1.extraShares.map((s, i) => <div key={i} className="text-xs text-gray-700">{s.name}: {s.share}%</div>)}
                    </div>
                  ) : <div className="text-sm font-semibold text-gray-400">None</div>}
                </div>
              </div>
            </SummaryCard>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
          <button onClick={onPrevious} disabled={isSubmitting} className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            ← Previous
          </button>

          <div className="flex justify-end gap-4">
            <button 
                onClick={() => handleFinalSubmit('draft')} 
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Save as Draft"}
            </button>
            
            <button 
                onClick={() => handleFinalSubmit('launch')}
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white rounded-lg text-sm font-bold shadow-md hover:from-[#6B3CD6] hover:to-[#8B4DE6] transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70"
            >
               {isSubmitting ? "Processing..." : submitButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div> 
  );
}