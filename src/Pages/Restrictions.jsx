import React, { useEffect, useMemo, useState, useRef } from "react";
import { metadataApi, campaignDiscountApi, campaignApi } from "../utils/metadataApi"; 
import { Trash2, Loader2 } from "lucide-react"; 

// ==============================================================================
// 1. MERCHANT CARD (Unchanged)
// ==============================================================================
const MerchantCard = ({
  merchant,
  isSelected,
  termsSelected,
  onToggleMID,
  onToggleTerminal,
  onToggleAllTerminals,
}) => {
  const [termSearch, setTermSearch] = useState("");

  const filteredTerminals = useMemo(() => {
    if (!termSearch) return merchant.terminals;
    return merchant.terminals.filter(
      (t) =>
        t.label.toLowerCase().includes(termSearch.toLowerCase()) ||
        String(t.id).includes(termSearch)
    );
  }, [merchant.terminals, termSearch]);

  const allTerminalsSelected =
    termsSelected.length === merchant.terminals.length &&
    merchant.terminals.length > 0;

  return (
    <div
      className={`rounded-lg p-3 transition-all h-fit ${
        isSelected
          ? "border-2 border-[#7747EE] bg-[#FBF7FF]"
          : "border border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#7747EE] text-white font-bold text-sm flex-shrink-0">
            {merchant.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm text-gray-900 leading-tight truncate">
              {merchant.name}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">
              {merchant.mid}
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-[#FA680D] text-white">
              {merchant.category || "General"}
            </span>
          </div>
        </div>
        <div
          className="cursor-pointer flex items-center p-1"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMID(merchant.id);
          }}
        >
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              isSelected
                ? "border-[#7747EE] bg-[#7747EE]"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-3">
          <div className="flex items-center justify-between border-b border-[#DEDEDE] pb-2 mb-3">
            <span className="text-sm text-black font-normal">Terminal ID</span>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onToggleAllTerminals(merchant.id, !allTerminalsSelected);
              }}
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  allTerminalsSelected
                    ? "border-[#7747EE] bg-[#7747EE]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {allTerminalsSelected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700">All</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search Terminal ID..."
            value={termSearch}
            onChange={(e) => setTermSearch(e.target.value)}
            className="w-full h-9 px-3 mb-3 border border-[#7747EE] border-opacity-30 rounded-md text-sm focus:outline-none focus:border-[#7747EE] bg-white placeholder-gray-400"
          />

          <div className="space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
            {filteredTerminals.length > 0 ? (
              filteredTerminals.map((t) => {
                const isTermSelected = termsSelected.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 cursor-pointer select-none hover:bg-gray-50 p-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTerminal(merchant.id, t.id);
                    }}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 border-[#7747EE] bg-white`}
                    >
                      {isTermSelected && (
                        <svg
                          className="w-3 h-3 text-[#7747EE]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                      {t.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 text-center py-2">
                No terminals found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// 2. COMPANY BLOCK (Unchanged)
// ==============================================================================
const CompanyBlock = ({
  companyId,
  companyName,
  merchants,
  selectedMIDs,
  perMerchantTerminals,
  onToggleMID,
  onToggleTerminal,
  onToggleAllTerminals,
  onRemoveBlock,
  fetchMerchants,
}) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("A-z");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (merchants.length === 0 && !loading) {
      setLoading(true);
      fetchMerchants(companyId).finally(() => setLoading(false));
    }
  }, [companyId, merchants.length]);

  const filteredList = useMemo(() => {
    let list = merchants.filter((m) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !m.name.toLowerCase().includes(q) &&
          !m.mid.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    if (sort === "A-z") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Newest") list.sort((a, b) => b.id - a.id);
    else if (sort === "Oldest") list.sort((a, b) => a.id - b.id);
    return list;
  }, [merchants, query, category, sort]);

  const handleSelectAllMids = () =>
    onToggleMID(
      filteredList.map((m) => m.id),
      true
    );
  const handleResetMids = () =>
    onToggleMID(
      merchants.map((m) => m.id),
      false
    );

  return (
    <div className="bg-white border border-[#E9EDF2] rounded-md p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md font-bold text-[#7747EE]">{companyName}</h2>
        <button
          onClick={() => onRemoveBlock(companyId)}
          className="w-5 h-5 rounded-full bg-[#7747EE] text-white flex items-center justify-center hover:bg-[#6B3CD6] text-xs"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-[12px] text-gray-600 mb-1 block">
            Search Brand / ID
          </label>
          <input
            type="text"
            placeholder="e.g. 101 or Nike"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-[38px] px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7747EE]"
          />
        </div>
        <div>
          <label className="text-[12px] text-gray-600 mb-1 block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-[38px] px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7747EE] bg-white"
          >
            <option value="">All Categories</option>
            <option value="Retail">Retail</option>
            <option value="Food">Food</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] text-gray-600 mb-1 block">Filters</label>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 h-[38px] px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7747EE] bg-white"
            >
              <option value="A-z">A-z</option>
              <option value="Newest">Newest</option>
            </select>
            <button
              onClick={handleSelectAllMids}
              className="h-[38px] px-3 border border-gray-300 rounded-md text-xs bg-white hover:bg-gray-50 text-gray-700"
            >
              All
            </button>
            <button
              onClick={handleResetMids}
              className="h-[38px] px-3 border border-gray-300 rounded-md text-xs bg-white hover:bg-gray-50 text-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-3">
        <span>Total Brands: {merchants.length}</span>
        <span>{filteredList.length} displayed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto pr-2 border-t border-gray-100 pt-4 custom-scrollbar">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
            <div className="w-6 h-6 border-2 border-[#7747EE] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Fetching Brands & Terminals...</span>
          </div>
        ) : filteredList.length > 0 ? (
          filteredList.map((m) => (
            <MerchantCard
              key={m.id}
              merchant={m}
              isSelected={selectedMIDs.has(m.id)}
              termsSelected={perMerchantTerminals[m.id] || []}
              onToggleMID={onToggleMID}
              onToggleTerminal={onToggleTerminal}
              onToggleAllTerminals={onToggleAllTerminals}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-4 text-gray-400 text-sm">
            No brands found for this company
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================================================================
// 3. MAIN CONTAINER (Restrictions.js)
// ==============================================================================
export default function Restrictions({
  data = {},
  onUpdate = () => {},
  onNext = () => {},
  onPrevious = () => {},
  campaignId, // ✅ ID passed from Step 1
  isEditMode, 
  onRefresh // ✅ Receive refresh function
}) {
  const [allCompanies, setAllCompanies] = useState([]);
  const [allMerchants, setAllMerchants] = useState([]);

  // UI State
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [selectedMIDs, setSelectedMIDs] = useState(new Set());
  const [perMerchantTerminals, setPerMerchantTerminals] = useState({});
  
  // Loading states
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const isFormDisabled = isUpdateSubmitting || isNextSubmitting || isLoadingData; 
  const isFirstRun = useRef(true);
  
  // --- HELPERS ---

  const mapApiDataToState = async (discountData) => {
      const restrictions = discountData.mid_restrictions || discountData.discount_mids || [];
      
      const newSelectedMIDs = new Set();
      const newPerMerchantTerminals = {};

      restrictions.forEach(midRestriction => {
          newSelectedMIDs.add(midRestriction.brand_id);
          if (midRestriction.discount_tids && midRestriction.discount_tids.length > 0) {
              newPerMerchantTerminals[midRestriction.brand_id] = midRestriction.discount_tids.map(t => t.terminal_id);
          }
      });
      
      const initialSelectedCompanyIds = data.selectedCompanies || [];
      
      if (initialSelectedCompanyIds.length > 0) {
          await Promise.all(initialSelectedCompanyIds.map(id => fetchMerchantsForCompany(id)));
      }
      
      setSelectedCompanies(initialSelectedCompanyIds);
      setSelectedMIDs(newSelectedMIDs);
      setPerMerchantTerminals(newPerMerchantTerminals);
      
      onUpdate({
          selectedCompanies: initialSelectedCompanyIds,
          selectedMIDs: Array.from(newSelectedMIDs),
          perMerchantTerminals: newPerMerchantTerminals,
      });
  };

  // --- API CALLS ---

  // 1. Load Companies from API on Mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await metadataApi.getCompanies();
        const list = res.data?.rows || res.data || [];
        setAllCompanies(list);
      } catch (err) {
        console.error("Error loading companies", err);
      }
    };
    loadCompanies();
  }, []);

  // 2. Fetch Brands & Terminals
  const fetchMerchantsForCompany = async (companyId) => {
    try {
      const id = typeof companyId === 'object' ? companyId.id : companyId;
      const brandRes = await metadataApi.getBrands(id); 
      const brands = brandRes.data?.rows || brandRes.data || [];

      const brandsWithTerminals = await Promise.all(
        brands.map(async (brand) => {
          try {
            const termRes = await metadataApi.getTerminals(brand.id);
            const terminals = termRes.data?.rows || termRes.data || [];

            return {
              id: brand.id,
              name: brand.name,
              companyId: id, 
              mid: brand.mid || `ID: ${brand.id}`,
              category: brand.category || "General",
              terminals: terminals.map((t) => ({
                id: t.id,
                label: t.identifier || `Term ${t.id}`,
              })),
            };
          } catch (e) {
            console.error("Error fetching terminals for brand", brand.id);
            return brand;
          }
        })
      );

      setAllMerchants((prev) => {
        const others = prev.filter((m) => m.companyId !== id);
        return [...others, ...brandsWithTerminals];
      });
    } catch (err) {
      console.error("Error loading brands", err);
    }
  };

  // 3. Load Existing Data
  useEffect(() => {
    if (data && isFirstRun.current) {
        if (data.selectedCompanies) {
          const companyIds = data.selectedCompanies.map(c => {
            if (typeof c === 'object' && c !== null) return c.id || c.value || c.companyId;
            return c;
          }).filter(id => id !== undefined);
          setSelectedCompanies(companyIds);
        }
        if (data.selectedMIDs) setSelectedMIDs(new Set(data.selectedMIDs));
        if (data.perMerchantTerminals) setPerMerchantTerminals(data.perMerchantTerminals);
        isFirstRun.current = false;
    }

    if (campaignId && allCompanies.length > 0) {
        console.log(`⏳ Step 4: Loading Data for Campaign ID: ${campaignId}`);
        setIsLoadingData(true); 
        
        const fetchDiscountData = async () => {
            try {
                const res = await campaignDiscountApi.getById(campaignId);
                const d = res.data?.discount || {};
                
                const hasData = (d.mid_restrictions && d.mid_restrictions.length > 0) || 
                                (d.discount_mids && d.discount_mids.length > 0);

                if (hasData) {
                    await mapApiDataToState(d);
                }
            } catch (err) {
                console.error("Failed to load Step 4 data:", err);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchDiscountData();
    }
  }, [campaignId, allCompanies.length]);

  // 4. Final Data Submission
  const handleNextSubmit = async (action) => {
    
    // Logic: 
    // - Edit Mode: Only call API on 'update'. 'next' just navigates.
    // - Create Mode: 'next' calls API to save progress.

    let shouldCallApi = true;
    if (isEditMode && action === 'next') {
        shouldCallApi = false;
    }

    if (shouldCallApi) {
        if (action === 'update') setIsUpdateSubmitting(true);
        else setIsNextSubmitting(true);
    }

    // ✅ CONSTRUCT PAYLOAD
    const getFinalPayload = () => {
        return Array.from(selectedMIDs).map((brandId) => {
            const selectedTerms = perMerchantTerminals[brandId] || [];
            const merchant = allMerchants.find((m) => m.id === brandId);
            const totalTerms = merchant?.terminals?.length || 0;
            
            // "All" is true if ALL checked OR NONE checked (default to all)
            const isAll = (selectedTerms.length === totalTerms && totalTerms > 0) || selectedTerms.length === 0;

            return {
                brand_id: brandId,
                all_tids: isAll,
                // ✅ FIX: Send selectedTerms even if isAll is true, so backend receives the IDs
                discount_tids: selectedTerms.map((tid) => ({ terminal_id: tid }))
            };
        });
    };

    const finalPayload = getFinalPayload();

    // Sync parent state
    onUpdate({
      selectedCompanies,
      selectedMIDs: Array.from(selectedMIDs),
      perMerchantTerminals,
      finalMidRestrictions: finalPayload
    });
    
    try {
        if (shouldCallApi) {
            if (!campaignId) {
                throw new Error("Missing Campaign ID. Cannot update.");
            }
            
            // ✅ CONSTRUCT FINAL WRAPPED PAYLOAD
            const apiBody = {
                discount: {
                    discount_mids: finalPayload
                }
            };
            
            console.log(`✏️ PUT Payload to ID ${campaignId}:`, JSON.stringify(apiBody, null, 2));
            
            // ✅ STRICT PUT CALL
            await campaignDiscountApi.update(campaignId, apiBody);
            
            if (action === 'update') {
                console.log("✅ Step 4 Updated.");
                if (onRefresh) await onRefresh();
            }
        }

        if (action === 'next') {
            onNext();
        }

    } catch (err) {
        console.error("Error updating restrictions:", err);
        const errMsg = err.response?.data?.message || err.message;
        alert(`Failed to update restrictions. ${errMsg}`);
    } finally {
        if (action === 'update') setIsUpdateSubmitting(false);
        else setIsNextSubmitting(false);
    }
  };

  // ... (UI Handlers & Render - Unchanged) ...
  const toggleCompany = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((c) => c !== companyId)
        : [...prev, companyId]
    );
    setCompanyOpen(false);
    setCompanySearch("");
  };

  const removeCompanyBlock = (companyId) => {
    const idToRemove = typeof companyId === 'object' ? companyId.id : companyId;
    setSelectedCompanies((prev) => prev.filter((c) => {
      const cid = typeof c === 'object' ? c.id : c;
      return cid !== idToRemove;
    }));
  };
  
  const handleToggleMID = (idOrIds, forceState = null) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const currentSelectedSet = new Set(selectedMIDs);

    setSelectedMIDs((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => {
        if (forceState === true) next.add(id);
        else if (forceState === false) next.delete(id);
        else { 
          if (next.has(id)) next.delete(id); 
          else next.add(id); 
        }
      });
      return next;
    });

    setPerMerchantTerminals((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        const isSelected = currentSelectedSet.has(id);
        const shouldRemove = forceState === false || (forceState === null && isSelected);
        if (shouldRemove) delete next[id];
      });
      return next;
    });
  };

  const handleToggleTerminal = (midId, termId) => {
    setPerMerchantTerminals((prev) => {
      const current = prev[midId] || [];
      const updated = current.includes(termId) ? current.filter((t) => t !== termId) : [...current, termId];
      if (updated.length === 0) { const { [midId]: rm, ...rest } = prev; return rest; }
      return { ...prev, [midId]: updated };
    });
  };

  const handleToggleAllTerminals = (midId, checked) => {
    const merchant = allMerchants.find((m) => m.id === midId);
    if (!merchant) return;
    setPerMerchantTerminals((prev) => {
      if (checked) return { ...prev, [midId]: merchant.terminals.map((t) => t.id) };
      else { const { [midId]: rm, ...rest } = prev; return rest; }
    });
  };
  
  const companyListFiltered = allCompanies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );
  
  const getCompanyDisplayName = (companyId) => {
    const id = typeof companyId === 'object' ? companyId.id : companyId;
    const companyData = allCompanies.find((c) => c.id === id);
    return companyData ? companyData.name : `ID: ${id || 'N/A'}`;
  };

  const getCompanyIdForComparison = (companyItem) => {
    return typeof companyItem === 'object' ? companyItem.id : companyItem;
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm bg-[#F7F9FB] min-h-screen flex flex-col h-full">
      <div className="flex-shrink-0 mb-6 flex items-center gap-3">
        <span className="w-5 h-5 inline-flex items-center justify-center rounded-full" style={{ background: "#EFEFFD", color: "#7747EE", fontSize: 12 }}>4</span>
        <h3 className="card-inside-head">Campaign Restrictions</h3>
      </div>

      <div className="flex-shrink-0 bg-white border border-[#E2E8F0] rounded-md p-5 mb-8">
        <label className="text-sm text-gray-700 font-medium mb-2 block">Select Company <span className="text-red-500">*</span></label>
        <div className="flex items-start gap-3">
          <div className="relative company-selector flex-1">
            <button type="button" onClick={() => setCompanyOpen((s) => !s)} className="w-full flex items-center justify-between border border-[#E2E8F0] rounded p-2 bg-white text-sm min-h-[44px] h-auto" disabled={isFormDisabled}>
              <div className="flex items-center gap-2 flex-wrap overflow-y-auto max-h-[80px] w-full">
                {isFormDisabled && selectedCompanies.length > 0 ? (
                    <span className="text-gray-500 pl-1 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Fetching/Saving...
                    </span>
                ) : selectedCompanies.length > 0 ? (
                  selectedCompanies.map((cid) => {
                    const companyId = typeof cid === 'object' ? cid.id : cid;
                    const companyName = getCompanyDisplayName(companyId); 
                    return (
                      <span key={companyId} className="bg-[#7747EE] text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1 flex-shrink-0">
                        {companyName} 
                        <span onClick={(e) => { 
                          e.stopPropagation(); 
                          removeCompanyBlock(companyId); 
                        }} className="cursor-pointer hover:text-gray-200 font-bold ml-1">×</span>
                      </span>
                    );
                  })
                ) : <span className="text-gray-500 pl-1">Select company</span>}
              </div>
              <svg className={`w-4 h-4 text-gray-400 ml-2 transition-transform flex-shrink-0 ${companyOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
            </button>
            
            {companyOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-3">
                <input value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} placeholder="Search companies..." className="w-full mb-3 h-9 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#7747EE]" disabled={isFormDisabled} />
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {companyListFiltered.map((c) => (
                    <div key={c.id} className="flex items-center p-1 hover:bg-gray-50 cursor-pointer" onClick={() => toggleCompany(c.id)}>
                      <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-all flex-shrink-0 border-[#7747EE] bg-white`}>
                        {selectedCompanies.some(sc => getCompanyIdForComparison(sc) === c.id) && <svg className="w-3 h-3 text-[#7747EE]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-sm text-gray-700">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="bg-[#7747EE] text-white px-6 rounded text-sm font-medium hover:bg-[#6B3CD6] transition-colors h-[44px] shrink-0 disabled:opacity-70" onClick={() => setCompanyOpen(true)} disabled={isFormDisabled}>Add</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar space-y-6">
        {selectedCompanies.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">Please select a company to configure restrictions.</div>
        ) : (
          selectedCompanies.map(compId => {
            const companyId = getCompanyIdForComparison(compId);
            const companyName = getCompanyDisplayName(companyId);
            
            return (
              <CompanyBlock 
                key={companyId}
                companyId={companyId}
                companyName={companyName}
                merchants={allMerchants.filter(m => m.companyId === companyId)}
                selectedMIDs={selectedMIDs}
                perMerchantTerminals={perMerchantTerminals}
                onToggleMID={handleToggleMID}
                onToggleTerminal={handleToggleTerminal}
                onToggleAllTerminals={handleToggleAllTerminals}
                onRemoveBlock={removeCompanyBlock}
                fetchMerchants={fetchMerchantsForCompany}
              />
            );
          })
        )}
      </div>

      <div className="flex-shrink-0 mt-6 flex justify-between">
        <button onClick={onPrevious} className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled={isFormDisabled}>← Previous</button>
        <div className="flex gap-3">
            {isEditMode && (
                <button onClick={() => handleNextSubmit('update')} disabled={isFormDisabled} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium disabled:opacity-70 transition-colors">
                    {isUpdateSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isUpdateSubmitting ? "Updating..." : "Update"}
                </button>
            )}
            <button onClick={() => handleNextSubmit('next')} disabled={isFormDisabled} className="px-6 py-2 bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white rounded-md text-sm font-medium hover:from-[#6B3CD6] hover:to-[#8B4DE6] disabled:opacity-70">
                {isNextSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isNextSubmitting ? "Saving..." : "Next →"}
            </button>
        </div>
      </div>
    </div>
  );
}