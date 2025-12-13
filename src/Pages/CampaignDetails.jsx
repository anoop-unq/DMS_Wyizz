// import React, { useState, useEffect } from "react";
// import { Trash2, X, Loader2, Edit,ChevronDown } from "lucide-react";
// import Swal from "sweetalert2";
// import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
// import StepHeader from "../StepReusable/Stepheader";
// import { assets } from "../assets/assets";

// const CampaignDetails = ({
//   data,
//   onUpdate,
//   onNext,
//   onPrevious,
//   onSuccess,
//   isEditMode,
//   onRefresh,
// }) => {
//   // --- State Management ---
//   const [campaignName, setCampaignName] = useState("");
//   const [description, setDescription] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // Default to "discount" value to match API
//   const [campaignType, setCampaignType] = useState("discount");

//   const [currency, setCurrency] = useState("");
//   const [currencyList, setCurrencyList] = useState([]);
//   const [loadingCurrencies, setLoadingCurrencies] = useState(false);
//   const [fundAmount, setFundAmount] = useState("");
//   const [convertToBase, setConvertToBase] = useState(false);
//   const [targetCurrencies, setTargetCurrencies] = useState([]);
//   const [bankShare, setBankShare] = useState("");
//   const [merchantShare, setMerchantShare] = useState("");
//   const [extraShares, setExtraShares] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newPartyName, setNewPartyName] = useState("");
//   const [newPartyShare, setNewPartyShare] = useState("");

//   // Track validation errors
//   const [errors, setErrors] = useState({});

//   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
//   const [isNextSubmitting, setIsNextSubmitting] = useState(false);
//   const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

//   // NEW: State to track which item is being edited (null means adding new)
//   const [editingShareIndex, setEditingShareIndex] = useState(null);

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Update campaignTypes to objects with label and value
//   const campaignTypes = [
//     { label: "Discount Campaign", value: "discount" },
//     { label: "Loyalty Points", value: "loyalty_points" }, // Assuming API value
//     { label: "Cashback Rewards", value: "cashback_rewards" }, // Assuming API value
//     { label: "Offers/ Stamp", value: "stamp_offers" }, // Assuming API value
//   ];

//   // --- 1. FETCH CURRENCIES ---
//   useEffect(() => {
//     const fetchCurrencies = async () => {
//       setLoadingCurrencies(true);
//       try {
//         const res = await metadataApi.getCurrencies();
//         setCurrencyList(res.data?.rows || res.data || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingCurrencies(false);
//       }
//     };
//     fetchCurrencies();
//   }, []);

//   // --- 2. POPULATE FIELDS ---
//   useEffect(() => {
//     if (data) {
//       const c = data.campaign || data;
//       const d = data.discount || {};

//       if (!campaignName) setCampaignName(c.name || "");
//       if (!description) setDescription(c.description || "");

//       const rawStart = c.start_date || c.startDate;
//       const rawEnd = c.end_date || c.endDate;

//       if (rawStart)
//         setStartDate(
//           rawStart.includes("T") ? rawStart.split("T")[0] : rawStart
//         );
//       if (rawEnd)
//         setEndDate(rawEnd.includes("T") ? rawEnd.split("T")[0] : rawEnd);

//       // Smart Type Matching
//       if (c.type || c.campaignType) {
//         const incomingType = c.type || c.campaignType;
//         // Check if incomingType matches any value in campaignTypes
//         const exactMatch = campaignTypes.find((t) => t.value === incomingType);

//         if (exactMatch) {
//           setCampaignType(exactMatch.value);
//         } else {
//           // If no exact match, fallback logic (optional, but good for robustness)
//           const lowerType = String(incomingType).toLowerCase();
//           if (lowerType.includes("discount")) setCampaignType("discount");
//           else if (lowerType.includes("loyalty"))
//             setCampaignType("loyalty_points");
//           else if (lowerType.includes("cashback"))
//             setCampaignType("cashback_rewards");
//           else if (lowerType.includes("offer") || lowerType.includes("stamp"))
//             setCampaignType("stamp_offers");
//           else setCampaignType("discount");
//         }
//       }

//       if (!currency) setCurrency(c.base_currency_id || c.currency || "");
//       if (!fundAmount) setFundAmount(c.total_budget || c.fundAmount || "");

//       const isMulti =
//         c.is_multi_currency !== undefined
//           ? c.is_multi_currency
//           : c.convertToBase;
//       setConvertToBase(!!isMulti);

//       if (c.currencies && Array.isArray(c.currencies)) {
//         const baseId = c.base_currency_id || Number(c.currency);
//         const targets = c.currencies
//           .map((item) => (typeof item === "object" ? item.currency_id : item))
//           .filter((id) => id !== baseId);
//         setTargetCurrencies(targets);
//       } else if (c.targetCurrencies) {
//         setTargetCurrencies(c.targetCurrencies);
//       }

//       if (d.discount_sponsors && Array.isArray(d.discount_sponsors)) {
//         const bankS = d.discount_sponsors.find((s) => s.name === "Bank");
//         const merchS = d.discount_sponsors.find((s) => s.name === "Merchant");
//         const others = d.discount_sponsors.filter(
//           (s) => s.name !== "Bank" && s.name !== "Merchant"
//         );

//         setBankShare(bankS ? String(bankS.fund_percentage) : "0");
//         setMerchantShare(merchS ? String(merchS.fund_percentage) : "0");

//         if (extraShares.length === 0) {
//           setExtraShares(
//             others.map((s) => ({
//               name: s.name,
//               share: String(s.fund_percentage),
//             }))
//           );
//         }
//       } else {
//         if (!bankShare && data.bankShare) setBankShare(String(data.bankShare));
//         if (!merchantShare && data.merchantShare)
//           setMerchantShare(String(data.merchantShare));
//         if (extraShares.length === 0 && data.extraShares)
//           setExtraShares(data.extraShares);
//       }
//     }
//   }, [data]);

//   // --- Update Parent Helper ---
//   const updateParent = (updates) => {
//     const existingId = data?.campaign?.id || data?.id;
//     const currentData = {
//       id: existingId,
//       name: updates.name ?? campaignName,
//       description: updates.description ?? description,
//       startDate: updates.startDate ?? startDate,
//       endDate: updates.endDate ?? endDate,
//       campaignType: updates.campaignType ?? campaignType,
//       currency: updates.currency ?? currency,
//       fundAmount: updates.fundAmount ?? fundAmount,
//       convertToBase: updates.convertToBase ?? convertToBase,
//       targetCurrencies: updates.targetCurrencies ?? targetCurrencies,
//       bankShare: updates.bankShare ?? bankShare,
//       merchantShare: updates.merchantShare ?? merchantShare,
//       extraShares: updates.extraShares ?? extraShares,
//     };
//     onUpdate(currentData);
//   };

//   // --- ✅ HELPER: Focus & Border Logic ---
//   const handleInputFocus = (field) => {
//     // Clear error on focus
//     if (errors[field]) {
//       setErrors((prev) => {
//         const newErrs = { ...prev };
//         delete newErrs[field];
//         return newErrs;
//       });
//     }
//   };

//   // ✅ UPDATED: Added 'relative' and 'focus:z-10' to ensure ring shows on top
//   const getBorderClass = (field) => {
//     return errors[field]
//       ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 relative z-10"
//       : "border-gray-300 focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] relative focus:z-10";
//   };

//   // --- Field Handlers ---
//   const handleCampaignNameChange = (val) => {
//     setCampaignName(val);
//     updateParent({ name: val });
//   };
//   const handleDescriptionChange = (val) => {
//     setDescription(val);
//     updateParent({ description: val });
//   };
//   const handleStartDateChange = (val) => {
//     setStartDate(val);
//     updateParent({ startDate: val });
//   };
//   const handleEndDateChange = (val) => {
//     setEndDate(val);
//     updateParent({ endDate: val });
//   };
//   const handleCampaignTypeChange = (val) => {
//     setCampaignType(val);
//     updateParent({ campaignType: val });
//   };

//   const handleCurrencyChange = (val) => {
//     const id = Number(val);
//     setCurrency(id);
//     const targets = targetCurrencies.filter((c) => c !== id);
//     setTargetCurrencies(targets);
//     // Clear error immediately
//     if (id) handleInputFocus("currency");
//     updateParent({ currency: id, targetCurrencies: targets });
//   };

//   const handleFundAmountChange = (val) => {
//     if (val === "" || /^\d*\.?\d*$/.test(val)) {
//       setFundAmount(val);
//       updateParent({ fundAmount: val });
//     }
//   };
//   const handleToggleChange = () => {
//     const newVal = !convertToBase;
//     setConvertToBase(newVal);
//     const newTargets = newVal ? targetCurrencies : [];
//     setTargetCurrencies(newTargets);
//     updateParent({ convertToBase: newVal, targetCurrencies: newTargets });
//   };
//   const handleTargetCurrencySelect = (currencyId) => {
//     const id = Number(currencyId);
//     let newTargets = targetCurrencies.includes(id)
//       ? targetCurrencies.filter((c) => c !== id)
//       : [...targetCurrencies, id];
//     setTargetCurrencies(newTargets);
//     updateParent({ targetCurrencies: newTargets });
//   };
//   const handleBankShareChange = (val) => {
//     if (val === "" || /^\d*\.?\d*$/.test(val)) {
//       setBankShare(val);
//       updateParent({ bankShare: val });
//     }
//   };
//   const handleMerchantShareChange = (val) => {
//     if (val === "" || /^\d*\.?\d*$/.test(val)) {
//       setMerchantShare(val);
//       updateParent({ merchantShare: val });
//     }
//   };
//   const handleNewPartyShareChange = (val) => {
//     if (val === "" || /^\d*\.?\d*$/.test(val)) {
//       setNewPartyShare(val);
//     }
//   };

//   const handleAddShare = () => {
//     if (newPartyName && newPartyShare) {
//       const u = [...extraShares, { name: newPartyName, share: newPartyShare }];
//       setExtraShares(u);
//       setIsModalOpen(false);
//       setNewPartyName("");
//       setNewPartyShare("");
//       updateParent({ extraShares: u });
//     }
//   };
//   const handleDeleteShare = (index) => {
//     const u = extraShares.filter((_, i) => i !== index);
//     setExtraShares(u);
//     updateParent({ extraShares: u });
//   };

//   const openAddShareModal = () => {
//     setNewPartyName("");
//     setNewPartyShare("");
//     setEditingShareIndex(null); // Reset to "Add" mode
//     setIsModalOpen(true);
//   };

//   // 2. Open Modal for Editing
//   const openEditShareModal = (index) => {
//     const itemToEdit = extraShares[index];
//     setNewPartyName(itemToEdit.name);
//     setNewPartyShare(itemToEdit.share);
//     setEditingShareIndex(index); // Set to "Edit" mode with specific index
//     setIsModalOpen(true);
//   };

//   // 3. Save (Add or Update)
//   const handleSaveShare = () => {
//     if (!newPartyName || !newPartyShare) return;

//     let updatedShares = [...extraShares];

//     if (editingShareIndex !== null) {
//       // UPDATE EXISTING
//       updatedShares[editingShareIndex] = {
//         name: newPartyName,
//         share: newPartyShare,
//       };
//     } else {
//       // ADD NEW
//       updatedShares.push({
//         name: newPartyName,
//         share: newPartyShare,
//       });
//     }

//     setExtraShares(updatedShares);
//     updateParent({ extraShares: updatedShares });

//     // Close and Clean up
//     setIsModalOpen(false);
//     setNewPartyName("");
//     setNewPartyShare("");
//     setEditingShareIndex(null);
//   };

//   // --- 🕵️‍♂️ VALIDATION LOGIC ---
//   const validateForm = () => {
//     const newErrors = {};
//     let isValid = true;
//     let errorMsg = "Please fill in all mandatory fields to proceed.";

//     if (!campaignName.trim()) {
//       newErrors.campaignName = true;
//       isValid = false;
//     }
//     if (!description.trim()) {
//       newErrors.description = true;
//       isValid = false;
//     }
//     if (!startDate) {
//       newErrors.startDate = true;
//       isValid = false;
//     }
//     if (!endDate) {
//       newErrors.endDate = true;
//       isValid = false;
//     }
//     if (!currency) {
//       newErrors.currency = true;
//       isValid = false;
//     }
//     if (!fundAmount) {
//       newErrors.fundAmount = true;
//       isValid = false;
//     }
//     if (bankShare === "") {
//       newErrors.bankShare = true;
//       isValid = false;
//     }
//     if (merchantShare === "") {
//       newErrors.merchantShare = true;
//       isValid = false;
//     }

//     // Date Logic Validation
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       if (end < start) {
//         errorMsg = "End Date cannot be earlier than Start Date.";
//         newErrors.endDate = true;
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);

//     if (!isValid) {
//       Swal.fire({
//         icon: "warning",
//         title: "Missing Details",
//         text: errorMsg,

//         confirmButtonText: "Okay, I'll fix it",
//         background: "#F7F9FB",
//         border: "1px solid #E2E8F0",
//         color: "#404041ff",
//         confirmButtonColor: "#7747EE",
//       });
//     }

//     return isValid;
//   };

//   // --- 🚀 SUBMIT LOGIC ---
//   const handleSubmit = async (action) => {
//     if (!validateForm()) return;

//     const totalShare =
//       (parseFloat(bankShare) || 0) +
//       (parseFloat(merchantShare) || 0) +
//       extraShares.reduce((sum, s) => sum + (parseFloat(s.share) || 0), 0);
//     if (totalShare > 100) {
//       Swal.fire({
//         icon: "error",
//         title: "Allocation Error",
//         text: `Total fund share is ${totalShare}%. It cannot exceed 100%.`,
//         confirmButtonColor: "#d33",
//         confirmButtonText: "Adjust Shares",
//       });
//       return;
//     }

//     const existingId = data?.campaign?.id || data?.id;
//     const allCurrencies = [...new Set([Number(currency), ...targetCurrencies])];

//     const sponsorsPayload = [
//       { name: "Bank", fund_percentage: parseFloat(bankShare) || 0 },
//       { name: "Merchant", fund_percentage: parseFloat(merchantShare) || 0 },
//       ...extraShares.map((s) => ({
//         name: s.name,
//         fund_percentage: parseFloat(s.share) || 0,
//       })),
//     ];

//     const fullPayload = {
//       name: campaignName,
//       description: description,
//       total_budget: parseFloat(fundAmount),
//       start_date: new Date(startDate).toISOString(),
//       end_date: new Date(endDate).toISOString(),

//       bank_id: 1,
//       type: campaignType, // Use the state variable which holds the correct value
//       base_currency_id: Number(currency),
//       is_multi_currency: convertToBase,
//       currencies: allCurrencies,
//       discount: {
//         discount_sponsors: sponsorsPayload,
//       },
//     };

//     let endpointCall = null;
//     let performApiCall = true;

//     if (action === "update") setIsUpdateSubmitting(true);
//     else if (!isEditMode) setIsNextSubmitting(true);

//     if (isEditMode) {
//       if (action === "update") {
//         endpointCall = campaignDiscountApi.update(existingId, fullPayload);
//       } else {
//         performApiCall = false;
//       }
//     } else {
//       endpointCall = campaignDiscountApi.create(fullPayload);
//     }

//     try {
//       if (performApiCall) {
//         let response = await endpointCall;
//         const responseData = response.data || {};
//         const newId =
//           responseData.campaign?.id || responseData.id || existingId;

//         onUpdate({
//           ...data,
//           campaign: { ...data.campaign, ...fullPayload },
//           id: newId,
//         });

//         // ✅ ENHANCED UI: Success Popup (Dark Theme)
//         if (action === "update") {
//           // ✅ SUCCESS STATE: Clean White, Brand Purple Button, Soft Shadow
//           Swal.fire({
//             icon: "success",
//             title: "Campaign Updated",
//             text: "All changes have been saved successfully.",
//             background: "#ffffff",
//             color: "#1e293b", // Slate-800 (Professional Dark Gray)
//             iconColor: "#10B981", // Emerald-500 (Modern Success Green)
//             confirmButtonText: "Great, Continue",
//             confirmButtonColor: "#7747EE", // ✅ YOUR BRAND PURPLE
//             timer: 2000,
//             timerProgressBar: true,
//             backdrop: `rgba(0,0,0,0.3)`, // Slight dimming of background
//             customClass: {
//               popup: "rounded-xl border border-gray-100 shadow-2xl", // Soft, high-end shadow
//               title: "text-lg font-bold text-gray-800",
//               htmlContainer: "text-sm text-gray-500",
//               confirmButton:
//                 "px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow",
//             },
//           });
//         }
//       }

//       if (action === "next") {
//         onNext();
//       } else if (action === "update") {
//         if (onRefresh) await onRefresh();
//       }
//     } catch (error) {
//       console.error("Error saving campaign:", error);
//       const errorMsg =
//         error.response?.data?.message || error.message || "Unknown error";
//       Swal.fire({
//         icon: "error",
//         title: "Save Failed",
//         text: errorMsg,
//         background: "#ffffff",
//         color: "#1e293b",
//         iconColor: "#EF4444", // Red-500 (Standard Error Red)
//         confirmButtonText: "Close",
//         confirmButtonColor: "#94a3b8", // Slate-400 (Neutral Gray for dismissal)
//         backdrop: `rgba(0,0,0,0.3)`,
//         customClass: {
//           popup: "rounded-xl border border-gray-100 shadow-2xl",
//           title: "text-lg font-bold text-gray-800",
//           htmlContainer: "text-sm text-gray-500",
//           confirmButton:
//             "px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-500 transition-colors",
//         },
//       });
//     } finally {
//       setIsUpdateSubmitting(false);
//       setIsNextSubmitting(false);
//     }
//   };

//   const calculateAmount = (percent) =>
//     !fundAmount || !percent
//       ? 0
//       : ((parseFloat(fundAmount) * parseFloat(percent)) / 100).toFixed(0);

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 pt-5 pr-5 pl-5 pb-5 shadow-sm relative">
//       <StepHeader step={1} totalSteps={6} title="Campaign Details" />
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//         {/* Left Column */}
//         <div className="col-span-1 bg-[#F7F9FB] p-4 rounded border border-[#E2E8F0]">
//           <label className="block text-sm text-gray-700 mb-2">
//             Campaign Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={campaignName}
//             onChange={(e) => handleCampaignNameChange(e.target.value)}
//             onFocus={() => handleInputFocus("campaignName")}
//             className={`w-full border bg-[#ffffff] rounded p-2 text-sm mb-3 outline-none ${getBorderClass(
//               "campaignName"
//             )}`}
//             placeholder="Campaign Name"
//             disabled={isAnySubmitting}
//           />
//           <label className="block text-sm text-gray-700 mb-2">
//             Description <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => handleDescriptionChange(e.target.value)}
//             onFocus={() => handleInputFocus("description")}
//             className={`w-full border bg-[#ffffff] rounded p-2 text-sm h-20 outline-none ${getBorderClass(
//               "description"
//             )}`}
//             placeholder="Description"
//             disabled={isAnySubmitting}
//           />
//         </div>

//         {/* Middle Column */}
//         <div className="lg:col-span-1 bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-4">
//           <div className="">
//            
//             <label className="flex gap-1 block text-sm text-gray-700 mb-2">
//                <img src={assets.CalendarLogo} className="w-4 h-4 mt-0.5"/>
//               Start Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => handleStartDateChange(e.target.value)}
//               onFocus={() => handleInputFocus("startDate")}
//               disabled={isAnySubmitting}
//               className={`w-full border bronze-icon bg-[#ffffff] rounded p-2 text-sm outline-none ${getBorderClass(
//                 "startDate"
//               )}`}
//             />
//           </div>
//           <div className="mt-4">
//                           <label className="flex gap-1 block text-sm text-gray-700 mb-2">
//                <img src={assets.CalendarLogo} className="w-4 h-4 mt-0.5"/>
//               End Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => handleEndDateChange(e.target.value)}
//               onFocus={() => handleInputFocus("endDate")}
//               disabled={isAnySubmitting}
//               className={`w-full bronze-icon border bg-[#ffffff] rounded p-2 text-sm outline-none ${getBorderClass(
//                 "endDate"
//               )}`}
//             />
//           </div>
//         </div>

//         {/* Right Column (Type Selection) */}
//         <div className="col-span-1">
//           <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded h-full">
//             <div className="text-sm font-medium mb-3">
//               Campaign Type <span className="text-red-500">*</span>
//             </div>
//             <div
//               className={`grid grid-cols-2 gap-3 ${
//                 isAnySubmitting ? "opacity-60 pointer-events-none" : ""
//               }`}
//             >
//               {campaignTypes.map((t) => {
//                 // Check if campaignType matches the value property
//                 const active = campaignType === t.value;
//                 return (
//                   <label
//                     key={t.value}
//                     onClick={() =>
//                       !isAnySubmitting && handleCampaignTypeChange(t.value)
//                     }
//                     className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all duration-150 ${
//                       active
//                         ? "bg-[#7747EE] border-none text-white shadow-md"
//                         : "bg-white text-gray-900 border border-gray-200 hover:border-[#B0B2F7]/40 hover:shadow-sm"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
//                           active ? "bg-white" : "border border-gray-300"
//                         }`}
//                       >
//                         {active && (
//                           <div
//                             className="rounded-full"
//                             style={{
//                               width: 8,
//                               height: 8,
//                               background:
//                                 "linear-gradient(90deg,#7B3FE4,#9B5DF7)",
//                             }}
//                           />
//                         )}
//                       </div>
//                       <span
//                         className={`text-sm font-medium ${
//                           active ? "text-white" : "text-gray-900"
//                         }`}
//                         style={{ fontSize: "12px" }}
//                       >
//                         {t.label}
//                       </span>
//                     </div>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
//         {/* Budget Section */}
//         <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded">
//           <h4 className="text-sm font-semibold text-gray-800 mb-3">
//             Campaign Budget
//           </h4>
//           <label className="block text-xs font-medium text-gray-700 mb-1">
//             Base Currency & Campaign Fund <span className="text-red-500">*</span>
//           </label>

//         
// <div className="flex items-center mb-4 h-[42px] relative z-20">
//   
//   {/* 1. LEFT SIDE: Custom Dropdown (Replaces <select>) */}
//   <div className="relative h-full">
//     <button
//       type="button"
//       /* Toggle the dropdown state you added in Step 2 */
//       onClick={() => !isAnySubmitting && setIsDropdownOpen(!isDropdownOpen)}
//       disabled={isAnySubmitting}
//       className={`
//         h-full flex items-center justify-between px-3
//         min-w-[130px] border border-r-0 rounded-l-md outline-none
//         transition-colors duration-200
//         ${getBorderClass("currency")}
//         ${
//           currency /* Check if a currency is selected */
//             ? "bg-[#7747EE] text-white border-transparent" /* PURPLE BG */
//             : "bg-white text-gray-900" /* WHITE BG */
//         }
//       `}
//                 onFocus={() => handleInputFocus("currency")}
//       style={{ borderRight: "none" }}
//     >
//       {/* Logic to show "Select" or the specific Currency Code */}
//       <span className="text-xs font-medium truncate mr-2">
//         {(() => {
//           if (loadingCurrencies) return "Loading...";
//           if (!currency) return "Select";
//           const selectedItem = currencyList.find((c) => c.id === Number(currency));
//           return selectedItem ? `${selectedItem.code} (${selectedItem.symbol})` : "Select";
//         })()}
//       </span>

//       {/* The Arrow Icon */}
//       <ChevronDown
//         className={`w-4 h-4 flex-shrink-0 transition-transform ${
//           isDropdownOpen ? "rotate-0" : ""
//         } ${currency ? "text-white" : "text-gray-500"}`}
//       />
//     </button>

//     {/* The Dropdown List (Visible only when open) */}
//     {isDropdownOpen && !loadingCurrencies && (
//       <div className="absolute top-full left-0 mt-1 w-[160px] bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden text-xs max-h-60 overflow-y-auto">
//         {/* Reset Option */}
//         <div
//           className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-500"
//           onClick={() => {
//             handleCurrencyChange("");
//             setIsDropdownOpen(false);
//           }}
//         >
//           Select
//         </div>
//         
//         {/* Currency Options */}
//         {currencyList.map((c) => (
//           <div
//             key={c.id}

//             className="px-3 py-2 hover:bg-[#eef2ff] hover:text-[#7747EE] cursor-pointer text-gray-700 border-b border-gray-50 last:border-0"
//             onClick={() => {
//               handleCurrencyChange(c.id);
//               setIsDropdownOpen(false);
//             }}
//           >
//             {c.code} ({c.symbol})
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* 2. RIGHT SIDE: Fund Amount Input (Same as before but with height fix) */}
//   <div className="flex-1 h-full relative z-0">
//     <input
//       type="text"
//       inputMode="decimal"
//       value={fundAmount}
//       onChange={(e) => handleFundAmountChange(e.target.value)}
//       onFocus={() => handleInputFocus("fundAmount")}
//       className={`
//         w-full h-full bg-[#ffffff] border rounded-r-md px-3 text-sm outline-none 
//         ${getBorderClass("fundAmount")}
//       `}
//       placeholder="5000000"
//       disabled={isAnySubmitting}
//     />
//   </div>
// </div>
// {/* --- END OF REPLACEMENT BLOCK --- */}

//           <div className="flex items-center justify-between mb-3">
//             <span className="text-sm text-gray-700">
//               Convert To Base Currency
//             </span>
//             <div
//               onClick={() => !isAnySubmitting && handleToggleChange()}
//               className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
//                 convertToBase ? "bg-[#7747EE]" : "bg-gray-300"
//               } ${
//                 isAnySubmitting
//                   ? "opacity-60 cursor-not-allowed"
//                   : "cursor-pointer"
//               }`}
//             >
//               <div
//                 className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
//                   convertToBase ? "translate-x-5" : ""
//                 }`}
//               ></div>
//             </div>
//           </div>

//           {convertToBase && (
//             <div
//               className={`border border-blue-200 border-dashed rounded p-3 bg-blue-50/50 ${
//                 isAnySubmitting ? "opacity-60 pointer-events-none" : ""
//               }`}
//             >
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
//                 {currencyList
//                   .filter((c) => c.id !== Number(currency))
//                   .map((c) => (
//                     <label
//                       key={c.id}
//                       onClick={() =>
//                         !isAnySubmitting && handleTargetCurrencySelect(c.id)
//                       }
//                       className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
//                     >
//                       <div
//                         className={`w-4 h-4 border rounded flex items-center justify-center ${
//                           targetCurrencies.includes(c.id)
//                             ? "bg-[#7747EE] border-[#7747EE]"
//                             : "bg-white border-gray-300"
//                         }`}
//                       >
//                         {targetCurrencies.includes(c.id) && (
//                           <span className="text-white text-[10px]">✓</span>
//                         )}
//                       </div>
//                       <span>{c.code}</span>
//                     </label>
//                   ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Share Section */}
//         <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded">
//           <h4 className="text-sm font-semibold text-gray-800 mb-3">
//             Fund Share
//           </h4>
//           <div className="mb-3">
//             <div className="flex justify-between items-center mb-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Bank Share (%) <span className="text-red-500">*</span>
//               </label>
//               <span className="text-[10px] text-gray-500 font-medium">
//                 Amount: {calculateAmount(bankShare)}
//               </span>
//             </div>
//             <div className="relative">
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 value={bankShare}
//                 onChange={(e) => handleBankShareChange(e.target.value)}
//                 onFocus={() => handleInputFocus("bankShare")}
//                 className={`w-full border bg-[#ffffff] rounded px-3 py-2 text-sm outline-none ${getBorderClass(
//                   "bankShare"
//                 )}`}
//                 placeholder="60"
//                 disabled={isAnySubmitting}
//               />
//               <span className="absolute right-3 top-2 text-gray-400 text-xs">
//                 %
//               </span>
//             </div>
//           </div>
//           <div className="mb-3">
//             <div className="flex justify-between items-center mb-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Merchant Share (%) <span className="text-red-500">*</span>
//               </label>
//               <span className="text-[10px] text-gray-500 font-medium">
//                 Amount: {calculateAmount(merchantShare)}
//               </span>
//             </div>
//             <div className="relative">
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 value={merchantShare}
//                 onChange={(e) => handleMerchantShareChange(e.target.value)}
//                 onFocus={() => handleInputFocus("merchantShare")}
//                 className={`w-full border bg-[#ffffff] rounded px-3 py-2 text-sm outline-none ${getBorderClass(
//                   "merchantShare"
//                 )}`}
//                 placeholder="40"
//                 disabled={isAnySubmitting}
//               />
//               <span className="absolute right-3 top-2 text-gray-400 text-xs">
//                 %
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ... inside your JSX ... */}

//       <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6">
//         <div className="flex items-center justify-between mb-3">
//           <h4 className="text-sm font-semibold text-gray-800">
//             Third Party Shares
//           </h4>
//           <button
//             onClick={openAddShareModal} // CHANGED THIS
//             className="bg-[#7747EE] text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
//             disabled={isAnySubmitting}
//           >
//             <span>+</span> Add Share
//           </button>
//         </div>
//         {extraShares.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[170px] hide-scroll overflow-y-auto pr-1">
//             {extraShares.map((share, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white p-3 rounded border border-[#E2E8F0] relative group"
//               >
//                 <div className="flex justify-between items-center mb-1">
//                   <label className="text-xs font-medium text-gray-700">
//                     {share.name} Share (%)
//                   </label>
//                   <span className="text-[10px] text-gray-500 font-medium">
//                     Amount: {calculateAmount(share.share)}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1">
//                     <input
//                       type="text"
//                       value={share.share}
//                       disabled // Keep this disabled here, they edit via modal
//                       className="w-full border border-gray-100 bg-gray-50 rounded px-3 py-1.5 text-sm text-gray-500"
//                     />
//                     <span className="absolute right-3 top-1.5 text-gray-400 text-xs">
//                       %
//                     </span>
//                   </div>

//                   {/* --- NEW EDIT BUTTON --- */}
//                   <button
//                     onClick={() => openEditShareModal(idx)}
//                     disabled={isAnySubmitting}
//                     className="text-gray-400 hover:text-[#7747EE] transition-colors"
//                     title="Edit Share"
//                   >
//                     <Edit size={14} />
//                   </button>

//                   <button
//                     onClick={() => handleDeleteShare(idx)}
//                     disabled={isAnySubmitting}
//                     className="text-gray-400 hover:text-red-500 transition-colors"
//                     title="Delete Share"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex justify-between items-center">
//         {/* PREVIOUS BUTTON */}
//         <button
//           onClick={onPrevious}
//           disabled={isAnySubmitting}
//           className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] disabled:opacity-50"
//         >
//           <span className="flex justify-center items-center gap-2">
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#000000"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M15 18l-6-6 6-6" />
//             </svg>
//             Previous
//           </span>
//         </button>

//         <div className="flex gap-3">
//           {/* UPDATE BUTTON */}
//           {isEditMode && (
//             <button
//               onClick={() => handleSubmit("update")}
//               disabled={isAnySubmitting}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70 transition-colors"
//             >
//               {isUpdateSubmitting && (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               )}
//               {isUpdateSubmitting ? "Updating..." : "Update"}
//             </button>
//           )}

//           {/* NEXT BUTTON */}
//           <button
//             onClick={() => handleSubmit("next")}
//             disabled={isAnySubmitting}
//             className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center disabled:opacity-70"
//           >
//             {isNextSubmitting && (
//               <Loader2 className="w-4 h-4 animate-spin mr-2" />
//             )}
//             {isNextSubmitting ? "Saving..." : "Next →"}
//           </button>
//         </div>
//       </div>

//       {/* ... inside the Modal JSX ... */}

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//               {/* DYNAMIC TITLE */}
//               <h3 className="text-gray-800 font-semibold">
//                 {editingShareIndex !== null ? "Edit Share" : "Add Share"}
//               </h3>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6">
//               <input
//                 type="text"
//                 className="w-full border border-[#E2E8F0] bg-white outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] rounded-lg px-3 py-2.5 text-sm mb-4"
//                 placeholder="Party name"
//                 value={newPartyName}
//                 onChange={(e) => setNewPartyName(e.target.value)}
//               />
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 className="w-full border border-[#E2E8F0] bg-white outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] rounded-lg px-3 py-2.5 text-sm"
//                 placeholder="40"
//                 value={newPartyShare}
//                 onChange={(e) => handleNewPartyShareChange(e.target.value)}
//               />
//             </div>
//             <div className="px-6 py-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-5 py-2 rounded-full border border-[#7747EE] text-[#7747EE] text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveShare} // USE NEW HANDLER
//                 className="px-6 py-2 rounded-full bg-[#7747EE] text-white text-sm"
//               >
//                 {/* DYNAMIC BUTTON TEXT */}
//                 {editingShareIndex !== null ? "Update" : "Add"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CampaignDetails;
