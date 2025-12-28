// import React, { useState, useEffect } from "react";
// import { Loader2 } from "lucide-react";
// import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
// import StepHeader from "../StepReusable/Stepheader";
// import Swal from "sweetalert2";

// export default function CardNetworkType({
//   data,
//   onUpdate,
//   onNext,
//   onPrevious,
//   campaignId,
//   isEditMode,
//   onRefresh,
// }) {
//   const [networks, setNetworks] = useState([]);
//   const [types, setTypes] = useState([]);
//   const [loadingMeta, setLoadingMeta] = useState(false);
//   const [fetchingDetails, setFetchingDetails] = useState(false);

//   // Loading states for buttons
//   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
//   const [isNextSubmitting, setIsNextSubmitting] = useState(false);
//   const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

//   const [selectedNetworkIds, setSelectedNetworkIds] = useState([]);
//   const [selectedTypeIds, setSelectedTypeIds] = useState([]);

//   // 1. Fetch Metadata (Networks & Types)
//   useEffect(() => {
//     const fetchMetadata = async () => {
//       setLoadingMeta(true);
//       try {
//         const [netRes, typeRes] = await Promise.all([
//           metadataApi.getCardNetworks({ limit: 100 }),
//           metadataApi.getCardTypes({ limit: 100 }),
//         ]);
//         setNetworks(netRes.data?.rows || []);
//         setTypes(typeRes.data?.rows || []);
//       } catch (error) {
//         console.error("Error fetching card metadata:", error);
//       } finally {
//         setLoadingMeta(false);
//       }
//     };
//     fetchMetadata();
//   }, []);

//   // 2. Initialize Data (Edit Mode or Draft)
//   useEffect(() => {
//     const initData = async () => {
//       // CASE A: Edit Mode - Fetch from API
//       if (isEditMode && campaignId) {
//         setFetchingDetails(true);
//         try {
//           const res = await campaignDiscountApi.getById(campaignId);
//           const d = res.data?.discount || {};

//           // Extract existing selections
//           const netIds = (d.discount_card_networks || []).map((n) => n.id || n.card_network_id);
//           const typeIds = (d.discount_card_types || []).map((t) => t.id || t.card_type_id);

//           setSelectedNetworkIds(netIds);
//           setSelectedTypeIds(typeIds);

//           // Sync to parent
//           onUpdate({
//             discount_card_networks: d.discount_card_networks || [],
//             discount_card_types: d.discount_card_types || []
//           });

//         } catch (error) {
//           console.error("Error fetching campaign details:", error);
//         } finally {
//           setFetchingDetails(false);
//         }
//       }
//       // CASE B: Create Mode - Load from Props (Draft)
//       else if (!isEditMode && data) {
//         if (data.discount_card_networks) setSelectedNetworkIds(data.discount_card_networks);
//         if (data.discount_card_types) setSelectedTypeIds(data.discount_card_types);
//       }
//     };
//     initData();
//   }, [isEditMode, campaignId]);

//   // 3. Toggle Handlers
//   // const toggleNetwork = (id) => {
//   //   const newSelection = selectedNetworkIds.includes(id)
//   //     ? selectedNetworkIds.filter((i) => i !== id)
//   //     : [...selectedNetworkIds, id];

//   //   setSelectedNetworkIds(newSelection);
//   //   onUpdate({ discount_card_networks: newSelection, discount_card_types: selectedTypeIds });
//   // };

//   // const toggleType = (id) => {
//   //   const newSelection = selectedTypeIds.includes(id)
//   //     ? selectedTypeIds.filter((i) => i !== id)
//   //     : [...selectedTypeIds, id];

//   //   setSelectedTypeIds(newSelection);
//   //   onUpdate({ discount_card_networks: selectedNetworkIds, discount_card_types: newSelection });
//   // };

//   // --- Inside CardNetworkType.jsx ---

// // 3. Toggle Handlers
// const toggleNetwork = (id) => {
//   const newSelectionIds = selectedNetworkIds.includes(id)
//     ? selectedNetworkIds.filter((i) => i !== id)
//     : [...selectedNetworkIds, id];

//   setSelectedNetworkIds(newSelectionIds);

//   // Find names for the Summary UI
//   const formattedNetworks = newSelectionIds.map(netId => {
//     const found = networks.find(n => n.id === netId);
//     return { 
//       card_network_id: netId, 
//       card_network_name: found ? found.name : "Unknown" 
//     };
//   });

//   // Sync to parent: send full objects for UI, handle strict IDs in handleSubmit
//   onUpdate({ discount_card_networks: formattedNetworks });
// };

// const toggleType = (id) => {
//   const newSelectionIds = selectedTypeIds.includes(id)
//     ? selectedTypeIds.filter((i) => i !== id)
//     : [...selectedTypeIds, id];

//   setSelectedTypeIds(newSelectionIds);

//   // Find names for the Summary UI
//   const formattedTypes = newSelectionIds.map(typeId => {
//     const found = types.find(t => t.id === typeId);
//     return { 
//       card_type_id: typeId, 
//       card_type_name: found ? found.name : "Unknown" 
//     };
//   });

//   // Sync to parent
//   onUpdate({ discount_card_types: formattedTypes });
// };

//   // 4. Submit Handler (Update / Next)
// const handleSubmit = async (action) => {
//     // ✅ VALIDATION: Ensure at least one network and one type is selected
//     if (selectedNetworkIds.length === 0 || selectedTypeIds.length === 0) {
//       let missingItem = "";
//       if (selectedNetworkIds.length === 0 && selectedTypeIds.length === 0) {
//         missingItem = "at least one Card Network and one Card Type";
//       } else if (selectedNetworkIds.length === 0) {
//         missingItem = "at least one Card Network";
//       } else {
//         missingItem = "at least one Card Type";
//       }

//       return Swal.fire({
//         icon: "warning",
//         title: "Selection Required",
//         text: `Please select ${missingItem} to proceed.`,
//         background: "#FFFFFF",
//         confirmButtonColor: "#7747EE",
//       });
//     }

//     // Set loading states based on action
//     if (action === "update") setIsUpdateSubmitting(true);
//     else setIsNextSubmitting(true);

//     try {
//       // Prepare Payload
//       const apiBody = {
//         discount: {
//           discount_card_networks: selectedNetworkIds,
//           discount_card_types: selectedTypeIds,
//         },
//       };

//       const shouldCallApi = action === "update" || (!isEditMode && action === "next");

//       if (shouldCallApi) {
//         if (!campaignId) throw new Error("Missing Campaign ID");
        
//         await campaignDiscountApi.update(campaignId, apiBody);

//         // ✅ SUCCESS ALERT: Context-aware text
//         await Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text: action === "update" 
//             ? "Card configurations updated successfully." 
//             : "Card configurations saved successfully.",
//           background: "#FFFFFF",
//           color: "#1e293b",
//           confirmButtonColor: "#10B981",
//           timer: 2000,
//           showConfirmButton: false,
//         });

//         if (onRefresh) await onRefresh();
//       }

//       // Navigation to Step 9 (Summary)
//       if (action === "next") onNext();

//     } catch (error) {
//       console.error("❌ Error saving Card configuration:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.response?.data?.detail || "Failed to save configuration.",
//         background: "#FFFFFF",
//         confirmButtonColor: "#EF4444",
//       });
//     } finally {
//       setIsUpdateSubmitting(false);
//       setIsNextSubmitting(false);
//     }
//   };

//   // 5. Render Loading State
//   if (fetchingDetails) {
//     return (
//       <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
//         <span className="text-gray-400 text-sm">Fetching existing configuration...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans relative">

//       {/* ---------------- MIDDLE SCROLLABLE AREA ---------------- */}
//       <div className="flex-1 overflow-y-auto hide-scroll p-4 bg-gray-50/30">

//         {/* Header */}
//               <StepHeader step={8} totalSteps={9} title="Card Configuration" />

//         {/* Content */}
//         {loadingMeta ? (
//           <div className="flex flex-col items-center justify-center h-80">
//             <Loader2 className="w-10 h-10 animate-spin text-[#7B3FE4] mb-3" />
//             <span className="text-gray-400 text-sm font-medium">Loading card data...</span>
//           </div>
//         ) : (
//           <div className="space-y-8">

//             {/* Section 1: Card Networks */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Card Networks</h4>
//                 <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-medium">
//                   {selectedNetworkIds.length} Selected
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {networks.map((net) => {
//                   const isSel = selectedNetworkIds.includes(net.id);
//                   return (
//                     <div
//                       key={net.id}
//                       onClick={() => !isAnySubmitting && toggleNetwork(net.id)}
//                       className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-all duration-200
//                         ${isSel ? "border-[#7B3FE4] bg-purple-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}
//                         ${isAnySubmitting ? "opacity-50 pointer-events-none" : ""}
//                       `}
//                     >
//                       <div>
//                         <div className={`text-sm font-semibold ${isSel ? "text-[#7B3FE4]" : "text-gray-700"}`}>
//                           {net.name}
//                         </div>
//                         <div className="text-[10px] text-gray-500 mt-0.5 uppercase">{net.type}</div>
//                       </div>
//                       <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSel ? "bg-[#7B3FE4] border-[#7B3FE4]" : "bg-white border-gray-300"}`}>
//                         {isSel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Section 2: Card Types */}
//             <div>
//               <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
//                 <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mt-2">Card Types</h4>
//                 <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-medium mt-2">
//                   {selectedTypeIds.length} Selected
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {types.map((type) => {
//                   const isSel = selectedTypeIds.includes(type.id);
//                   return (
//                     <div
//                       key={type.id}
//                       onClick={() => !isAnySubmitting && toggleType(type.id)}
//                       className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-all duration-200
//                         ${isSel ? "border-[#7B3FE4] bg-purple-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}
//                         ${isAnySubmitting ? "opacity-50 pointer-events-none" : ""}
//                       `}
//                     >
//                       <div className={`text-sm font-semibold ${isSel ? "text-[#7B3FE4]" : "text-gray-700"}`}>
//                         {type.name}
//                       </div>
//                       <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSel ? "bg-[#7B3FE4] border-[#7B3FE4]" : "bg-white border-gray-300"}`}>
//                         {isSel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//           </div>
//         )}
//       </div>

//       {/* ---------------- FIXED FOOTER ---------------- */}
//     {/* ---------------- FIXED FOOTER ---------------- */}
//       <div className="bg-white border-t border-gray-200 z-10 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
//         <div className="flex items-center justify-between px-6 py-4">

//           {/* Previous Button */}
//           <button
//             onClick={onPrevious}
//             disabled={isAnySubmitting}
//             className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 disabled:opacity-50 hover:bg-gray-50 transition-colors"
//           >
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M15 18l-6-6 6-6" />
//             </svg>
//             Previous
//           </button>

//           <div className="flex gap-3 items-center">
//             {/* UPDATE BUTTON WITH SPIN */}
//             {isEditMode && (
//               <button
//                 onClick={() => handleSubmit("update")}
//                 disabled={isAnySubmitting}
//                 className="px-4 py-[5px] bg-green-600 hover:bg-green-700 text-white rounded-[5px] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
//               >
//                 {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {isUpdateSubmitting ? "Updating..." : "Update"}
//               </button>
//             )}

//             {/* NEXT BUTTON WITH SPIN */}
//             <button
//               onClick={() => handleSubmit("next")}
//               disabled={isAnySubmitting || loadingMeta}
//               className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center hover:bg-[#5558dd] transition-all shadow-md active:scale-95 disabled:opacity-70"
//             >
//               {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
//               {isNextSubmitting ? "Saving..." : "Next →"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Loading Overlay */}
    
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
import StepHeader from "../StepReusable/Stepheader";
import Swal from "sweetalert2";

export default function CardNetworkType({
  data,
  onUpdate,
  onNext,
  onPrevious,
  campaignId,
  isEditMode,
  onRefresh,
}) {
  const [networks, setNetworks] = useState([]);
  const [types, setTypes] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Button submission states
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

  const [selectedNetworkIds, setSelectedNetworkIds] = useState([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState([]);

  // 1. Fetch Metadata (Networks & Types)
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoadingMeta(true);
      try {
        const [netRes, typeRes] = await Promise.all([
          metadataApi.getCardNetworks({ limit: 100 }),
          metadataApi.getCardTypes({ limit: 100 }),
        ]);
        setNetworks(netRes.data?.rows || []);
        setTypes(typeRes.data?.rows || []);
      } catch (error) {
        console.error("Error fetching card metadata:", error);
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMetadata();
  }, []);

  // Helper to extract a strict ID from various possible object structures
  const extractId = (item, idKey) => {
    if (typeof item !== "object" || item === null) return item;
    // Handle nested structure: item.card_network_id.card_network_id
    if (item[idKey] && typeof item[idKey] === "object") return item[idKey][idKey];
    return item[idKey] || item.id;
  };

  // 2. Initialize Data
  useEffect(() => {
    const initData = async () => {
      // CASE A: Edit Mode - Fetch from API
      if (isEditMode && campaignId) {
        setFetchingDetails(true);
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const d = res.data?.discount || {};

          const netIds = (d.discount_card_networks || []).map((n) => extractId(n, "card_network_id"));
          const typeIds = (d.discount_card_types || []).map((t) => extractId(t, "card_type_id"));

          setSelectedNetworkIds(netIds);
          setSelectedTypeIds(typeIds);
          syncToParent(netIds, typeIds);
        } catch (error) {
          console.error("Error fetching details:", error);
        } finally {
          setFetchingDetails(false);
        }
      } 
      // CASE B: Create Mode - Use props
      else if (!isEditMode && data) {
        const netIds = (data.discount_card_networks || []).map(n => extractId(n, "card_network_id"));
        const typeIds = (data.discount_card_types || []).map(t => extractId(t, "card_type_id"));
        setSelectedNetworkIds(netIds);
        setSelectedTypeIds(typeIds);
      }
    };
    initData();
  }, [isEditMode, campaignId, networks, types]);

  // Sync to parent for Summary Step (Includes names)
  const syncToParent = (netIds, typeIds) => {
    const formattedNetworks = netIds.map(id => {
      const found = networks.find(n => n.id === id);
      return { card_network_id: id, card_network_name: found ? found.name : "Unknown" };
    });
    const formattedTypes = typeIds.map(id => {
      const found = types.find(t => t.id === id);
      return { card_type_id: id, card_type_name: found ? found.name : "Unknown" };
    });

    onUpdate({
      discount_card_networks: formattedNetworks,
      discount_card_types: formattedTypes
    });
  };

  // 3. Toggle Handlers
  const toggleNetwork = (id) => {
    const newSelection = selectedNetworkIds.includes(id)
      ? selectedNetworkIds.filter((i) => i !== id)
      : [...selectedNetworkIds, id];
    setSelectedNetworkIds(newSelection);
    syncToParent(newSelection, selectedTypeIds);
  };

  const toggleType = (id) => {
    const newSelection = selectedTypeIds.includes(id)
      ? selectedTypeIds.filter((i) => i !== id)
      : [...selectedTypeIds, id];
    setSelectedTypeIds(newSelection);
    syncToParent(selectedNetworkIds, newSelection);
  };

  // 4. Submit Handler (CLEAN PAYLOAD)
  const handleSubmit = async (action) => {
    // Validation
    if (selectedNetworkIds.length === 0 || selectedTypeIds.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select at least one Card Network and one Card Type.",
        background: "#FFFFFF",
        confirmButtonColor: "#7747EE",
      });
    }

    if (action === "update") setIsUpdateSubmitting(true);
    else setIsNextSubmitting(true);

    try {
      // ✅ Payload is guaranteed to be clean integer arrays
      const apiBody = {
        discount: {
          discount_card_networks: selectedNetworkIds,
          discount_card_types: selectedTypeIds,
        },
      };

      const shouldCallApi = action === "update" || (!isEditMode && action === "next");

      if (shouldCallApi && campaignId) {
        await campaignDiscountApi.update(campaignId, apiBody);

        if (action === "update") {
          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Card configurations updated successfully.",
            background: "#FFFFFF",
        
            timer: 2000,
                showConfirmButton: true, // Enables the confirmation button
          confirmButtonText: "OK", // Custom text for the button
          confirmButtonColor: "#6366F1",
          });
          if (onRefresh) await onRefresh();
        }
      }

      if (action === "next") onNext();
    } catch (error) {
      console.error("❌ Error saving configuration:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Failed to save configuration.",
        background: "#FFFFFF",
      });
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };

  if (fetchingDetails) {
    return (
      <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
        <span className="text-gray-400 text-sm">Fetching existing configuration...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto hide-scroll p-4 bg-gray-50/30">
        <StepHeader step={8} totalSteps={9} title="Card Configuration" />

        {loadingMeta ? (
          <div className="flex flex-col items-center justify-center h-80">
            <Loader2 className="w-10 h-10 animate-spin text-[#7B3FE4] mb-3" />
            <span className="text-gray-400 text-sm font-medium">Loading data...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Card Networks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Card Networks</h4>
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-medium">
                  {selectedNetworkIds.length} Selected
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {networks.map((net) => {
                  const isSel = selectedNetworkIds.includes(net.id);
                  return (
                    <div
                      key={net.id}
                      onClick={() => !isAnySubmitting && toggleNetwork(net.id)}
                      className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-all duration-200
                        ${isSel ? "border-[#7B3FE4] bg-purple-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}
                        ${isAnySubmitting ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div>
                        <div className={`text-sm font-semibold ${isSel ? "text-[#7B3FE4]" : "text-gray-700"}`}>
                          {net.name}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 uppercase">{net.type}</div>
                      </div>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSel ? "bg-[#7B3FE4] border-[#7B3FE4]" : "bg-white border-gray-300"}`}>
                        {isSel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card Types */}
            <div>
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mt-2">Card Types</h4>
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-medium mt-2">
                  {selectedTypeIds.length} Selected
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {types.map((type) => {
                  const isSel = selectedTypeIds.includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => !isAnySubmitting && toggleType(type.id)}
                      className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-all duration-200
                        ${isSel ? "border-[#7B3FE4] bg-purple-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}
                        ${isAnySubmitting ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div className={`text-sm font-semibold ${isSel ? "text-[#7B3FE4]" : "text-gray-700"}`}>
                        {type.name}
                      </div>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSel ? "bg-[#7B3FE4] border-[#7B3FE4]" : "bg-white border-gray-300"}`}>
                        {isSel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
        <button
          onClick={onPrevious}
          disabled={isAnySubmitting}
          className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] flex items-center gap-2 disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Previous
        </button>

        <div className="flex gap-3">
          {isEditMode && (
            <button
              onClick={() => handleSubmit("update")}
              disabled={isAnySubmitting}
              className="px-4 py-[5px] bg-green-600 hover:bg-green-700 text-white rounded-[5px] text-[14px] flex items-center gap-2 disabled:opacity-70"
            >
              {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdateSubmitting ? "Updating..." : "Update"}
            </button>
          )}

          <button
            onClick={() => handleSubmit("next")}
            disabled={isAnySubmitting || loadingMeta}
            className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] flex items-center justify-center hover:bg-[#5558dd] disabled:opacity-70"
          >
            {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isNextSubmitting ? "Saving..." : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}