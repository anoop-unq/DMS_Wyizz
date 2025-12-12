import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Pagination from "../Components/Pagination";
import { metadataApi, campaignDiscountApi } from "../utils/metadataApi";

export default function MCCSelection({
  data,
  onUpdate,
  onNext,
  onPrevious,
  campaignId,
  isEditMode,
  onRefresh,
}) {
  const [mccList, setMccList] = useState([]);
  const [loadingMccs, setLoadingMccs] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Separate loading states to show spinner on specific buttons
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

  const [selectedMccIds, setSelectedMccIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalItems, setTotalItems] = useState(0);

  // ------------------------------------------------------------------
  // 1. Fetch Metadata (The MCC Grid List)
  // ------------------------------------------------------------------
  const fetchMccs = async (page) => {
    setLoadingMccs(true);
    try {
      const skip = (page - 1) * itemsPerPage;
      const response = await metadataApi.getMccs({ skip: skip });

      if (response.data) {
        setMccList(response.data.rows || []);
        setTotalItems(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching MCCs:", error);
    } finally {
      setLoadingMccs(false);
    }
  };

  useEffect(() => {
    fetchMccs(currentPage);
  }, [currentPage]);

  // ------------------------------------------------------------------
  // 2. Initialize Data
  // ------------------------------------------------------------------
  useEffect(() => {
    const initData = async () => {
      // CASE A: EDIT MODE - Ignore props, fetch from API
      if (isEditMode && campaignId) {
        setFetchingDetails(true);
        try {
          const response = await campaignDiscountApi.getById(campaignId);
          const discountData = response.data?.discount || {};

          if (
            discountData.discount_mccs &&
            Array.isArray(discountData.discount_mccs)
          ) {
            const ids = discountData.discount_mccs.map((item) => item.mcc_id);
            setSelectedMccIds(ids);

            // Sync to parent for Summary View
            onUpdate({ discount_mccs: discountData.discount_mccs });
          } else {
            setSelectedMccIds([]);
          }
        } catch (error) {
          console.error("Error fetching campaign details:", error);
        } finally {
          setFetchingDetails(false);
        }
      }
      // CASE B: CREATE MODE - Use props (Local Storage/Draft)
      else if (!isEditMode && data && data.discount_mccs) {
        const ids = data.discount_mccs.map((item) => item.mcc_id);
        setSelectedMccIds(ids);
      }
    };

    initData();
  }, [isEditMode, campaignId]);

  // ------------------------------------------------------------------
  // 3. Handle Toggle
  // ------------------------------------------------------------------
  const toggleSelection = (mcc) => {
    let newSelectedIds;
    if (selectedMccIds.includes(mcc.id)) {
      newSelectedIds = selectedMccIds.filter((id) => id !== mcc.id);
    } else {
      newSelectedIds = [...selectedMccIds, mcc.id];
    }

    setSelectedMccIds(newSelectedIds);

    // Format for payload AND for Final Summary
    const payloadFormat = newSelectedIds.map((id) => ({
      mcc_id: id,
      mcc_group_id: null,
    }));

    onUpdate({ discount_mccs: payloadFormat });
  };

  // ------------------------------------------------------------------
  // 4. Handle Submit (Logic modified as per request)
  // ------------------------------------------------------------------
  const handleSubmit = async (action) => {
    // 1. Set specific loading state
    if (action === "update") setIsUpdateSubmitting(true);
    else setIsNextSubmitting(true);

    try {
      // 2. Prepare Payload
      const formattedMccs = selectedMccIds.map((id) => ({
        mcc_id: id,
        mcc_group_id: null,
      }));

      // Update parent one last time to ensure state is fresh
      onUpdate({ discount_mccs: formattedMccs });

      const apiBody = {
        discount: {
          discount_mccs: formattedMccs,
        },
      };

      // 3. Determine if we need to call the API
      // - If clicking "Update" -> ALWAYS Call API
      // - If clicking "Next" AND NOT in Edit Mode -> Call API (to save draft)
      // - If clicking "Next" AND IN Edit Mode -> DO NOT Call API (just nav)
      const shouldCallApi =
        action === "update" || (!isEditMode && action === "next");

      if (shouldCallApi) {
        if (!campaignId) throw new Error("Missing Campaign ID");

        console.log(
          `📤 PUT Payload to ID ${campaignId}:`,
          JSON.stringify(apiBody, null, 2)
        );
        await campaignDiscountApi.update(campaignId, apiBody);

        if (action === "update") {
          if (onRefresh) await onRefresh();
          console.log("✅ Step 6 Updated");
          // You can add a toast success message here
        }
      }

      // 4. Handle Navigation
      if (action === "next") {
        onNext();
      }
    } catch (error) {
      console.error("❌ Error saving MCC configuration:", error);
      alert("Failed to save configuration.");
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };

  // ------------------------------------------------------------------
  // 5. Render
  // ------------------------------------------------------------------

  if (fetchingDetails) {
    return (
      <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
        <span className="text-gray-400 text-sm">
          Fetching existing configuration...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans relative">
      {/* SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto hide-scroll p-4 bg-gray-50/30">
        {/* Header */}

        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-3 items-center">
            <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-[#EFEFFD] text-[#7747EE] text-xs">
              6
            </span>
            <h3 className="card-inside-head">Mcc Selection</h3>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
            Step 6 of 7
          </div>

          
        </div>

        {/* LOADING GRID */}

      
        {loadingMccs ? (
          <div className="flex flex-col items-center justify-center h-80">
            <Loader2 className="w-10 h-10 animate-spin text-[#7B3FE4] mb-3" />
            <span className="text-gray-400 text-sm font-medium">
              Loading codes...
            </span>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mccList.map((mcc) => {
              const isSelected = selectedMccIds.includes(mcc.id);

              return (
                <div
                  key={mcc.id}
                  onClick={() => !isAnySubmitting && toggleSelection(mcc)}
                  className={`
                    relative group cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden flex flex-col
                    ${
                      isSelected
                        ? "border-[#E2E8F0] shadow-md"
                        : "border-gray-200 bg-white"
                    }
                    ${isAnySubmitting ? "opacity-50 pointer-events-none" : ""}
                  `}
                >
                  {/* HEADER */}
                  <div
                    className={`
                    p-3 flex justify-between items-start
                    ${
                      isSelected
                        ? "border-b border-purple-100"
                        : "border-b border-gray-100 bg-gray-50/50"
                    }
                  `}
                  >
                    <div className="flex-1 pr-2">
                      {/* Category Box */}
                      <div className="mb-3">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 block">
                          Category
                        </span>
                        <div
                          className={`
                             text-[13px] font-bold p-2 rounded-md border bg-white leading-tight
                             ${
                               isSelected
                                 ? "border-purple-200 text-[#7B3FE4] shadow-sm"
                                 : "border-gray-200 text-gray-800"
                             }
                           `}
                        >
                          {mcc.category}
                        </div>
                      </div>

                      {/* Subcategory Box */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 block">
                          Sub Category
                        </span>
                        <div
                          className={`
                             text-[11px] font-medium px-2 py-1.5 rounded-md border bg-white
                             ${
                               isSelected
                                 ? "border-purple-200 text-[#7B3FE4] shadow-sm"
                                 : "border-gray-200 text-gray-600"
                             }
                           `}
                        >
                          {mcc.subcategory}
                        </div>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div
                      className={`
                        min-w-[20px] h-5 rounded flex items-center justify-center border transition-all mt-1 ml-2
                        ${
                          isSelected
                            ? "bg-[#7B3FE4] border-[#7B3FE4] shadow-sm"
                            : "bg-white border-gray-300"
                        }
                    `}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* BODY */}
                  <div
                    className={`
                    p-3 flex flex-col gap-3 flex-1 
                    ${isSelected ? "bg-purple-50/30" : "bg-white"}
                  `}
                  >
                    {/* MCC Code Badge */}
                    <div>
                      <span
                        className={`
                        inline-flex items-center justify-center px-3 py-1 rounded-md text-[12px] font-bold shadow-sm transition-colors
                        ${
                          isSelected
                            ? "bg-[#7B3FE4] text-white"
                            : "bg-slate-800 text-white"
                        }
                      `}
                      >
                        {mcc.code}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="mt-0">
                      <span className="text-[10px] uppercase font-semi-bold text-gray-400 tracking-wider mb-0.5 block">
                        Description
                      </span>
                      <p className="text-xs leading-relaxed line-clamp-2 text-gray-500">
                        {mcc.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

             <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex justify-between items-center">
    
    {/* PREVIOUS BUTTON */}
    <button
      onClick={onPrevious}
      disabled={isAnySubmitting}
      className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 disabled:opacity-50 hover:bg-gray-50 transition-colors"
    >
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
    </button>

    <div className="flex gap-3 items-center">
      
      {/* SELECTION BADGE */}
      <div className="bg-purple-50 border border-purple-100 px-3 py-1 rounded-[5px] text-[12px] font-medium text-purple-700 shadow-sm whitespace-nowrap">
        {selectedMccIds.length} MCCs Selected
      </div>

      {/* UPDATE BUTTON (Edit Mode Only) */}
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

      {/* NEXT BUTTON */}
      <button
        onClick={() => handleSubmit("next")}
        disabled={isAnySubmitting || loadingMccs}
        className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center hover:bg-[#5558dd] transition-colors disabled:opacity-70"
      >
        {isNextSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isNextSubmitting ? "Saving..." : "Next →"}
      </button>
    </div>
  </div>
      </div>

    

      {/* FOOTER */}
     <div className="bg-white border-t border-gray-200 z-10 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
  
  {/* BUTTON TOOLBAR */}
 

  {/* PAGINATION SECTION */}
  <div className="w-full bg-gray-50/50">
    <Pagination
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={(page) => !isAnySubmitting && setCurrentPage(page)}
    />
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
