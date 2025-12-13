import React, { useState, useEffect } from "react";
import { campaignApi, campaignDiscountApi } from "../utils/metadataApi"; 
import { Loader2 } from "lucide-react"; 
import Swal from 'sweetalert2'; 
import StepHeader from "../StepReusable/Stepheader";

// --- Helper Components ---
const Tag = ({ children, variant = "purple" }) => {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-1 mb-1";
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
          <div className="flex flex-wrap justify-end gap-1">
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

  // --- DATA EXTRACTION (From Props) ---
  const step1 = data.step1 || {};
  const step2 = data.step2 || {};
  const step3 = data.step3 || {};
  const step4 = data.step4 || {};
  const step5 = data.step5 || {};
  const step6 = data.step6 || {}; 
  const step7 = data.step7 || {}; 
  const step8 = data.step8 || {}; 

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
    : (serverData?.discount?.bin_based ? 
        serverData.discount.discount_segments?.reduce((acc, seg) => acc + (seg.discount_bins?.length || 0), 0) 
        : 0);

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

  // MCCs Display
  const getMccDisplay = () => {
    if (step6.discount_mccs && step6.discount_mccs.length > 0) return `${step6.discount_mccs.length} Categories Selected (New)`;
    if (serverData?.discount?.discount_mccs && serverData.discount.discount_mccs.length > 0) return `${serverData.discount.discount_mccs.length} Categories Selected (Existing)`;
    return "All Categories";
  };
  const displayMccs = getMccDisplay();

  // ✅ Card Config Display (Using Step 8)
  const getCardConfigDisplay = () => {
      let netCount = 0;
      if (step8.discount_card_networks && step8.discount_card_networks.length > 0) {
          netCount = step8.discount_card_networks.length;
      } else if (serverData?.discount?.discount_card_networks) {
          netCount = serverData.discount.discount_card_networks.length;
      }

      let typeCount = 0;
      if (step8.discount_card_types && step8.discount_card_types.length > 0) {
          typeCount = step8.discount_card_types.length;
      } else if (serverData?.discount?.discount_card_types) {
          typeCount = serverData.discount.discount_card_types.length;
      }

      if (netCount === 0 && typeCount === 0) return "All Cards";
      return `${netCount} Networks, ${typeCount} Types`;
  };
  const displayCardConfig = getCardConfigDisplay();

  const docsCount = step7.discount_docs?.filter(d => d.doc_name || d.doc_text).length 
    || serverData?.discount?.discount_docs?.length 
    || 0;

  const displayName = step1.name || serverData?.campaign?.name || "Unnamed";
  const displayStart = step1.startDate || (serverData?.campaign?.start_date ? new Date(serverData.campaign.start_date).toLocaleDateString() : "Not set");
  const displayEnd = step1.endDate || (serverData?.campaign?.end_date ? new Date(serverData.campaign.end_date).toLocaleDateString() : "Not set");
  const displayBudget = step1.fundAmount ? Number(step1.fundAmount).toLocaleString() : (serverData?.campaign?.total_budget ? Number(serverData.campaign.total_budget).toLocaleString() : "0");

  const shares = (() => {
    if (step1.bankShare || step1.merchantShare) {
       return { bank: step1.bankShare || 0, merchant: step1.merchantShare || 0, extra: step1.extraShares || [] };
    }
    if (serverData?.discount?.discount_sponsors) {
       const bank = serverData.discount.discount_sponsors.find(s => s.name === "Bank")?.fund_percentage || 0;
       const merch = serverData.discount.discount_sponsors.find(s => s.name === "Merchant")?.fund_percentage || 0;
       const extras = serverData.discount.discount_sponsors.filter(s => s.name !== "Bank" && s.name !== "Merchant").map(s => ({ name: s.name, share: s.fund_percentage }));
       return { bank, merchant: merch, extra: extras };
    }
    return { bank: 0, merchant: 0, extra: [] };
  })();


  // --- SUBMIT HANDLER ---
  const handleFinalSubmit = async (buttonType) => {
      if (!campaignId) {
          Swal.fire({ icon: 'error', title: 'Missing Campaign ID', text: 'Please complete Step 1 first.' });
          return;
      }

      setIsSubmitting(true);

      try {
          // ==========================================
          // A. ROOT LEVEL DATA PREPARATION
          // ==========================================
          const finalName = step1.name || serverData?.campaign?.name;
          const finalDesc = step1.description || serverData?.campaign?.description;
          const finalBudget = step1.fundAmount || serverData?.campaign?.total_budget || 0;
          const finalStart = step1.startDate ? new Date(step1.startDate).toISOString() : serverData?.campaign?.start_date;
          const finalEnd = step1.endDate ? new Date(step1.endDate).toISOString() : serverData?.campaign?.end_date;
          const finalBankId = step1.bank_id || serverData?.campaign?.bank_id || 1;
          const finalBaseCurrency = Number(step1.currency) || serverData?.campaign?.base_currency_id;
          const finalIsMulti = step1.convertToBase !== undefined ? !!step1.convertToBase : serverData?.campaign?.is_multi_currency;

          let finalCurrencies = [];
          if (step1.targetCurrencies && Array.isArray(step1.targetCurrencies)) {
             finalCurrencies = [...step1.targetCurrencies.map(Number)];
             if (step1.currency) finalCurrencies.push(Number(step1.currency));
          } else if (serverData?.campaign?.currencies) {
             finalCurrencies = serverData.campaign.currencies.map(c => c.currency_id);
          } else {
             finalCurrencies = [finalBaseCurrency];
          }
          finalCurrencies = [...new Set(finalCurrencies)];

          let finalSponsors = [];
          if (step1.bankShare || step1.merchantShare) {
              finalSponsors = [
                 { name: "Bank", fund_percentage: Number(step1.bankShare || 0) },
                 { name: "Merchant", fund_percentage: Number(step1.merchantShare || 0) },
                 ...(step1.extraShares || []).map(s => ({ name: s.name, fund_percentage: Number(s.share) }))
              ];
          } else if (serverData?.discount?.discount_sponsors) {
              finalSponsors = serverData.discount.discount_sponsors.map(s => ({ name: s.name, fund_percentage: Number(s.fund_percentage) }));
          }

          // ==========================================
          // 1. SEGMENTS
          // ==========================================
          let sourceSegments = [];
          if (Array.isArray(step2.finalSegmentsData) && step2.finalSegmentsData.length > 0) {
              sourceSegments = step2.finalSegmentsData;
          } else if (serverData?.discount?.discount_segments) {
              sourceSegments = serverData.discount.discount_segments;
          }

          const finalSegments = sourceSegments.map(s => {
              const rawBins = s.bin_ranges || s.discount_bins || [];
              const rawTokens = s.apple_tokens || s.discount_apple_tokens || [];

              const discountBins = rawBins.map(b => ({
                  start_bin: b.start_bin || b.start,
                  end_bin: b.end_bin || b.end
              }));

              const discountTokens = rawTokens.map(t => ({
                  token_value: typeof t === 'string' ? t : (t.token_value || t.token)
              }));

              return { 
                  segment_id: s.segment_id || s.id, 
                  all_bins: s.all_bins ?? (discountBins.length === 0), 
                  all_tokens: s.all_tokens ?? (discountTokens.length === 0), 
                  discount_bins: discountBins,          
                  discount_apple_tokens: discountTokens 
              };
          });

          // ==========================================
          // 2. DATES
          // ==========================================
          let finalDates = [];
          if (Array.isArray(step5.finalDiscountDates) && step5.finalDiscountDates.length > 0) finalDates = step5.finalDiscountDates;
          else if (serverData?.discount?.discount_dates) finalDates = serverData.discount.discount_dates;
          
          if (finalDates.length === 0) {
              setIsSubmitting(false); 
              Swal.fire({ icon: 'warning', title: 'Missing Date Rules', text: 'No dates found from input or server.' });
              return; 
          }

          // ==========================================
          // 3. AMOUNTS & MIDS & MCCs
          // ==========================================
          
          // AMOUNTS
          let finalAmounts = [];
          if (Array.isArray(step3.finalDiscountAmounts) && step3.finalDiscountAmounts.length > 0) finalAmounts = step3.finalDiscountAmounts;
          else if (serverData?.discount?.discount_amounts) finalAmounts = serverData.discount.discount_amounts;

          // MIDS
          let finalMids = [];
          if (Array.isArray(step4.finalMidRestrictions) && step4.finalMidRestrictions.length > 0) finalMids = step4.finalMidRestrictions;
          else if (serverData?.discount?.discount_mids) finalMids = serverData.discount.discount_mids;

          // MCCs
          let finalMccs = [];
          if (step6.discount_mccs && Array.isArray(step6.discount_mccs) && step6.discount_mccs.length > 0) {
              finalMccs = step6.discount_mccs;
          } else if (serverData?.discount?.discount_mccs) {
              finalMccs = serverData.discount.discount_mccs.map(m => ({ mcc_id: m.mcc_id, mcc_group_id: m.mcc_group_id }));
          }
// ✅ CARD NETWORKS (CORRECTED MAPPING)
          let finalNetworks = [];
          if (step8.discount_card_networks && Array.isArray(step8.discount_card_networks) && step8.discount_card_networks.length > 0) {
              // Case A: User data from Step 8 (Fix: Map to IDs)
              finalNetworks = step8.discount_card_networks.map(n => n.card_network_id || n);
          } else if (serverData?.discount?.discount_card_networks) {
              // Case B: Server Data (Objects) -> Extract IDs
              finalNetworks = serverData.discount.discount_card_networks.map(n => n.card_network_id);
          }

          // ✅ CARD TYPES (CORRECTED MAPPING)
          let finalTypes = [];
          if (step8.discount_card_types && Array.isArray(step8.discount_card_types) && step8.discount_card_types.length > 0) {
              // Case A: User data from Step 8 (Fix: Map to IDs)
              finalTypes = step8.discount_card_types.map(t => t.card_type_id || t);
          } else if (serverData?.discount?.discount_card_types) {
              // Case B: Server Data (Objects) -> Extract IDs
              finalTypes = serverData.discount.discount_card_types.map(t => t.card_type_id);
          }
          // DOCS (Using Step 7)
          let finalDocs = [];
          console.log(finalNetworks,"728",finalTypes)
          if (step7.discount_docs && Array.isArray(step7.discount_docs)) {
            finalDocs = step7.discount_docs.filter(d => d.doc_name?.trim() || d.doc_text?.trim());
          } else if (serverData?.discount?.discount_docs) {
            finalDocs = serverData.discount.discount_docs;
          }

          // ==========================================
          // 5. CONSTRUCT FINAL PAYLOAD
          // ==========================================
       
          const fullPayload = {
              name: finalName,
              description: finalDesc,
              total_budget: parseFloat(finalBudget),
              start_date: finalStart,
              end_date: finalEnd,
              bank_id: finalBankId,
              type: "discount",
              base_currency_id: finalBaseCurrency,
              is_multi_currency: finalIsMulti,
              currencies: finalCurrencies,

              discount: {
                  discount_segments: finalSegments, 
                  discount_mids: finalMids,
                  discount_dates: finalDates,
                  discount_amounts: finalAmounts,
                  discount_mccs: finalMccs,
                  discount_sponsors: finalSponsors,

                  // ✅ Now safely sends only IDs: [3, 10]
                  discount_card_networks: finalNetworks, 
                  discount_card_types: finalTypes, 
                  
                  discount_docs: finalDocs,
              }
          };

          console.log("📤 Final Full Payload (Merged):", JSON.stringify(fullPayload, null, 2));

          // UPDATE API Call
          await campaignDiscountApi.update(campaignId, fullPayload);
          
          if (buttonType === 'launch') {
              if (userType === 'admin') {
                  await campaignApi.approveCampaign(campaignId); 
                  Swal.fire({ icon: 'success', title: 'Launched!', text: 'Campaign Updated, Approved & Launched!', confirmButtonColor: '#7B3FE4' });
              } else {
                  Swal.fire({ icon: 'success', title: 'Submitted!', text: 'Campaign Updated & Submitted for Approval!', confirmButtonColor: '#7B3FE4' });
              }
          } else {
              Swal.fire({ icon: 'success', title: 'Saved!', text: 'Campaign Saved Successfully!', confirmButtonColor: '#7B3FE4', timer: 2000, showConfirmButton: false });
          }
          
          if (onRefresh) await onRefresh();
          onSubmit(); 

      } catch (error) {
          console.error("Submission Error:", error);
          const errMsg = error.response?.data?.detail || 'Failed to save campaign.';
          Swal.fire({ icon: 'error', title: 'Submission Failed', text: errMsg, confirmButtonColor: '#d33' });
      } finally {
          setIsSubmitting(false);
      }
  };

  const submitButtonLabel = userType === 'admin' ? "Launch Campaign" : "Submit for Approval";

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
        

            <StepHeader step={9} totalSteps={9} title="Campaign Summary & Review" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SummaryCard title="Campaign Details">
              <DetailRow label="Campaign Name" value={displayName} />
              <DetailRow label="Type" value="Discount Campaign" />
              <DetailRow label="Start Date" value={displayStart} />
              <DetailRow label="End Date" value={displayEnd} />
              <DetailRow label="Documents" value={`${docsCount} Attached`} /> 
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
              <DetailRow label="Included Brands" value={displayMids} />
              <DetailRow label="MCCs" value={displayMccs} /> 
              <DetailRow label="Card Config" value={displayCardConfig} />
              <DetailRow label="TID" value="All Terminals" />
              <DetailRow label="Date & Time Rules" value={displayTimeRules} />
            </SummaryCard>
            
            <SummaryCard title="Fund Setup">
              <DetailRow label="Total Budget" value={displayBudget} />
              <DetailRow label="Bank Share" value={`${shares.bank}%`} />
              <DetailRow label="Merchant Share" value={`${shares.merchant}%`} />
              <div className="flex items-start justify-between py-0.5" style={{ minHeight: '1.5rem' }}>
                <div className="text-xs text-gray-500 w-36">Extra Shares:</div>
                <div className="flex-1 text-right">
                  {(shares.extra && shares.extra.length > 0) ? (
                    <div className="text-sm text-gray-900 font-semibold">
                      {shares.extra.map((s, i) => <div key={i} className="text-xs text-gray-700">{s.name}: {s.share}%</div>)}
                    </div>
                  ) : <div className="text-sm font-semibold text-gray-400">None</div>}
                </div>
              </div>
            </SummaryCard>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
      
            <button onClick={onPrevious} disabled={isSubmitting}  className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] disabled:opacity-50" >
            <span className="flex justify-center items-center gap-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>Previous</span>
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