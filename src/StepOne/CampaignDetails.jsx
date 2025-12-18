import React, { useState, useEffect } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import { metadataApi, campaignDiscountApi } from "../utils/metadataApi"; 
import StepHeader from "../StepReusable/Stepheader";
import { assets } from "../assets/assets";
import ThirdPartyShares from "./ThirdpartyShares";

const CampaignDetails = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isEditMode,
  onRefresh,
}) => {
  // --- STATE ---
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [campaignType, setCampaignType] = useState("discount");

  // Budget State
  const [currency, setCurrency] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [convertToBase, setConvertToBase] = useState(false);
  const [targetCurrencies, setTargetCurrencies] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Local UI state for dropdown

  // Shares State
  const [bankShare, setBankShare] = useState("");
  const [merchantShare, setMerchantShare] = useState("");
  const [extraShares, setExtraShares] = useState([]);

  const [errors, setErrors] = useState({});
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

  const campaignTypes = [
    { label: "Discount Campaign", value: "discount" },
    { label: "Loyalty Points", value: "loyalty_points" },
    { label: "Cashback Rewards", value: "cashback_rewards" },
    { label: "Offers/ Stamp", value: "stamp_offers" },
  ];

  // --- API & POPULATION ---
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        const res = await metadataApi.getCurrencies();
        setCurrencyList(res.data?.rows || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCurrencies(false);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (data) {
      const c = data.campaign || data;
      const d = data.discount || {};

      if (!campaignName) setCampaignName(c.name || "");
      if (!description) setDescription(c.description || "");

      const rawStart = c.start_date || c.startDate;
      const rawEnd = c.end_date || c.endDate;
      if (rawStart) setStartDate(rawStart.includes("T") ? rawStart.split("T")[0] : rawStart);
      if (rawEnd) setEndDate(rawEnd.includes("T") ? rawEnd.split("T")[0] : rawEnd);

      if (c.type || c.campaignType) {
         const incomingType = c.type || c.campaignType;
         const exactMatch = campaignTypes.find((t) => t.value === incomingType);
         setCampaignType(exactMatch ? exactMatch.value : "discount");
      }

      if (!currency) setCurrency(c.base_currency_id || c.currency || "");
      if (!fundAmount) setFundAmount(c.total_budget || c.fundAmount || "");

      // Sync Toggle State
      const isMulti = c.is_multi_currency !== undefined ? c.is_multi_currency : c.convertToBase;
      setConvertToBase(!!isMulti);

      if (c.currencies && Array.isArray(c.currencies)) {
        const baseId = c.base_currency_id || Number(c.currency);
        const targets = c.currencies
          .map((item) => (typeof item === "object" ? item.currency_id : item))
          .filter((id) => id !== baseId);
        setTargetCurrencies(targets);
      } else if (c.targetCurrencies) {
        setTargetCurrencies(c.targetCurrencies);
      }

      if (d.discount_sponsors && Array.isArray(d.discount_sponsors)) {
        const bankS = d.discount_sponsors.find((s) => s.name === "Bank");
        const merchS = d.discount_sponsors.find((s) => s.name === "Merchant");
        const others = d.discount_sponsors.filter(
          (s) => s.name !== "Bank" && s.name !== "Merchant"
        );
        setBankShare(bankS ? String(bankS.fund_percentage) : "0");
        setMerchantShare(merchS ? String(merchS.fund_percentage) : "0");
        if (extraShares.length === 0) {
            setExtraShares(others.map((s) => ({ name: s.name, share: String(s.fund_percentage) })));
        }
      } else {
        if (!bankShare && data.bankShare) setBankShare(String(data.bankShare));
        if (!merchantShare && data.merchantShare) setMerchantShare(String(data.merchantShare));
        if (extraShares.length === 0 && data.extraShares) setExtraShares(data.extraShares);
      }
    }
  }, [data]);

  // --- HELPERS ---
  const handleInputFocus = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const getBorderClass = (field) => {
    return errors[field]
      ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 relative z-10"
      : "border-gray-300 focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] relative focus:z-10";
  };

  const calculateAmount = (percent) =>
    !fundAmount || !percent
      ? 0
      : ((parseFloat(fundAmount) * parseFloat(percent)) / 100).toFixed(0);

  // --- SYNC WITH PARENT ---
  const updateParentState = (override = {}) => {
    // Ensure 'is_multi_currency' is synced with toggle logic
    const isMultiVal = override.convertToBase !== undefined ? override.convertToBase : convertToBase;

    const currentData = {
      id: data?.campaign?.id || data?.id,
      name: override.name ?? campaignName,
      description: override.description ?? description,
      startDate: override.startDate ?? startDate,
      endDate: override.endDate ?? endDate,
      campaignType: override.campaignType ?? campaignType,
      currency: override.currency ?? currency,
      fundAmount: override.fundAmount ?? fundAmount,
      
      // Update both keys
      convertToBase: isMultiVal, 
      is_multi_currency: isMultiVal,

      targetCurrencies: override.targetCurrencies ?? targetCurrencies,
      bankShare: override.bankShare ?? bankShare,
      merchantShare: override.merchantShare ?? merchantShare,
      extraShares: override.extraShares ?? extraShares,
    };
    onUpdate(currentData);
  };

  // --- HANDLERS (BUDGET) ---
  const handleCurrencyChange = (val) => {
    const id = Number(val);
    setCurrency(id);
    const targets = targetCurrencies.filter((c) => c !== id);
    setTargetCurrencies(targets);
    if(id) handleInputFocus("currency");
    updateParentState({ currency: id, targetCurrencies: targets });
  };

  const handleFundAmountChange = (val) => {
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
        setFundAmount(val);
        updateParentState({ fundAmount: val });
    }
  };

  const handleToggleChange = () => {
    const newVal = !convertToBase;
    setConvertToBase(newVal);
    // If turning off, clear target currencies
    const newTargets = newVal ? targetCurrencies : [];
    setTargetCurrencies(newTargets);
    
    updateParentState({ 
        convertToBase: newVal, 
        targetCurrencies: newTargets 
    });
  };

  const handleTargetCurrencySelect = (currencyId) => {
    const id = Number(currencyId);
    let newTargets = targetCurrencies.includes(id)
      ? targetCurrencies.filter((c) => c !== id)
      : [...targetCurrencies, id];
    setTargetCurrencies(newTargets);
    updateParentState({ targetCurrencies: newTargets });
  };

  const handleCampaignNameChange = (val) => {
    setCampaignName(val);
    updateParentState({ name: val });
  };
  const handleDescriptionChange = (val) => {
    setDescription(val);
    updateParentState({ description: val });
  };
  const handleStartDateChange = (val) => {
    setStartDate(val);
    updateParentState({ startDate: val });
  };
  const handleEndDateChange = (val) => {
    setEndDate(val);
    updateParentState({ endDate: val });
  };
  const handleCampaignTypeChange = (val) => {
    setCampaignType(val);
    updateParentState({ campaignType: val });
  };
  const handleBankShareChange = (val) => {
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setBankShare(val);
      updateParentState({ bankShare: val });
    }
  };
  const handleMerchantShareChange = (val) => {
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setMerchantShare(val);
      updateParentState({ merchantShare: val });
    }
  };

  // --- VALIDATION & SUBMIT ---
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    let errorMsg = "Please fill in all mandatory fields to proceed.";

    if (!campaignName.trim()) { newErrors.campaignName = true; isValid = false; }
    if (!description.trim()) { newErrors.description = true; isValid = false; }
    if (!startDate) { newErrors.startDate = true; isValid = false; }
    if (!endDate) { newErrors.endDate = true; isValid = false; }
    if (!currency) { newErrors.currency = true; isValid = false; }
    if (!fundAmount) { newErrors.fundAmount = true; isValid = false; }
    // if (bankShare === "") { newErrors.bankShare = true; isValid = false; }
    // if (merchantShare === "") { newErrors.merchantShare = true; isValid = false; }

    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        newErrors.endDate = true; isValid = false;
        errorMsg = "End Date cannot be earlier than Start Date.";
      }
    }
    
    setErrors(newErrors);
    
    if (!isValid) {
       Swal.fire({ 
         icon: "warning", 
         title: "Missing Details", 
         text: errorMsg,
         confirmButtonColor: "#7747EE",
         background: "#F7F9FB",
       });
    }
    return isValid;
  };

//   const handleSubmit = async (action) => {
//     // 1. Validate Form & Shares
//     if (!validateForm()) return;

//     const totalShare = (parseFloat(bankShare) || 0) + (parseFloat(merchantShare) || 0) + extraShares.reduce((sum, s) => sum + (parseFloat(s.share) || 0), 0);
//     if (totalShare > 100) {
//       Swal.fire({ icon: "error", title: "Allocation Error", text: `Total share is ${totalShare}%. Max is 100%.` });
//       return;
//     }

//     // ✅ FIX: If in Edit Mode and clicking "Next", skip API and just navigate
//     if (isEditMode && action === "next") {
//         onNext();
//         return;
//     }

//     // --- PREPARE PAYLOAD ---
//     const allCurrencies = [...new Set([Number(currency), ...targetCurrencies])];
//     const sponsorsPayload = [
//       { name: "Bank", fund_percentage: parseFloat(bankShare) || 0 },
//       { name: "Merchant", fund_percentage: parseFloat(merchantShare) || 0 },
//       ...extraShares.map((s) => ({ name: s.name, fund_percentage: parseFloat(s.share) || 0 })),
//     ];

//     const fullPayload = {
//       name: campaignName, description, total_budget: parseFloat(fundAmount),
//       start_date: new Date(startDate).toISOString(), end_date: new Date(endDate).toISOString(),
//       bank_id: 1, type: campaignType, base_currency_id: Number(currency),
//       is_multi_currency: convertToBase, 
//       currencies: allCurrencies,
//       discount: { discount_sponsors: sponsorsPayload },
//     };

//     if (action === "update") setIsUpdateSubmitting(true);
//     else setIsNextSubmitting(true);

//     try {
//         let endpointCall = isEditMode && action === "update"
//             ? campaignDiscountApi.update(data?.campaign?.id || data?.id, fullPayload)
//             : campaignDiscountApi.create(fullPayload);
        
//         const response = await endpointCall;
//         const newId = response.data?.campaign?.id || response.data?.id || (data?.campaign?.id || data?.id);

//         onUpdate({ ...data, campaign: { ...data?.campaign, ...fullPayload }, id: newId });

//         if (action === "update") {
//             Swal.fire({ icon: "success", title: "Success", text: "Campaign Updated Successfully", timer: 1500, showConfirmButton: false });
//             if (onRefresh) await onRefresh();
//         } else {

//           if (!isEditMode) {
//                 // ✅ NEW: Show popup for newly created campaign
//                 await Swal.fire({
//                     icon: 'success',
//                     title: 'Campaign Initialized!',
                   
//                     confirmButtonText: 'Proceed for next steps →',
//                     confirmButtonColor: '#6366F1',
//                     allowOutsideClick: false,
//                 });
//             }
//             onNext();
//         }
// } catch (error) {
//         console.error(error);


//         const apiMessage = error.response?.data?.detail;
//         const displayMessage = apiMessage || error.message || "Save failed";

//         // ✅ 2. Show a friendly "Warning" instead of a harsh "Error"
//         Swal.fire({
//             icon: "error",         // Yellow icon (less shocking)
//             title: "Action Required", // Professional title
//             text: displayMessage,    // The exact message from your backend
//             confirmButtonColor: "#7747EE",
//             confirmButtonText: "Okay, I'll change it"
//         });
//     } finally {
//         setIsUpdateSubmitting(false);
//         setIsNextSubmitting(false);
//     }
//   }

const handleSubmit = async (action) => {
    // 1. Validate Form & Shares
    if (!validateForm()) return;

    // Calculate total share to check if we should send discount object
    const totalShare =
      (parseFloat(bankShare) || 0) +
      (parseFloat(merchantShare) || 0) +
      extraShares.reduce((sum, s) => sum + (parseFloat(s.share) || 0), 0);

    if (totalShare > 100) {
      Swal.fire({
        icon: "error",
        title: "Allocation Error",
        text: `Total share is ${totalShare}%. Max is 100%.`,
      });
      return;
    }

    // ✅ FIX: If in Edit Mode and clicking "Next", skip API and just navigate
    if (isEditMode && action === "next") {
      onNext();
      return;
    }

    // --- PREPARE PAYLOAD ---
    // (Logic for currencies remains unchanged as requested)
    const allCurrencies = [...new Set([Number(currency), ...targetCurrencies])];

    // 1. Construct the Base Payload
    const fullPayload = {
      name: campaignName,
      description,
      total_budget: parseFloat(fundAmount),
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      bank_id: 1,
      type: campaignType,
      base_currency_id: Number(currency),
      is_multi_currency: convertToBase,
      currencies: allCurrencies,
    };

    // 2. ✅ Only add 'discount' object if shares are provided (totalShare > 0)
    if (totalShare > 0) {
      const sponsorsPayload = [
        { name: "Bank", fund_percentage: parseFloat(bankShare) || 0 },
        { name: "Merchant", fund_percentage: parseFloat(merchantShare) || 0 },
        ...extraShares.map((s) => ({
          name: s.name,
          fund_percentage: parseFloat(s.share) || 0,
        })),
      ];

      fullPayload.discount = { discount_sponsors: sponsorsPayload };
    }

    if (action === "update") setIsUpdateSubmitting(true);
    else setIsNextSubmitting(true);

    try {
      let endpointCall =
        isEditMode && action === "update"
          ? campaignDiscountApi.update(
              data?.campaign?.id || data?.id,
              fullPayload
            )
          : campaignDiscountApi.create(fullPayload);

      const response = await endpointCall;
      const newId =
        response.data?.campaign?.id ||
        response.data?.id ||
        data?.campaign?.id ||
        data?.id;

      onUpdate({
        ...data,
        campaign: { ...data?.campaign, ...fullPayload },
        id: newId,
      });

      if (action === "update") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Campaign Updated Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        if (onRefresh) await onRefresh();
      } else {
        if (!isEditMode) {
          // ✅ NEW: Show popup for newly created campaign
          await Swal.fire({
            icon: "success",
            title: "Campaign Initialized!",

            confirmButtonText: "Proceed for next steps →",
            confirmButtonColor: "#6366F1",
            allowOutsideClick: false,
          });
        }
        onNext();
      }
    } catch (error) {
      console.error(error);

      const apiMessage = error.response?.data?.detail;
      const displayMessage = apiMessage || error.message || "Save failed";

      // ✅ 2. Show a friendly "Warning" instead of a harsh "Error"
      Swal.fire({
        icon: "error", // Yellow icon (less shocking)
        title: "Action Required", // Professional title
        text: displayMessage, // The exact message from your backend
        confirmButtonColor: "#7747EE",
        confirmButtonText: "Okay, I'll change it",
      });
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
      <StepHeader step={1} totalSteps={9} title="Campaign Details" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* LEFT: Name & Description */}
        <div className="col-span-1 bg-[#F7F9FB] p-4 rounded border border-[#E2E8F0]">
          <label className="block text-sm text-gray-700 mb-2">Campaign Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => handleCampaignNameChange(e.target.value)}
            onFocus={() => handleInputFocus("campaignName")}
            className={`w-full border bg-[#ffffff] rounded p-2 text-sm mb-3 outline-none ${getBorderClass("campaignName")}`}
            disabled={isAnySubmitting}
          />
          <label className="block text-sm text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onFocus={() => handleInputFocus("description")}
            className={`w-full border bg-[#ffffff] rounded p-2 text-sm h-20 outline-none ${getBorderClass("description")}`}
            disabled={isAnySubmitting}
          />
        </div>

        {/* MIDDLE: Dates */}
        <div className="lg:col-span-1 bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-4">
          <label className="flex gap-1 block text-sm text-gray-700 mb-2">
            <img src={assets.CalendarLogo} className="w-4 h-4 mt-0.5" alt="" /> Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            onFocus={() => handleInputFocus("startDate")}
            className={`w-full border bronze-icon bg-[#ffffff] rounded p-2 text-sm outline-none ${getBorderClass("startDate")}`}
            disabled={isAnySubmitting}
          />
          <div className="mt-4">
            <label className="flex gap-1 block text-sm text-gray-700 mb-2">
               <img src={assets.CalendarLogo} className="w-4 h-4 mt-0.5" alt="" /> End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              onFocus={() => handleInputFocus("endDate")}
              className={`w-full bronze-icon border bg-[#ffffff] rounded p-2 text-sm outline-none ${getBorderClass("endDate")}`}
              disabled={isAnySubmitting}
            />
          </div>
        </div>

        {/* RIGHT: Type Selection */}
        <div className="col-span-1">
          <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded h-full">
            <div className="text-sm font-medium mb-3">Campaign Type <span className="text-red-500">*</span></div>
            <div className={`grid grid-cols-2 gap-3 ${isAnySubmitting ? "opacity-60 pointer-events-none" : ""}`}>
              {campaignTypes.map((t) => {
                const active = campaignType === t.value;
                return (
                  <label
                    key={t.value}
                    onClick={() => { if(!isAnySubmitting) { setCampaignType(t.value); updateParentState({ campaignType: t.value }); }}}
                    className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all duration-150 ${
                      active ? "bg-[#7747EE] border-none text-white shadow-md" : "bg-white text-gray-900 border border-gray-200 hover:border-[#B0B2F7]/40"
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-white" : "border border-gray-300"}`}>
                             {active && <div className="rounded-full" style={{ width: 8, height: 8, background: "linear-gradient(90deg,#7B3FE4,#9B5DF7)" }} />}
                        </div>
                        <span className={`text-sm font-medium ${active ? "text-white" : "text-gray-900"}`} style={{ fontSize: "12px" }}>{t.label}</span>
                     </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- BUDGET & SHARES ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        
        {/* 1. BUDGET SECTION (Integrated for stability) */}
        <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Campaign Budget</h4>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Base Currency & Campaign Fund <span className="text-red-500">*</span>
          </label>

          {/* Custom Dropdown + Input */}
          <div className="flex items-center mb-4 h-[42px] relative z-20">
            {/* Left: Dropdown */}
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => {
                    if(!isAnySubmitting) {
                        setIsDropdownOpen(!isDropdownOpen);
                        handleInputFocus("currency"); // Clear Error
                    }
                }}
                disabled={isAnySubmitting}
                className={`h-full flex items-center justify-between px-3 min-w-[130px] border border-r-0 rounded-l-md outline-none transition-colors duration-200
                  ${currency ? "bg-[#7747EE] text-white border-transparent relative z-10" : `bg-white text-gray-900 ${getBorderClass("currency")}`}
                `}
                style={{ borderRight: "none" }}
              >
                <span className="text-xs font-medium truncate mr-2">
                  {(() => {
                    if (loadingCurrencies) return "Loading...";
                    if (!currency) return "Select";
                    const selectedItem = currencyList.find((c) => c.id === Number(currency));
                    return selectedItem ? `${selectedItem.code} (${selectedItem.symbol})` : "Select";
                  })()}
                </span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isDropdownOpen ? "rotate-0" : ""} ${currency ? "text-white" : "text-gray-500"}`} />
              </button>

              {isDropdownOpen && !loadingCurrencies && (
                <div className="absolute top-full left-0 mt-1 w-[160px] bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden text-xs max-h-60 overflow-y-auto">
                  <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-500" onClick={() => { handleCurrencyChange(""); setIsDropdownOpen(false); }}>Select</div>
                  {currencyList.map((c) => (
                    <div key={c.id} className="px-3 py-2 hover:bg-[#eef2ff] hover:text-[#7747EE] cursor-pointer text-gray-700 border-b border-gray-50 last:border-0" onClick={() => { handleCurrencyChange(c.id); setIsDropdownOpen(false); }}>
                      {c.code} ({c.symbol})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Input */}
            <div className="flex-1 h-full relative z-0">
              <input
                type="text"
                inputMode="decimal"
                value={fundAmount}
                onChange={(e) => handleFundAmountChange(e.target.value)}
                onFocus={() => handleInputFocus("fundAmount")}
                className={`w-full h-full bg-[#ffffff] border rounded-r-md px-3 text-sm outline-none ${getBorderClass("fundAmount")}`}
                placeholder="5000000"
                disabled={isAnySubmitting}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-700">Convert To Base Currency</span>
            <div onClick={() => !isAnySubmitting && handleToggleChange()} className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${convertToBase ? "bg-[#7747EE]" : "bg-gray-300"} ${isAnySubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
              <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${convertToBase ? "translate-x-5" : ""}`}></div>
            </div>
          </div>

          {convertToBase && (
            <div className={`border border-blue-200 border-dashed rounded p-3 bg-blue-50/50 ${isAnySubmitting ? "opacity-60 pointer-events-none" : ""}`}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                {currencyList.filter((c) => c.id !== Number(currency)).map((c) => (
                  <label key={c.id} onClick={() => !isAnySubmitting && handleTargetCurrencySelect(c.id)} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${targetCurrencies.includes(c.id) ? "bg-[#7747EE] border-[#7747EE]" : "bg-white border-gray-300"}`}>
                      {targetCurrencies.includes(c.id) && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span>{c.code}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. FUND SHARE (Standard Inputs) */}
        <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Fund Share</h4>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
               <label className="text-xs font-medium text-gray-700">Bank Share (%) <span className="text-red-500">*</span></label>
               <span className="text-[10px] text-gray-500 font-medium">Amount: {calculateAmount(bankShare)}</span>
            </div>
            <div className="relative">
                <input
                    type="text" inputMode="decimal"
                    value={bankShare}
                    onChange={(e) => handleBankShareChange(e.target.value)}
                    onFocus={() => handleInputFocus("bankShare")}
                    className={`w-full border bg-[#ffffff] rounded px-3 py-2 text-sm outline-none ${getBorderClass("bankShare")}`}
                    placeholder="60" disabled={isAnySubmitting}
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs">%</span>
            </div>
          </div>
          <div className="mb-3">
             <div className="flex justify-between items-center mb-1">
               <label className="text-xs font-medium text-gray-700">Merchant Share (%) <span className="text-red-500">*</span></label>
               <span className="text-[10px] text-gray-500 font-medium">Amount: {calculateAmount(merchantShare)}</span>
            </div>
            <div className="relative">
                <input
                    type="text" inputMode="decimal"
                    value={merchantShare}
                    onChange={(e) => handleMerchantShareChange(e.target.value)}
                    onFocus={() => handleInputFocus("merchantShare")}
                    className={`w-full border bg-[#ffffff] rounded px-3 py-2 text-sm outline-none ${getBorderClass("merchantShare")}`}
                    placeholder="40" disabled={isAnySubmitting}
                />
                <span className="absolute right-3 top-2 text-gray-400 text-xs">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- THIRD PARTY SHARES (Extracted) --- */}
      <ThirdPartyShares 
         shares={extraShares}
         onUpdateShares={(newShares) => { setExtraShares(newShares); updateParentState({ extraShares: newShares }); }}
         isSubmitting={isAnySubmitting}
         calculateAmount={calculateAmount}
      />

      {/* --- FOOTER BUTTONS --- */}
      <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex justify-end items-center">
        {/* <button onClick={onPrevious} disabled={isAnySubmitting} className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] disabled:opacity-50">
           Previous
        </button> */}
        <div className="flex gap-3">
          {isEditMode && (
            <button onClick={() => handleSubmit("update")} disabled={isAnySubmitting} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70">
               {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} {isUpdateSubmitting ? "Updating..." : "Update"}
            </button>
          )}
          <button onClick={() => handleSubmit("next")} disabled={isAnySubmitting} className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] flex items-center gap-2 disabled:opacity-70">
             {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} {isNextSubmitting ? "Saving..." : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;