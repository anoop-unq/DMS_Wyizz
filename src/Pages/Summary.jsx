
import React, { useState, useEffect } from "react";
import { campaignApi, campaignDiscountApi } from "../utils/metadataApi";

import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  Layers, 
  Store, 
  FileText, 
  LayoutDashboard,
  Hash 
} from "lucide-react";
import Swal from "sweetalert2";
import StepHeader from "../StepReusable/Stepheader";


// --- Helper Components ---
const Tag = ({ children, variant = "purple" }) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-1 mb-1";
  const styles = {
    purple: "bg-purple-50 text-[#7B3FE4]",
    gold: "bg-yellow-50 text-yellow-700",
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
  };
  let activeVariant = variant;
  const lower = typeof children === "string" ? children.toLowerCase() : "";
  if (lower.includes("gold")) activeVariant = "gold";
  if (lower.includes("platinum")) activeVariant = "gray";
  if (lower.includes("diamond")) activeVariant = "blue";
  return (
    <span className={`${base} ${styles[activeVariant] || styles.gray}`}>
      {children}
    </span>
  );
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
  <div
    className="flex items-start justify-between py-0.5"
    style={{ minHeight: "1.5rem" }}
  >
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
        <div className="text-sm font-semibold text-gray-900">
          {value || "Not set"}
        </div>
      )}
    </div>
  </div>
);

// const markdownToHtml = (markdown) => {
//   if (!markdown) return '';
  
//   // 1. TYPOGRAPHY & ENCODING CLEANER
//   let html = markdown
//     // Remove the specific "OBJ" box character (\uFFFC)
//     .replace(/\uFFFC/g, '')
//     // Fix mangled apostrophes (the "donâ...t" issue)
//     // This replaces the "â" and any following corrupted boxes with a standard apostrophe
//     .replace(/â[\s\uFFFC\u0080-\u009F]{1,3}/g, "'")
//     // Replace Non-Breaking Spaces with normal spaces
//     .replace(/\u00A0/g, ' ')
//     // Remove other hidden control characters
//     .replace(/[\u1680\u180e\u2000-\u200b\u202f\u205f\u3000\ufeff]/g, '');

//   // 2. Headers
//   html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-900">$1</h3>');
//   html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 text-gray-900">$1</h2>');
//   html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>');

//   // 3. Formatting
//   html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
//   html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
//   html = html.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');

//   // 4. Links & Images
//   html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-4" />');
//   html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
//     '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800 transition-colors font-medium cursor-pointer">$1</a>'
//   );

//   // 5. Lists
//   html = html.replace(/^\s*[\-\*\+] (.*$)/gim, '<li class="ml-4 mb-1">$1</li>');
//   html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside my-4 space-y-1 text-gray-800">${match}</ul>`);

//   html = html.replace(/^\s*\d+\. (.*$)/gim, '<li class="ol-item ml-4 mb-1">$1</li>');
//   html = html.replace(/(<li class="ol-item ml-4">.*?<\/li>\n?)+/g, (match) => {
//     const cleanedMatch = match.replaceAll('ol-item ', '');
//     return `<ol class="list-decimal list-inside my-4 space-y-1 text-gray-800">${cleanedMatch}</ol>`;
//   });

//   // 6. Code & Blockquotes
//   html = html.replace(/`([^`]+)`/g, '<span class="font-mono text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">$1</span>');
//   html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-50 p-4 rounded-lg my-6 font-mono text-sm overflow-x-auto text-gray-800 border border-gray-200 shadow-sm leading-relaxed"><code>$1</code></pre>');
//   html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 italic text-gray-600 my-6 bg-gray-50/30 rounded-r">$1</blockquote>');
  
//   // 7. Spacing Logic
//   html = html.replace(/\n{3,}/g, '<div class="py-6"></div>');
//   html = html.replace(/\n\n/g, '<div class="mb-5"></div>');
//   html = html.replace(/\n(?!(?:<\/?[^>]+>))/g, '<br />');

//   return `<div class="leading-7">${html}</div>`;
// };


const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // 1. TYPOGRAPHY & ENCODING CLEANER
  let html = markdown
    .replace(/\uFFFC/g, '')
    .replace(/â[\s\uFFFC\u0080-\u009F]{1,3}/g, "'")
    .replace(/\u00A0/g, ' ')
    .replace(/[\u1680\u180e\u2000-\u200b\u202f\u205f\u3000\ufeff]/g, '');

  // 2. Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-900">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 text-gray-900">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>');

  // 3. Formatting
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');

  // 4. Links & Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-4" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800 transition-colors font-medium cursor-pointer">$1</a>'
  );

  // 5. Lists
  html = html.replace(/^\s*[\-\*\+] (.*$)/gim, '<li class="ml-4 mb-1">$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside my-4 space-y-1 text-gray-800">${match}</ul>`);

  html = html.replace(/^\s*\d+\. (.*$)/gim, '<li class="ol-item ml-4 mb-1">$1</li>');
  // FIXED: Added "mb-1" to the regex below to match the line above
  html = html.replace(/(<li class="ol-item ml-4 mb-1">.*?<\/li>\n?)+/g, (match) => {
    const cleanedMatch = match.replaceAll('ol-item ', '');
    return `<ol class="list-decimal list-inside my-4 space-y-1 text-gray-800">${cleanedMatch}</ol>`;
  });

  // 6. Code & Blockquotes
  html = html.replace(/`([^`]+)`/g, '<span class="font-mono text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">$1</span>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-50 p-4 rounded-lg my-6 font-mono text-sm overflow-x-auto text-gray-800 border border-gray-200 shadow-sm leading-relaxed"><code>$1</code></pre>');
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 italic text-gray-600 my-6 bg-gray-50/30 rounded-r">$1</blockquote>');
  
  // 7. Spacing Logic
  html = html.replace(/\n{3,}/g, '<div class="py-6"></div>');
  html = html.replace(/\n\n/g, '<div class="mb-5"></div>');
  html = html.replace(/\n(?!(?:<\/?[^>]+>))/g, '<br />');

  return `<div class="leading-7">${html}</div>`;
};

export default function CampaignSummaryUI({
  data = {},
  onPrevious = () => {},
  onSubmit = () => {},
  isEditMode,
  onUpdate,
  onRefresh,
  campaignId,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState("");
  const [serverData, setServerData] = useState(null);

  // ✅ New State: Tracks if user has clicked "Save as Draft"
  const [isDraftSaved, setIsDraftSaved] = useState(false);


const [activeDocIndex, setActiveDocIndex] = useState(0);
const [isDocSwitching, setIsDocSwitching] = useState(false);



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
console.log(step4,"Two Num")

  // 1. FETCH EXISTING DATA
  useEffect(() => {
    const fetchExistingData = async () => {
      if (campaignId) {
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const apiData = res.data || res;

          if (apiData) {
            setServerData(apiData);
            if (onUpdate && !step1.discount_id && apiData.discount?.id) {
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

  // --- DATA PRIORITY LOGIC (Local Payload > API Response) ---
//   const segmentsToDisplay = (step2.finalSegmentsData && step2.finalSegmentsData.length > 0)
//     ? step2.finalSegmentsData
//     : (serverData?.discount?.discount_segments || []);

// 1. Segments Source (Prioritize local session edits)
  const segmentsToDisplay = (step2.finalSegmentsData && step2.finalSegmentsData.length > 0)
    ? step2.finalSegmentsData
    : (serverData?.discount?.discount_segments || []);

 // --- CARD CONFIGURATION NAMES (Cross-referencing Server Data) ---

  // 1. Resolve Network Names
  const networkNames = (() => {
    // If user touched Step 8, use that. Otherwise, use what came from the API.
    const source = (step8.discount_card_networks?.length > 0) 
      ? step8.discount_card_networks 
      : (serverData?.discount?.discount_card_networks || []);

    return source.map(item => {
      // If the item already has the name (from Step 8's hydration logic)
      if (item.card_network_name) return item.card_network_name;

      // If it's just an ID (number), find the name in the original serverData "dictionary"
      const idToLookup = typeof item === 'object' ? (item.card_network_id || item.id) : item;
      const match = serverData?.discount?.discount_card_networks?.find(
        sn => (sn.card_network_id || sn.id || sn.card_network_id) === idToLookup
      );
      
      return match?.card_network_name || match?.name || `ID: ${idToLookup}`;
    });
  })();

  // 2. Resolve Type Names
  const typeNames = (() => {
    const source = (step8.discount_card_types?.length > 0) 
      ? step8.discount_card_types 
      : (serverData?.discount?.discount_card_types || []);

    return source.map(item => {
      if (item.card_type_name) return item.card_type_name;

      const idToLookup = typeof item === 'object' ? (item.card_type_id || item.id) : item;
      const match = serverData?.discount?.discount_card_types?.find(
        st => (st.card_type_id || st.id) === idToLookup
      );

      return match?.card_type_name || match?.name || `ID: ${idToLookup}`;
    });
  })();

  // Priority: local step7 edits > server/API data
const docsToDisplay = (step7.discount_docs && step7.discount_docs.length > 0)
  ? step7.discount_docs
  : (serverData?.discount?.discount_docs || []);
  // Inside CampaignSummaryUI component
const midsToDisplay = (step4.finalMidRestrictions && step4.finalMidRestrictions.length > 0)
  ? step4.finalMidRestrictions
  : (serverData?.discount?.discount_mids || []);

  const displaySegments = segmentsToDisplay.map(s => s.segment_name || s.name);

  const binCount = segmentsToDisplay.reduce((acc, seg) => 
    acc + (seg.bin_ranges?.length || seg.discount_bins?.length || 0), 0
  );

  const appleTokenCount = segmentsToDisplay.reduce((acc, seg) => 
    acc + (seg.apple_tokens?.length || seg.discount_apple_tokens?.length || 0), 0
  );

  // 1. Discount Slabs Source (Prioritize local session edits from Step 3)
  const activeAmounts = (step3.finalDiscountAmounts && step3.finalDiscountAmounts.length > 0)
    ? step3.finalDiscountAmounts
    : (serverData?.discount?.discount_amounts || []);

  // 2. Count for the Label
  const discountCountLabel = activeAmounts.length > 0 
    ? `${activeAmounts.length} slabs configured` 
    : "No slabs configured";

    // --- TIME & DATE RULES EXTRACTION ---
  const datesToDisplay = (() => {
    // 1. Priority: Local session edits from Step 5
    if (step5.finalDiscountDates && step5.finalDiscountDates.length > 0) {
      return step5.finalDiscountDates;
    }
    // 2. Fallback: Data already saved on the server
    return serverData?.discount?.discount_dates || [];
  })();

  // Helper to format date strings for the summary
  const formatSummaryDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  const timeRulesCount =
    (step5.patternConfigs?.length || 0) +
    (step5.specificDateConfigs?.length || 0);
  const displayTimeRules =
    timeRulesCount > 0
      ? `${timeRulesCount} Rules (New)`
      : serverData?.discount?.discount_dates?.length > 0
      ? `${serverData.discount.discount_dates.length} Rules (Existing)`
      : "All Day / All Week";



  // MCCs Priority Display
  const displayMccs = (() => {
  // Priority: If user just selected items in Step 6, use those
  if (step6.discount_mccs && step6.discount_mccs.length > 0) {
    // Return only the code strings [ "5411", "5812" ]
    return step6.discount_mccs.map(m => m.mcc_code || m.mcc_id);
  }
  // Fallback: Use server data from API
  return serverData?.discount?.discount_mccs?.map(m => m.mcc_code || m.mcc_id) || [];
})();

  // Card Config Priority Display
  const getCardConfigData = () => {
    let nets = (step8.discount_card_networks?.length > 0) ? step8.discount_card_networks.map(n => n.card_network_name || n) : serverData?.discount?.discount_card_networks?.map(n => n.card_network_name) || [];
    let typs = (step8.discount_card_types?.length > 0) ? step8.discount_card_types.map(t => t.card_type_name || t) : serverData?.discount?.discount_card_types?.map(t => t.card_type_name) || [];
    return { nets, typs };
  };
  const cardConfig = getCardConfigData();

  const docsCount =
    step7.discount_docs?.filter((d) => d.doc_name || d.doc_text).length ||
    serverData?.discount?.discount_docs?.length ||
    0;

  const displayName = step1.name || serverData?.campaign?.name || "Unnamed";
  const displayDescription = step1.description || serverData?.campaign?.description || "";
  const displayStart =
    step1.startDate ||
    (serverData?.campaign?.start_date
      ? new Date(serverData.campaign.start_date).toLocaleDateString()
      : "Not set");
  const displayEnd =
    step1.endDate ||
    (serverData?.campaign?.end_date
      ? new Date(serverData.campaign.end_date).toLocaleDateString()
      : "Not set");
  const displayBudget = step1.fundAmount
    ? Number(step1.fundAmount).toLocaleString()
    : serverData?.campaign?.total_budget
    ? Number(serverData.campaign.total_budget).toLocaleString()
    : "0";

  const shares = (() => {
    if (step1.bankShare || step1.merchantShare) {
      return {
        bank: step1.bankShare || 0,
        merchant: step1.merchantShare || 0,
        extra: step1.extraShares || [],
      };
    }
    if (serverData?.discount?.discount_sponsors) {
      const bank =
        serverData.discount.discount_sponsors.find((s) => s.name === "Bank")
          ?.fund_percentage || 0;
      const merch =
        serverData.discount.discount_sponsors.find((s) => s.name === "Merchant")
          ?.fund_percentage || 0;
      const extras = serverData.discount.discount_sponsors
        .filter((s) => s.name !== "Bank" && s.name !== "Merchant")
        .map((s) => ({ name: s.name, share: s.fund_percentage }));
      return { bank, merchant: merch, extra: extras };
    }
    return { bank: 0, merchant: 0, extra: [] };
  })();


const handleTabChange = (index) => {
  if (index === activeDocIndex) return;
  setIsDocSwitching(true);
  setActiveDocIndex(index);
  // Simulate a brief loading transition for better UX
  setTimeout(() => setIsDocSwitching(false), 300);
};

  // --- SUBMIT HANDLER ---
  const handleFinalSubmit = async (buttonType) => {
    if (!campaignId) {
      Swal.fire({
        icon: "error",
        title: "Missing Campaign ID",
        text: "Please complete Step 1 first.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // ==========================================
      // A. ROOT LEVEL DATA PREPARATION
      // ==========================================
      const finalName = step1.name || serverData?.campaign?.name;
      const finalDesc = step1.description || serverData?.campaign?.description;
      const finalBudget =
        step1.fundAmount || serverData?.campaign?.total_budget || 0;
      const finalStart = step1.startDate
        ? new Date(step1.startDate).toISOString()
        : serverData?.campaign?.start_date;
      const finalEnd = step1.endDate
        ? new Date(step1.endDate).toISOString()
        : serverData?.campaign?.end_date;
      const finalBankId = step1.bank_id || serverData?.campaign?.bank_id || 1;
      const finalBaseCurrency =
        Number(step1.currency) || serverData?.campaign?.base_currency_id;
      const finalIsMulti =
        step1.convertToBase !== undefined
          ? !!step1.convertToBase
          : serverData?.campaign?.is_multi_currency;

      let finalCurrencies = [];
      if (step1.targetCurrencies && Array.isArray(step1.targetCurrencies)) {
        finalCurrencies = [...step1.targetCurrencies.map(Number)];
        if (step1.currency) finalCurrencies.push(Number(step1.currency));
      } else if (serverData?.campaign?.currencies) {
        finalCurrencies = serverData.campaign.currencies.map(
          (c) => c.currency_id
        );
      } else {
        finalCurrencies = [finalBaseCurrency];
      }
      finalCurrencies = [...new Set(finalCurrencies)];

      let finalSponsors = [];
      if (step1.bankShare || step1.merchantShare) {
        finalSponsors = [
          { name: "Bank", fund_percentage: Number(step1.bankShare || 0) },
          {
            name: "Merchant",
            fund_percentage: Number(step1.merchantShare || 0),
          },
          ...(step1.extraShares || []).map((s) => ({
            name: s.name,
            fund_percentage: Number(s.share),
          })),
        ];
      } else if (serverData?.discount?.discount_sponsors) {
        finalSponsors = serverData.discount.discount_sponsors.map((s) => ({
          name: s.name,
          fund_percentage: Number(s.fund_percentage),
        }));
      }

      let sourceSegments = [];
      if (
        Array.isArray(step2.finalSegmentsData) &&
        step2.finalSegmentsData.length > 0
      ) {
        sourceSegments = step2.finalSegmentsData;
      } else if (serverData?.discount?.discount_segments) {
        sourceSegments = serverData.discount.discount_segments;
      }

      const finalSegments = sourceSegments.map((s) => {
        // Determine flags first
        const isAllBins = s.all_bins === true;
        const isAllTokens = s.all_tokens === true;

        // Only map the arrays if the "All" flag is false
        const discountBins = isAllBins
          ? []
          : (s.bin_ranges || s.discount_bins || []).map((b) => ({
              start_bin: b.start_bin || b.start,
              end_bin: b.end_bin || b.end,
            }));

        const discountTokens = isAllTokens
          ? []
          : (s.apple_tokens || s.discount_apple_tokens || []).map((t) => ({
              token_value: typeof t === "string" ? t : t.token_value || t.token,
            }));

        return {
          segment_id: s.segment_id || s.id,
          all_bins: isAllBins,
          all_tokens: isAllTokens,
          discount_bins: discountBins,
          discount_apple_tokens: discountTokens,
        };
      });

      // Dates
      let finalDates = [];
      if (
        Array.isArray(step5.finalDiscountDates) &&
        step5.finalDiscountDates.length > 0
      )
        finalDates = step5.finalDiscountDates;
      else if (serverData?.discount?.discount_dates)
        finalDates = serverData.discount.discount_dates;

      if (finalDates.length === 0) {
        setIsSubmitting(false);
        Swal.fire({
          icon: "warning",
          title: "Missing Date Rules",
          text: "No dates found from input or server.",
        });
        return;
      }

      // Amounts
      let finalAmounts = [];
      if (
        Array.isArray(step3.finalDiscountAmounts) &&
        step3.finalDiscountAmounts.length > 0
      )
        finalAmounts = step3.finalDiscountAmounts;
      else if (serverData?.discount?.discount_amounts)
        finalAmounts = serverData.discount.discount_amounts;

      let rawMidsSource = [];
      if (step4.finalMidRestrictions && step4.finalMidRestrictions.length > 0) {
        // If Step 4 has any data, it means the user visited/modified it
        rawMidsSource = step4.finalMidRestrictions;
      } else if (serverData?.discount?.discount_mids) {
        // Fallback to existing server data if user never touched Step 4
        rawMidsSource = serverData.discount.discount_mids;
      }

      // 2. Map and Clean for the Final Payload
      const finalMids = rawMidsSource.map((mid) => ({
        brand_id: mid.brand_id,
        all_tids: mid.all_tids,
        // Clean terminal ID array (Only send terminal_id)
        discount_tids: mid.all_tids
          ? []
          : (mid.discount_tids || []).map((tid) => ({
              terminal_id: tid.terminal_id || tid,
            })),
      }));

      // MCCs
      // --- Inside handleFinalSubmit ---

// MCCs: Strict mapping to ensure NO mcc_code is sent
let finalMccs = [];
const rawMccsSource = (step6.discount_mccs && step6.discount_mccs.length > 0)
  ? step6.discount_mccs
  : (serverData?.discount?.discount_mccs || []);

// Map strictly to ID and GroupID only
finalMccs = rawMccsSource.map((m) => ({
  mcc_id: m.mcc_id,
  mcc_group_id: m.mcc_group_id || null,
}));

// ... continue to fullPayload construction

      // Card Networks & Types
      let finalNetworks = [];
      if (
        step8.discount_card_networks &&
        Array.isArray(step8.discount_card_networks) &&
        step8.discount_card_networks.length > 0
      ) {
        finalNetworks = step8.discount_card_networks.map(
          (n) => n.card_network_id || n
        );
      } else if (serverData?.discount?.discount_card_networks) {
        finalNetworks = serverData.discount.discount_card_networks.map(
          (n) => n.card_network_id
        );
      }

      let finalTypes = [];
      if (
        step8.discount_card_types &&
        Array.isArray(step8.discount_card_types) &&
        step8.discount_card_types.length > 0
      ) {
        finalTypes = step8.discount_card_types.map((t) => t.card_type_id || t);
      } else if (serverData?.discount?.discount_card_types) {
        finalTypes = serverData.discount.discount_card_types.map(
          (t) => t.card_type_id
        );
      }

      // DOCS
      let finalDocs = [];
      if (step7.discount_docs && Array.isArray(step7.discount_docs)) {
        finalDocs = step7.discount_docs.filter(
          (d) => d.doc_name?.trim() || d.doc_text?.trim()
        );
      } else if (serverData?.discount?.discount_docs) {
        finalDocs = serverData.discount.discount_docs;
      }

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
          discount_card_networks: finalNetworks,
          discount_card_types: finalTypes,
          discount_docs: finalDocs,
        },
      };

      // ===============================================
      // LOGIC SPLIT: DRAFT vs LAUNCH vs ADMIN
      // ===============================================

      if (buttonType === "draft") {
        // 1. SAVE AS DRAFT LOGIC
        console.log(
          "📤 Saving Draft Payload:",
          JSON.stringify(fullPayload, null, 2)
        );
        await campaignDiscountApi.update(campaignId, fullPayload);

        // ✅ Set the state to true so the next button becomes clickable
        setIsDraftSaved(true);

        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Campaign Saved Successfully! You can now submit it.",
   
          timer: 2000,
                showConfirmButton: true, // Enables the confirmation button
          confirmButtonText: "OK", // Custom text for the button
          confirmButtonColor: "#6366F1",
        });

        if (onRefresh) await onRefresh();
      } else if (buttonType === "launch") {
        // 2. SUBMIT / LAUNCH LOGIC

        if (userType === "admin") {
          // 2a. ADMIN: Update first (ensure latest data) then Approve
          await campaignDiscountApi.update(campaignId, fullPayload);
          await campaignApi.approveCampaign(campaignId);
          Swal.fire({
            icon: "success",
            title: "Launched!",
            text: "Campaign Updated, Approved & Launched!",
            confirmButtonColor: "#7B3FE4",
          });
        } else {
          // 2b. MAKER: Call makerSubmit API
          // Note: We assume the data was saved in the 'draft' step as enforced by the UI button
          console.log("🚀 Submitting for Approval (Maker)...");

          // ✅ Calling the new makerSubmit API
          await campaignDiscountApi.makerSubmit(campaignId);

          Swal.fire({
            icon: "success",
            title: "Submitted!",
            text: "Campaign submitted for approval successfully!",
            confirmButtonColor: "#7B3FE4",
          });
        }

        if (onRefresh) await onRefresh();
        onSubmit();
      }
    } catch (error) {
      console.error("Submission Error:", error);
      const errMsg =
        error.response?.data?.detail || "Failed to process request.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errMsg,
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonLabel =
    userType === "admin" ? "Launch Campaign" : "Submit for Approval";

  // ✅ Condition to disable the submit button for Makers if they haven't saved draft yet
  const isSubmitDisabled =
    isSubmitting || (userType !== "admin" && !isDraftSaved);

return (
  <div className="w-full">
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm ">
      <StepHeader step={9} totalSteps={9} title="Campaign Summary & Review" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* CARD 1: GENERAL CAMPAIGN DETAILS */}
        <SummaryCard title="Campaign Overview" icon={LayoutDashboard}>
          <DetailRow label="Campaign Name" value={displayName} />
          <DetailRow label="Campaign Type" value="Discount" />
          <DetailRow label="Start Date" value={displayStart} />
          <DetailRow label="End Date" value={displayEnd} />
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Description</span>
            <p className="text-xs text-slate-600 line-clamp-3 italic">"{displayDescription || "No description provided."}"</p>
          </div>
        </SummaryCard>

        {/* CARD 2: BRAND & TERMINAL RESTRICTIONS (Step 4) */}
        <SummaryCard title="Brand & Terminal Access" icon={Store}>
          <div className="h-[250px] overflow-y-auto hide-scroll space-y-3 pr-1">
            {midsToDisplay.length > 0 ? (
              midsToDisplay.map((mid, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm transition-hover hover:border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                        {mid.brand_name || `Merchant ID: ${mid.brand_id}`}
                      </span>
                    </div>
                    {mid.all_tids ? (
                      <Tag variant="green">All Terminals</Tag>
                    ) : (
                      <Tag variant="blue">Specific</Tag>
                    )}
                  </div>
                  
                  {!mid.all_tids && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-4">
                      {(mid.discount_tids || []).map((tid, ti) => (
                        <div key={ti} className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-600 font-mono shadow-sm">
                          <Hash className="w-2.5 h-2.5 text-slate-400" />
                          {tid.terminal_identifier || tid.terminal_id}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                Global Merchant settings applied (All Brands).
              </div>
            )}
          </div>
        </SummaryCard>

        {/* CARD 3: BIN & TOKEN DETAILS */}
        <SummaryCard title="BIN & Token Details" icon={Layers}>
          <DetailRow label="Selected Segments" value={displaySegments} isTagRow />
          <div className="mt-3 pt-2 border-t border-slate-100 h-[200px] overflow-y-auto hide-scroll space-y-4 pr-1">
            {segmentsToDisplay.map((seg, idx) => {
              const segmentName = seg.segment_name || "Segment";
              const binData = (seg.discount_bins || []).map(b => `${b.start_bin} - ${b.end_bin}`);
              const tokenData = (seg.discount_apple_tokens || []).map(t => t.token_value);

              return (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg  border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-700 uppercase mb-2 border-b border-slate-200 pb-1">{segmentName}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">BINs:</span>
                      <div className="flex flex-wrap gap-1">
                        {binData.length > 0 ? binData.map((r, i) => (
                          <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono">{r}</span>
                        )) : <span className="text-[9px] italic text-slate-400">Global</span>}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Apple Tokens:</span>
                      <div className="flex flex-wrap gap-1">
                        {tokenData.length > 0 ? tokenData.map((t, i) => (
                          <span key={i} className="text-[9px] bg-purple-50 text-purple-600 border border-purple-100 px-1.5 py-0.5 rounded font-mono break-all">{t}</span>
                        )) : <span className="text-[9px] italic text-slate-400">None</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SummaryCard>


       <SummaryCard title="Discount Configuration" icon={CreditCard}>
  <DetailRow label="Total Slabs" value={discountCountLabel} />
  <div className="mt-3 pt-2 border-t border-slate-100 h-[200px] overflow-y-auto hide-scroll space-y-3 pr-1">
    {activeAmounts.map((slab, idx) => (
      <div key={idx} className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
  
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slab #{idx + 1}</span>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
            {slab.is_percentage ? `${slab.discount_percentage}% Off` : `${slab.discount_amount} AED Off`}
          </span>
        </div>

      
        <div className="grid grid-cols-2 gap-y-3 text-[11px]">
     
          <div className="flex flex-col">
            <p className="text-slate-400 font-medium mb-0.5">Txn Range</p>
            <p className="text-slate-900 font-bold font-mono">{slab.min_txn_amount} — {slab.max_txn_amount}</p>
          </div>


          <div className="flex flex-col text-right">
            <p className="text-slate-400 font-medium mb-0.5">Max Cap</p>
            <p className="text-slate-900 font-bold">{slab.max_discount_cap ? `${slab.max_discount_cap} AED` : "No Cap"}</p>
          </div>


          <div className="flex flex-col border-t border-slate-50 pt-2">
            <p className="text-slate-400 font-medium mb-0.5">Frequency Limits</p>
            <p className="text-slate-400 text-[9px] uppercase font-bold">Daily / Weekly / Monthly</p>
          </div>

          <div className="flex flex-col text-right border-t border-slate-50 pt-2">
            <p className="text-slate-400 font-medium mb-0.5 invisible">Spacer</p> 
            <p className="text-slate-900 font-bold tracking-wide">
              {slab.daily || "∞"} <span className="text-slate-300 mx-0.5">/</span> {slab.weekly || "∞"} <span className="text-slate-300 mx-0.5">/</span> {slab.monthly || "∞"}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</SummaryCard>

        {/* CARD 5: CARD & MCC RULES */}
        <div className="space-y-6">
          <SummaryCard title="MCC Restrictions" icon={ShieldCheck}>
            <DetailRow label="Applied MCCs" value={displayMccs} isTagRow />
          </SummaryCard>

          <SummaryCard title="Card Configuration" icon={CreditCard}>
             <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2 tracking-wider">Networks</span>
                  <div className="flex flex-wrap gap-1">
                    {networkNames.length > 0 ? networkNames.map((n, i) => <Tag key={i} variant="purple">{n}</Tag>) : <span className="text-xs text-slate-300">No Card Networks Selected</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2 tracking-wider">Card Types</span>
                  <div className="flex flex-wrap gap-1">
                    {typeNames.length > 0 ? typeNames.map((t, i) => <Tag key={i} variant="gray">{t}</Tag>) : <span className="text-xs text-slate-300">No Card Types Selected</span>}
                  </div>
                </div>
             </div>
          </SummaryCard>
        </div>

        {/* CARD 6: TIME & DATE RULES */}
        <SummaryCard title="Time & Date Rules" icon={Calendar}>
          <div className="h-[250px] overflow-y-auto hide-scroll space-y-3 pr-1">
            {datesToDisplay.length > 0 ? datesToDisplay.map((rule, idx) => (
              <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">{formatSummaryDate(rule.start_date)}</span>
                  {rule.all_day ? <Tag variant="blue">All Day</Tag> : <Tag variant="amber">Timed</Tag>}
                </div>
                {!rule.all_day && (
                  <div className="flex flex-wrap gap-1.5">
                    {(rule.discount_times || []).map((t, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono shadow-sm">
                        {t.start_time} — {t.end_time}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )) : <div className="text-center py-10 text-slate-400 text-xs italic">No Time Restrictions Selected</div>}
          </div>
        </SummaryCard>

        {/* CARD 7: FUND SETUP */}
        <SummaryCard title="Fund Distribution" icon={ShieldCheck}>
           <DetailRow label="Total Budget" value={`${displayBudget} AED`} />
           <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <p className="text-[10px] text-purple-400 font-bold uppercase mb-1">Bank Share</p>
                <p className="text-lg font-bold text-purple-700">{shares.bank}%</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Merchant Share</p>
                <p className="text-lg font-bold text-blue-700">{shares.merchant}%</p>
              </div>
           </div>
           {shares.extra?.length > 0 && (
              <div className="mt-3 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Others:</span>
                {shares.extra.map((s, i) => (
                   <div key={i} className="flex justify-between text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      <span>{s.name}</span>
                      <span>{s.share}%</span>
                   </div>
                ))}
              </div>
           )}
        </SummaryCard>

        {/* CARD 8: DOCUMENTS */}
        


<SummaryCard title="Documents & Terms" icon={FileText}>
  {docsToDisplay.length > 0 ? (
    <div className="flex flex-col h-[350px]">
      {/* Dynamic Tab Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-100 scrollbar-hide">
        {docsToDisplay.map((doc, idx) => (
          <button
            key={idx}
            onClick={() => handleTabChange(idx)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              activeDocIndex === idx
                ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {doc.doc_name}
          </button>
        ))}
      </div>

      {/* Document Content Area */}
      <div className="flex-1 relative bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
        {isDocSwitching ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-[1px]">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500 mb-2" />
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Loading Document...</span>
          </div>
        ) : null}

        <div className="h-full overflow-y-auto p-5 custom-scrollbar">
          {/* <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Currently Viewing
            </span>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              {docsToDisplay[activeDocIndex]?.doc_name}
            </h4>
          </div> */}

          <div 
            className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: markdownToHtml(docsToDisplay[activeDocIndex]?.doc_text) 
            }} 
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="h-[250px] flex flex-col items-center justify-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
      <FileText className="w-8 h-8 mb-2 opacity-20 text-slate-400" />
      No documents attached to this campaign.
    </div>
  )}
</SummaryCard>

      </div>

      {/* FOOTER BUTTONS */}
                      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={onPrevious}
            disabled={isSubmitting}
            className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] disabled:opacity-50"
          >
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

          <div className="flex justify-end gap-4 items-center">
            {/* Hint Text for Maker */}
            {userType !== "admin" && !isDraftSaved && (
              <span className="text-xs text-amber-600 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3 h-3" /> Save draft to enable submit
              </span>
            )}

            <button
              onClick={() => handleFinalSubmit("draft")}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save as Draft"
              )}
            </button>

            <button
              onClick={() => handleFinalSubmit("launch")}
              // ✅ Disabled logic applied here
              disabled={isSubmitDisabled}
              className={`px-8 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 
                    ${
                      isSubmitDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white hover:from-[#6B3CD6] hover:to-[#8B4DE6] transform hover:-translate-y-0.5"
                    }`}
            >
              {isSubmitting ? "Processing..." : submitButtonLabel}
            </button>
          </div>
        </div>
    </div>
  </div>
);

}