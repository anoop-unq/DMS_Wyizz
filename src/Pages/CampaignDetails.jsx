
import React, { useState, useEffect } from "react";
import { Trash2, X, Loader2 } from "lucide-react"; 
import { metadataApi, campaignDiscountApi } from "../utils/metadataApi"; 

const CampaignDetails = ({ data, onUpdate, onNext, onPrevious, onSuccess, isEditMode, onRefresh }) => {
  // console.log("🎯 CampaignDetails Data:", data);

  // --- State Management ---
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [campaignType, setCampaignType] = useState("Discount Campaign"); 
  const [currency, setCurrency] = useState(""); 
  const [currencyList, setCurrencyList] = useState([]); 
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  const [fundAmount, setFundAmount] = useState(""); 
  const [convertToBase, setConvertToBase] = useState(false); 
  const [targetCurrencies, setTargetCurrencies] = useState([]); 
  const [bankShare, setBankShare] = useState("");
  const [merchantShare, setMerchantShare] = useState("");
  const [extraShares, setExtraShares] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyShare, setNewPartyShare] = useState("");

  // New State for Validation Errors
  const [errors, setErrors] = useState({});

  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);    
  const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

  const campaignTypes = ["Discount Campaign", "Loyalty Points", "Cashback Rewards", "Offers/ Stamp"];

  // --- 1. FETCH CURRENCIES ---
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        const res = await metadataApi.getCurrencies();
        setCurrencyList(res.data?.rows || res.data || []);
      } catch (err) { console.error(err); } 
      finally { setLoadingCurrencies(false); }
    };
    fetchCurrencies();
  }, []); 

  // --- 2. POPULATE FIELDS ---
  useEffect(() => {
    if (data) {
      const c = data.campaign || data; 
      const d = data.discount || {};

      if (!campaignName) setCampaignName(c.name || "");
      if (!description) setDescription(c.description || "");
      
      const rawStart = c.start_date || c.startDate; 
      const rawEnd = c.end_date || c.endDate;

      if (rawStart) setStartDate(rawStart.includes("T") ? rawStart.split('T')[0] : rawStart);
      if (rawEnd) setEndDate(rawEnd.includes("T") ? rawEnd.split('T')[0] : rawEnd);
      
      if (c.type || c.campaignType) {
          const typeVal = c.type || c.campaignType;
          const typeFormatted = typeVal.charAt(0).toUpperCase() + typeVal.slice(1);
          setCampaignType(typeFormatted.includes("Campaign") ? typeFormatted : `${typeFormatted} Campaign`);
      }

      if (!currency) setCurrency(c.base_currency_id || c.currency || "");
      if (!fundAmount) setFundAmount(c.total_budget || c.fundAmount || "");

      const isMulti = c.is_multi_currency !== undefined ? c.is_multi_currency : c.convertToBase;
      setConvertToBase(!!isMulti);

      if (c.currencies && Array.isArray(c.currencies)) {
         const baseId = c.base_currency_id || Number(c.currency);
         const targets = c.currencies
           .map(item => (typeof item === 'object' ? item.currency_id : item)) 
           .filter(id => id !== baseId);
         setTargetCurrencies(targets);
      } else if (c.targetCurrencies) {
         setTargetCurrencies(c.targetCurrencies);
      }

      if (d.discount_sponsors && Array.isArray(d.discount_sponsors)) {
         const bankS = d.discount_sponsors.find(s => s.name === "Bank");
         const merchS = d.discount_sponsors.find(s => s.name === "Merchant");
         const others = d.discount_sponsors.filter(s => s.name !== "Bank" && s.name !== "Merchant");

         setBankShare(bankS ? String(bankS.fund_percentage) : "0");
         setMerchantShare(merchS ? String(merchS.fund_percentage) : "0");
         
         if (extraShares.length === 0) {
            setExtraShares(others.map(s => ({ name: s.name, share: String(s.fund_percentage) })));
         }
      } else {
         if (!bankShare && data.bankShare) setBankShare(String(data.bankShare));
         if (!merchantShare && data.merchantShare) setMerchantShare(String(data.merchantShare));
         if (extraShares.length === 0 && data.extraShares) setExtraShares(data.extraShares);
      }
    }
  }, [data]);

  // --- Update Parent Helper ---
  const updateParent = (updates) => {
    const existingId = data?.campaign?.id || data?.id;
    const currentData = {
      id: existingId,
      name: updates.name ?? campaignName,
      description: updates.description ?? description,
      startDate: updates.startDate ?? startDate,
      endDate: updates.endDate ?? endDate,
      campaignType: updates.campaignType ?? campaignType,
      currency: updates.currency ?? currency,
      fundAmount: updates.fundAmount ?? fundAmount,
      convertToBase: updates.convertToBase ?? convertToBase,
      targetCurrencies: updates.targetCurrencies ?? targetCurrencies,
      bankShare: updates.bankShare ?? bankShare,
      merchantShare: updates.merchantShare ?? merchantShare,
      extraShares: updates.extraShares ?? extraShares
    };
    onUpdate(currentData);
  };

  // --- Field Handlers ---
  const handleCampaignNameChange = (val) => { 
      setCampaignName(val); 
      if(val) setErrors(prev => ({...prev, campaignName: false}));
      updateParent({ name: val }); 
  };
  const handleDescriptionChange = (val) => { 
      setDescription(val); 
      if(val) setErrors(prev => ({...prev, description: false}));
      updateParent({ description: val }); 
  };
  const handleStartDateChange = (val) => { 
      setStartDate(val); 
      if(val) setErrors(prev => ({...prev, startDate: false}));
      updateParent({ startDate: val }); 
  };
  const handleEndDateChange = (val) => { 
      setEndDate(val); 
      if(val) setErrors(prev => ({...prev, endDate: false}));
      updateParent({ endDate: val }); 
  };
  const handleCampaignTypeChange = (val) => { setCampaignType(val); updateParent({ campaignType: val }); };
  const handleCurrencyChange = (val) => { 
    const id = Number(val); setCurrency(id); 
    if(id) setErrors(prev => ({...prev, currency: false}));
    const targets = targetCurrencies.filter(c => c !== id); setTargetCurrencies(targets);
    updateParent({ currency: id, targetCurrencies: targets }); 
  };
  const handleFundAmountChange = (val) => { 
      if (val === "" || /^\d*\.?\d*$/.test(val)) { 
          setFundAmount(val); 
          if(val) setErrors(prev => ({...prev, fundAmount: false}));
          updateParent({ fundAmount: val }); 
      }
  };
  const handleToggleChange = () => { 
    const newVal = !convertToBase; setConvertToBase(newVal); 
    const newTargets = newVal ? targetCurrencies : []; setTargetCurrencies(newTargets);
    updateParent({ convertToBase: newVal, targetCurrencies: newTargets }); 
  };
  const handleTargetCurrencySelect = (currencyId) => {
    const id = Number(currencyId);
    let newTargets = targetCurrencies.includes(id) ? targetCurrencies.filter(c => c !== id) : [...targetCurrencies, id];
    setTargetCurrencies(newTargets); updateParent({ targetCurrencies: newTargets });
  };
  const handleBankShareChange = (val) => { 
      if (val === "" || /^\d*\.?\d*$/.test(val)) { 
          setBankShare(val); 
          if(val) setErrors(prev => ({...prev, bankShare: false}));
          updateParent({ bankShare: val }); 
      }
  };
  const handleMerchantShareChange = (val) => { 
      if (val === "" || /^\d*\.?\d*$/.test(val)) { 
          setMerchantShare(val); 
          if(val) setErrors(prev => ({...prev, merchantShare: false}));
          updateParent({ merchantShare: val }); 
      }
  };
  const handleNewPartyShareChange = (val) => { if (val === "" || /^\d*\.?\d*$/.test(val)) { setNewPartyShare(val); }};
  
  const handleAddShare = () => {
    if(newPartyName && newPartyShare) {
      const u = [...extraShares, { name: newPartyName, share: newPartyShare }];
      setExtraShares(u); setIsModalOpen(false); setNewPartyName(""); setNewPartyShare("");
      updateParent({ extraShares: u });
    }
  };
  const handleDeleteShare = (index) => {
    const u = extraShares.filter((_, i) => i !== index);
    setExtraShares(u); updateParent({ extraShares: u });
  };

  // --- 🕵️‍♂️ VALIDATION LOGIC ---
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!campaignName.trim()) { newErrors.campaignName = true; isValid = false; }
    if (!description.trim()) { newErrors.description = true; isValid = false; }
    if (!startDate) { newErrors.startDate = true; isValid = false; }
    if (!endDate) { newErrors.endDate = true; isValid = false; }
    if (!currency) { newErrors.currency = true; isValid = false; }
    if (!fundAmount) { newErrors.fundAmount = true; isValid = false; }
    if (bankShare === "") { newErrors.bankShare = true; isValid = false; }
    if (merchantShare === "") { newErrors.merchantShare = true; isValid = false; }

    // Date Logic Validation
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            alert("End Date cannot be before Start Date");
            newErrors.endDate = true;
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- 🚀 SUBMIT LOGIC ---
  const handleSubmit = async (action) => { 
    // Run Validation
    if (!validateForm()) {
        alert("Please enter all required details");
        return;
    }
    
    // Validate Shares Sum
    const totalShare = (parseFloat(bankShare) || 0) + (parseFloat(merchantShare) || 0) + extraShares.reduce((sum, s) => sum + (parseFloat(s.share) || 0), 0);
    if (totalShare > 100) { alert(`Total fund share exceeds 100%.`); return; }

    const existingId = data?.campaign?.id || data?.id;
    const allCurrencies = [...new Set([Number(currency), ...targetCurrencies])];
    
    const sponsorsPayload = [
        { name: "Bank", fund_percentage: parseFloat(bankShare) || 0 },
        { name: "Merchant", fund_percentage: parseFloat(merchantShare) || 0 },
        ...extraShares.map(s => ({ name: s.name, fund_percentage: parseFloat(s.share) || 0 }))
    ];

    // --- 🛠️ CONSTRUCT FULL PAYLOAD (Preserving Steps 2, 3, 4, 5) ---
    // Retrieve existing data from the 'data' prop to prevent overwriting other steps with null
    const existingSegments = data?.segments || [];
    const existingDates = data?.discount_dates || [];
    const existingMids = data?.discount_mids || [];
    // discount_amounts might be in data.discount.discount_amounts or data.discount_amounts
    const existingAmounts = data?.discount?.discount_amounts || data?.discount_amounts || [];
    const existingAcquirerId = data?.campaign?.acquirer_campaign_id || data?.acquirer_campaign_id || 148;

    const fullPayload = {
        // Step 1: New Values from State
        name: campaignName,
        description: description,
        total_budget: parseFloat(fundAmount),
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        discount_sponsors: sponsorsPayload,
        bank_id: 1, 
        type: "discount",
        base_currency_id: Number(currency),
        is_multi_currency: convertToBase,
        currencies: allCurrencies,

        // Preserved Values from Other Steps
        acquirer_campaign_id: existingAcquirerId,
        segments: existingSegments,
        discount_dates: existingDates,
        discount_mids: existingMids,
        discount_amounts: existingAmounts,

        // Static Fields
        discount_card_networks: [],
        discount_card_types: [],
        bin_based: true,
        appletoken_based: true,
        card_based: false
    };

    console.log("📤 Step 1 Submitting Full Payload:", JSON.stringify(fullPayload, null, 2));

    let endpointCall = null; 
    let performApiCall = true;

    if (action === 'update') setIsUpdateSubmitting(true);
    else if (!isEditMode) setIsNextSubmitting(true);

    if (isEditMode) {
        if (action === 'update') {
            // Update using the FULL merged payload
            endpointCall = campaignDiscountApi.update(existingId, fullPayload); 
        } else {
            performApiCall = false; 
        }
    } else {
      // Create
      endpointCall = campaignDiscountApi.create(fullPayload); 
    }

    try {
        if (performApiCall) {
            let response = await endpointCall;
            const responseData = response.data || {};
            const newId = responseData.campaign?.id || responseData.id || existingId;
            
            // Pass the FULL merged data back to parent so local state is updated
            onUpdate({ 
                ...data, 
                campaign: { ...data.campaign, ...fullPayload }, 
                id: newId 
            });
        }
        
        if (action === 'next') {
            onNext(); 
        } else if (action === 'update') {
            if (onRefresh) await onRefresh();
        }

    } catch (error) {
      console.error("Error saving campaign:", error);
      alert(`Failed to save campaign. ${error.message}`);
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };

  const calculateAmount = (percent) => (!fundAmount || !percent) ? 0 : (parseFloat(fundAmount) * parseFloat(percent) / 100).toFixed(0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 pt-5 pr-5 pl-5 shadow-sm relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2 items-center">
          <span className="w-5 h-5 text-center bg-[#EFEFFD] text-[#7747EE] rounded-full text-xs">1</span>
          <h3 className="card-inside-head">Campaign Details</h3>
        </div>
        <div className="text-xs text-gray-500">Step 1 of 6</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 bg-[#F7F9FB] p-4 rounded border border-gray-100">
          <label className="block text-sm text-gray-700 mb-2">Campaign Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={campaignName} 
            onChange={(e) => handleCampaignNameChange(e.target.value)} 
            className={`w-full border rounded p-2 text-sm mb-3 ${errors.campaignName ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Campaign Name" 
            disabled={isAnySubmitting} 
          />
          <label className="block text-sm text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea 
            value={description} 
            onChange={(e) => handleDescriptionChange(e.target.value)} 
            className={`w-full border rounded p-2 text-sm h-20 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} 
            placeholder="Description" 
            disabled={isAnySubmitting} 
          />
        </div>

        <div className="lg:col-span-1 bg-[#F7F9FB] border border-gray-100 p-4 rounded mb-4">
          <div className="">
            <label className="block text-sm text-gray-700 mb-2 mt-6">Start Date <span className="text-red-500">*</span></label>
            <input 
                type="date" 
                value={startDate} 
                onChange={(e) => handleStartDateChange(e.target.value)} 
                disabled={isAnySubmitting} 
                className={`w-full border rounded p-2 text-sm ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`} 
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-700 mb-2">End Date <span className="text-red-500">*</span></label>
            <input 
                type="date" 
                value={endDate} 
                onChange={(e) => handleEndDateChange(e.target.value)} 
                disabled={isAnySubmitting} 
                className={`w-full border rounded p-2 text-sm ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`} 
            />
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-[#F7F9FB] border border-gray-100 p-4 rounded h-full">
            <div className="text-sm font-medium mb-3">Campaign Type <span className="text-red-500">*</span></div>
            <div className={`grid grid-cols-2 gap-3 ${isAnySubmitting ? 'opacity-60 pointer-events-none' : ''}`}>
              {campaignTypes.map((t) => {
                const active = campaignType === t;
                return (
                  <label key={t} onClick={() => !isAnySubmitting && handleCampaignTypeChange(t)} className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all duration-150 ${active ? "bg-[#7747EE] border-none text-white" : "bg-white text-gray-900 border border-gray-200 hover:border-[#7B3FE4]/40"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${active ? "bg-white" : "border border-gray-300"}`}>
                        {active && <div className="rounded-full" style={{ width: 8, height: 8, background: "linear-gradient(90deg,#7B3FE4,#9B5DF7)" }} />}
                      </div>
                      <span className={`text-sm font-medium ${active ? "text-white" : "text-gray-900"}`} style={{ fontSize: "12px" }}>{t}</span>
                  </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#F7F9FB] border border-gray-100 p-4 rounded">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Campaign Budget</h4>
            <label className="block text-xs font-medium text-gray-700 mb-1">Base Currency & Campaign Fund *</label>
            <div className="flex items-center mb-4">
                <select 
                    value={currency} 
                    onChange={(e) => handleCurrencyChange(e.target.value)} 
                    disabled={isAnySubmitting} 
                    className={`bg-gray-50 border text-gray-900 text-xs px-3 py-2.5 rounded-l-md outline-none min-w-[120px] focus:ring-1 focus:ring-[#7747EE] ${errors.currency ? 'border-red-500' : 'border-gray-300'}`}
                >
                    <option value="" className="text-gray-500">Select</option>
                    {loadingCurrencies ? <option value="" disabled>Loading...</option> : currencyList.map((c) => <option key={c.id} value={c.id}>{c.code} ({c.symbol})</option>)}
                </select>
                <input 
                    type="text" 
                    inputMode="decimal" 
                    value={fundAmount} 
                    onChange={(e) => handleFundAmountChange(e.target.value)} 
                    className={`flex-1 border rounded-r-md py-2 px-3 text-sm outline-none ${errors.fundAmount ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="5000000" 
                    disabled={isAnySubmitting} 
                />
            </div>

            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">Convert To Base Currency</span>
                <div onClick={() => !isAnySubmitting && handleToggleChange()} className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${convertToBase ? 'bg-[#7747EE]' : 'bg-gray-300'} ${isAnySubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${convertToBase ? 'translate-x-5' : ''}`}></div>
                </div>
            </div>
            
            {convertToBase && (
                 <div className={`border border-blue-200 border-dashed rounded p-3 bg-blue-50/50 ${isAnySubmitting ? 'opacity-60 pointer-events-none' : ''}`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                        {currencyList.filter(c => c.id !== Number(currency)).map((c) => (
                             <label key={c.id} onClick={() => !isAnySubmitting && handleTargetCurrencySelect(c.id)} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                     <div className={`w-4 h-4 border rounded flex items-center justify-center ${targetCurrencies.includes(c.id) ? 'bg-[#7747EE] border-[#7747EE]' : 'bg-white border-gray-300'}`}>
                                         {targetCurrencies.includes(c.id) && <span className="text-white text-[10px]">✓</span>}
                                     </div>
                                     <span>{c.code}</span>
                             </label>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="bg-[#F7F9FB] border border-gray-100 p-4 rounded">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Fund Share</h4>
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-700">Bank Share (%) <span className="text-red-500">*</span></label>
                    <span className="text-[10px] text-gray-500 font-medium">Amount: {calculateAmount(bankShare)}</span>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        inputMode="decimal" 
                        value={bankShare} 
                        onChange={(e) => handleBankShareChange(e.target.value)} 
                        className={`w-full border rounded px-3 py-2 text-sm outline-none ${errors.bankShare ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="60" 
                        disabled={isAnySubmitting} 
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
                        type="text" 
                        inputMode="decimal" 
                        value={merchantShare} 
                        onChange={(e) => handleMerchantShareChange(e.target.value)} 
                        className={`w-full border rounded px-3 py-2 text-sm outline-none ${errors.merchantShare ? 'border-red-500' : 'border-gray-300'}`} 
                        placeholder="40" 
                        disabled={isAnySubmitting} 
                    />
                    <span className="absolute right-3 top-2 text-gray-400 text-xs">%</span>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-[#F7F9FB] border border-gray-100 p-4 rounded mb-6">
        <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800">Third Party Shares</h4>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#7747EE] text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm" disabled={isAnySubmitting}><span>+</span> Add Share</button>
        </div>
        {extraShares.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-1">
                {extraShares.map((share, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-gray-200 relative group">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-medium text-gray-700">{share.name} Share (%)</label>
                            <span className="text-[10px] text-gray-500 font-medium">Amount: {calculateAmount(share.share)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <input type="text" value={share.share} disabled className="w-full border border-gray-100 bg-gray-50 rounded px-3 py-1.5 text-sm text-gray-500" />
                                <span className="absolute right-3 top-1.5 text-gray-400 text-xs">%</span>
                            </div>
                            <button onClick={() => handleDeleteShare(idx)} disabled={isAnySubmitting} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onPrevious} disabled={isAnySubmitting} className="px-4 py-2 bg-white border border-gray-200 rounded text-sm disabled:opacity-50">← Previous</button>
        <div className="flex gap-3">
            {isEditMode && (
                <button onClick={() => handleSubmit('update')} disabled={isAnySubmitting} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70">
                    {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} {isUpdateSubmitting ? "Updating..." : "Update"}
                </button>
            )}
            <button onClick={() => handleSubmit('next')} disabled={isAnySubmitting} className="px-4 py-2 bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white rounded text-sm flex items-center gap-2 disabled:opacity-70">
                {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} {isNextSubmitting ? "Saving..." : "Next →"}
            </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-gray-800 font-semibold">Add Share</h3><button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button></div>
                <div className="p-6">
                    <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-4" placeholder="Party name" value={newPartyName} onChange={(e) => setNewPartyName(e.target.value)} />
                    <input type="text" inputMode="decimal" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" placeholder="40" value={newPartyShare} onChange={(e) => handleNewPartyShareChange(e.target.value)} />
                </div>
                <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-50">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-full border border-[#7747EE] text-[#7747EE] text-sm">Cancel</button>
                    <button onClick={handleAddShare} className="px-6 py-2 rounded-full bg-[#7747EE] text-white text-sm">Add</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;