import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";
import StepHeader from "../StepReusable/Stepheader";

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

  // Loading states for buttons
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

  // 2. Initialize Data (Edit Mode or Draft)
  useEffect(() => {
    const initData = async () => {
      // CASE A: Edit Mode - Fetch from API
      if (isEditMode && campaignId) {
        setFetchingDetails(true);
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const d = res.data?.discount || {};

          // Extract existing selections
          const netIds = (d.discount_card_networks || []).map((n) => n.id || n.card_network_id);
          const typeIds = (d.discount_card_types || []).map((t) => t.id || t.card_type_id);

          setSelectedNetworkIds(netIds);
          setSelectedTypeIds(typeIds);

          // Sync to parent
          onUpdate({
            discount_card_networks: d.discount_card_networks || [],
            discount_card_types: d.discount_card_types || []
          });

        } catch (error) {
          console.error("Error fetching campaign details:", error);
        } finally {
          setFetchingDetails(false);
        }
      }
      // CASE B: Create Mode - Load from Props (Draft)
      else if (!isEditMode && data) {
        if (data.discount_card_networks) setSelectedNetworkIds(data.discount_card_networks);
        if (data.discount_card_types) setSelectedTypeIds(data.discount_card_types);
      }
    };
    initData();
  }, [isEditMode, campaignId]);

  // 3. Toggle Handlers
  const toggleNetwork = (id) => {
    const newSelection = selectedNetworkIds.includes(id)
      ? selectedNetworkIds.filter((i) => i !== id)
      : [...selectedNetworkIds, id];

    setSelectedNetworkIds(newSelection);
    onUpdate({ discount_card_networks: newSelection, discount_card_types: selectedTypeIds });
  };

  const toggleType = (id) => {
    const newSelection = selectedTypeIds.includes(id)
      ? selectedTypeIds.filter((i) => i !== id)
      : [...selectedTypeIds, id];

    setSelectedTypeIds(newSelection);
    onUpdate({ discount_card_networks: selectedNetworkIds, discount_card_types: newSelection });
  };

  // 4. Submit Handler (Update / Next)
  const handleSubmit = async (action) => {
    if (action === "update") setIsUpdateSubmitting(true);
    else setIsNextSubmitting(true);

    try {
      // Prepare Payload
      const apiBody = {
        discount: {
          discount_card_networks: selectedNetworkIds,
          discount_card_types: selectedTypeIds,
        },
      };

      const shouldCallApi = action === "update" || (!isEditMode && action === "next");

      if (shouldCallApi) {
        if (!campaignId) throw new Error("Missing Campaign ID");
        
        await campaignDiscountApi.update(campaignId, apiBody);

        if (action === "update") {
          if (onRefresh) await onRefresh();
        }
      }

      // Navigation
      if (action === "next") onNext();

    } catch (error) {
      console.error("❌ Error saving Card configuration:", error);
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };

  // 5. Render Loading State
  if (fetchingDetails) {
    return (
      <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
        <span className="text-gray-400 text-sm">Fetching existing configuration...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans relative">

      {/* ---------------- MIDDLE SCROLLABLE AREA ---------------- */}
      <div className="flex-1 overflow-y-auto hide-scroll p-4 bg-gray-50/30">

        {/* Header */}
              <StepHeader step={8} totalSteps={9} title="Card Configuration" />

        {/* Content */}
        {loadingMeta ? (
          <div className="flex flex-col items-center justify-center h-80">
            <Loader2 className="w-10 h-10 animate-spin text-[#7B3FE4] mb-3" />
            <span className="text-gray-400 text-sm font-medium">Loading card data...</span>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Section 1: Card Networks */}
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
                        ${isAnySubmitting ? "opacity-50 pointer-events-none" : ""}
                      `}
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

            {/* Section 2: Card Types */}
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
                        ${isAnySubmitting ? "opacity-50 pointer-events-none" : ""}
                      `}
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

      {/* ---------------- FIXED FOOTER ---------------- */}
      <div className="bg-white border-t border-gray-200 z-10 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between px-6 py-4">

          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={isAnySubmitting}
            className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </button>

          <div className="flex gap-3 items-center">
            {isEditMode && (
              <button
                onClick={() => handleSubmit("update")}
                disabled={isAnySubmitting}
                className="px-4 py-[5px] bg-green-600 hover:bg-green-700 text-white rounded-[5px] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 disabled:opacity-70 transition-colors"
              >
                {isUpdateSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isUpdateSubmitting ? "Updating..." : "Update"}
              </button>
            )}

            <button
              onClick={() => handleSubmit("next")}
              disabled={isAnySubmitting || loadingMeta}
              className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center hover:bg-[#5558dd] transition-colors disabled:opacity-70"
            >
              {isNextSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isNextSubmitting ? "Saving..." : "Next →"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isAnySubmitting && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4]" />
        </div>
      )}
    </div>
  );
}