
import React, { useState, useEffect } from "react";
import {
  Plus,
  Percent,
  Search as LucideSearch,
  Calendar,
  Box,
  Eye,
  Edit,
  Trash2,
  Filter,
  Loader2,
  X,
  Pause, 
  Play,   
  Coins, 
  Check, 
  Minus,
  CheckCircle2, XCircle, Globe,
  CombineIcon,
  Currency,
  Wallet,
  Landmark,
  CircleDollarSign,
  CircleDollarSignIcon
} from "lucide-react";

import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { campaignDiscountApi } from "../utils/metadataApi";
import CampaignForm from "./CampaignForm";
import Pagination from "../Components/Pagination";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext";

// ✅ CampaignCard Component with Optional Chaining
function CampaignCard({ c, onEdit, onDelete, onView, onPause, onResume, userType }) {
  const used = c?.budgetUsed || 0;
  const total = c?.totalBudget || 1;
  const percentUsed = Math.round(Math.min(100, (used / total) * 100));

  const isDiscountChecker = userType === "discountchecker";
  const isDiscountMaker = userType === "discountmaker";
  const isBank = userType === "bank";

  const canPauseResume = ["discountmaker", "bank", "admin"].includes(userType);
  const rawStatus = (c?.rawStatus || "").toLowerCase();

  let showDeleteButton = ["draft", "rejected"].includes(rawStatus);
  if (isDiscountChecker) showDeleteButton = false;

  let showEditButton = true;
  if (isDiscountMaker && !["draft", "rejected"].includes(rawStatus)) showEditButton = false;
  if (isBank && rawStatus === "submitted") showEditButton = false;
  if (isDiscountChecker) showEditButton = false;

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "active") return "bg-green-100 text-green-800";
    if (s === "approved") return "bg-green-100 text-green-800";
    if (s === "paused") return "bg-orange-100 text-orange-700";
    if (s === "inactive") return "bg-gray-100 text-gray-600";
    if (s === "submitted") return "bg-blue-500 text-white";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-[0_6px_18px_rgba(13,38,59,0.04)] w-full ">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-100 bg-green-50 text-green-700">
            <Percent size={15} />
          </div>
          <div>
            <h3 className="campaign-inside-head text-[15px] leading-tight">
              {c?.title}
            </h3>
            <div className="text-[10px] tracking-wide text-gray-700 mt-[2px]">
              {c?.type ? (c.type.charAt(0).toUpperCase() + c.type.slice(1).toLowerCase()) : "N/A"}
            </div>
          </div>
        </div>
        <div>
          <span
            className={`inline-block px-2 py-[2px] text-[11px] font-medium rounded-full ${getStatusColor(
              c?.status
            )}`}
          >
            {c?.status}
          </span>
        </div>
      </div>

      <p
        className="mt-3 card-inside-para text-[#7C3F44] truncate"
        style={{ lineHeight: "1.4", fontSize: "12px" }}
      >
        {c?.description || "No description provided."}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-y-2 text-[13px] text-[#7C3F44]">
        <div className="space-y-2">
           <div className="flex items-center justify-start gap-2">
            <img src={assets.sideCalendar} className="w-3.5 h-3.5 object-contain" alt="Calendar" />
                        <div className="font-medium">{c?.meta?.starts}</div>
          </div>
          <div className="flex items-center gap-2">
            <Coins size={14} className="text-green-500" />
            <div className="font-bold text-gray-800">{c?.baseCurrency}</div>
            <div className="flex items-center gap-1 ">
               {c?.isMultiCurrency ? (
                 <div className="flex items-center gap-1 bg-green-50 px-1 rounded text-[10px] text-green-600 border border-[#E2E8F0]">
                   <CheckCircle2 size={10} />
                   <span>Multi</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-1 bg-gray-50 px-1 rounded text-[10px] text-gray-400 border border-[#E2E8F0]">
                   <XCircle size={10} />
                   <span>Single</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-right">
          <div className="flex items-center justify-end gap-2">
            <img src={assets.sideCalendar} className="w-3.5 h-3.5 object-contain" alt="Calendar" />
            <div className="font-medium">{c?.meta?.ends}</div>

          </div>
          <div className="flex items-center justify-end gap-2">
            {c?.meta?.card && (
              <>
                <img src={assets.ColorCreditCard} className="w-3.5 h-3.5 object-contain" alt="card" />
                <div className="font-medium">
                  {c.meta.card.length > 10 ? `${c.meta.card.substring(0, 15)}...` : c.meta.card}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-[#8B5563]">Budget Used</div>
        <div className="text-[13px] font-medium text-[#8B5563]">
          ${used.toLocaleString()} / ${total.toLocaleString()}
        </div>
      </div>

      <div className="mt-1">
        <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${total > 0 ? (used / total) * 100 : 0}%`,
              background: "linear-gradient(90deg,#8b5cf6,#c084fc)",
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
          <div>
            {total > 0 ? Math.round((used / total) * 100) : 0} % Used
          </div>
          <div>
            {c?.transactions?.toLocaleString()} transaction{c?.transactions <= 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
        {isDiscountChecker ? (
          <button onClick={() => onView(c?.id)} className="w-[80px] h-[32px] rounded-[8px] bg-[#F0FDF4] text-[#16A34A] text-[12px] font-semibold flex items-center justify-center hover:bg-[#DCFCE7] transition-colors">
            View
          </button>
        ) : (
          <>
            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-[#7747EE] transition-colors" aria-label="view" onClick={() => onView(c?.id)}>
              <Eye size={15} />
            </button>
            {showEditButton && (
              <button className="p-1.5 rounded-md hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" aria-label="edit" onClick={() => onEdit(c?.id)}>
                <Edit size={15} />
              </button>
            )}
            {canPauseResume && rawStatus === "approved" && (
              <button className="p-1.5 rounded-md hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors" onClick={() => onPause(c?.id)} title="Pause Campaign">
                <Pause size={15} />
              </button>
            )}
            {canPauseResume && rawStatus === "paused" && (
              <button className="p-1.5 rounded-md hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors" onClick={() => onResume(c?.id)} title="Resume Campaign">
                <Play size={15} />
              </button>
            )}
            {showDeleteButton && (
              <button className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" aria-label="delete" onClick={() => onDelete(c?.id)}>
                <Trash2 size={15} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useAuthContext();

  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState(0); 
  const [apiStatusCounts, setApiStatusCounts] = useState([]);

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isStep1Completed, setIsStep1Completed] = useState(false);

  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const LOCAL_STORAGE_KEY = "campaignFormData";
  const isDiscountChecker = userType === "discountchecker";
  const showNewCampaignButton = !isDiscountChecker;

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const apiParams = { limit: itemsPerPage, skip: skip, sort: "id", direction: "desc" };

      if (selectedStatusId !== 0) apiParams.status = selectedStatusId;
      if (searchKeyword.trim() !== "") {
        apiParams.Name = searchKeyword;
        apiParams.description = searchKeyword;
      }

      const res = await campaignDiscountApi.getAll(apiParams);
      const responseData = res?.data || {};
      const rows = responseData?.rows || [];
      const total = responseData?.total || 0;
      
      setTotalItems(total);

      // if (responseData?.status_counts) {
      //   setApiStatusCounts(responseData.status_counts);
      // }


      if (responseData?.status_counts) {
  let counts = [...responseData.status_counts];
  
  // Check if "Pending Delete" (case insensitive) exists in the API response
  const hasPendingDelete = counts.some(
    (item) => item?.name?.toLowerCase() === "pending delete"
  );

  // If not found, manually push it with count 0
  // Note: Check with your backend what the actual ID for "Pending Delete" is. 
  // I've used 'pending_delete' as a placeholder ID.
  if (!hasPendingDelete) {
    counts.push({
      id: "pending_delete", 
      name: "Pending Delete",
      count: 0
    });
  }

  setApiStatusCounts(counts);
}

      const mappedData = rows.map((item, index) => {
        const c = item?.campaign || {};
        const d = item?.discount || {}; 
        let realCardInfo = "";
        if (d?.discount_card_types?.length > 0) {
          realCardInfo = d.discount_card_types.map((t) => t.card_type_name).join(", ");
        } else if (d?.discount_card_networks?.length > 0) {
          realCardInfo = d.discount_card_networks.map((n) => n.card_network_name).join(", ");
        }

        return {
          id: c?.id || `temp-${index}`,
          title: c?.name || "",
          type: (c?.type || "").toUpperCase(),
          description: c?.description || "",
          status: c?.status_name || "Unknown", 
          rawStatus: c?.status_name, 
          budgetUsed: c?.budget_used || 0,
          totalBudget: c?.total_budget || 1,
          transactions: c?.transactions_count || 0,
          baseCurrency: c?.base_currency_code || "N/A",
          isMultiCurrency: c?.is_multi_currency || false,
          meta: {
            merchant: c?.company_name || c?.bank_name || "",
            card: realCardInfo,
            starts: c?.start_date ? new Date(c.start_date).toLocaleDateString() : "",  
            ends: c?.end_date ? new Date(c.end_date).toLocaleDateString() : ""
          },
        };
      });
      setCampaigns(mappedData);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage, searchKeyword, selectedStatusId]);

  // ✅ 1. ENTRY LOGIC: Only trigger resume popup if a campaign ID was generated
  const handleNewCampaignClick = () => {
    const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw);
        // Only show popup if Step 1 was confirmed (Campaign has a persistent ID)
        if (parsed?.step1?.id) {
          Swal.fire({
            title: "Draft Found",
            text: "You have an initialized campaign draft. Would you like to resume it or start a fresh one?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#7747EE",
            cancelButtonColor: "#EF4444",
            confirmButtonText: "Resume Draft",
            cancelButtonText: "Start Fresh",
            background: "#FFFFFF",
          }).then((result) => {
            if (result.isConfirmed) {
              setEditingCampaign(null);
              setIsStep1Completed(true); // Since ID exists, session is considered in-progress
              setShowForm(true);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              localStorage.removeItem(LOCAL_STORAGE_KEY); // Explicit start fresh
              setEditingCampaign(null);
              setIsStep1Completed(false);
              setShowForm(true);
            }
          });
          return;
        }
      } catch (e) { console.error(e); }
    }
    
    // No valid draft with ID: Silently open form (typed data remains if Step 1 not finished)
    setEditingCampaign(null);
    setIsStep1Completed(false);
    setShowForm(true);
  };

  // ✅ 2. EXIT LOGIC: Popup ONLY if Step 1 complete. Clear storage ONLY if "Close" clicked in popup.
  const handleFormClose = (needsRefresh = false) => {
    if (needsRefresh) {
      if (!editingCampaign) localStorage.removeItem(LOCAL_STORAGE_KEY);
      setShowForm(false);
      setEditingCampaign(null);
      setIsStep1Completed(false);
      if (currentPage === 1) fetchCampaigns();
      else setCurrentPage(1);
      return;
    }

    const isCreateMode = !editingCampaign;

    // Show popup ONLY if Step 1 was finished (Next button clicked, ID created)
    if (isCreateMode && isStep1Completed) {
      Swal.fire({
        title: "Campaign In Progress",
        text: "Your campaign is saved, but some steps are still incomplete. You can continue now or complete them later !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Close",
        cancelButtonText: "Keep Editing",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // ✅ User clicked "Close": Clear Local Storage now
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setShowForm(false);
          setEditingCampaign(null);
          setIsStep1Completed(false);
          if (currentPage === 1) fetchCampaigns();
        }
      });
    } else {
      // Step 1 NOT completed: Close silently, but DO NOT clear storage (preserve manual typing)
      setShowForm(false);
      setEditingCampaign(null);
      setIsStep1Completed(false);
    }
  };

  // ✅ handleEdit Logic: Compare campaign ID with draft ID before clearing
  const handleEdit = async (id) => {
    const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw);
        const draftId = parsed?.step1?.id;
        // Only clear localStorage if the ID being edited is the same as the ID in the draft
        if (draftId && String(draftId) === String(id)) {
           localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Error checking draft ID in handleEdit", e);
      }
    }

    setIsFetchingDetails(true);
    try {
      const res = await campaignDiscountApi.getById(id);
      setEditingCampaign(res?.data);
      setIsStep1Completed(false);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to fetch campaign details", err);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result?.isConfirmed) {
        try {
          await campaignDiscountApi.delete(id);
          Swal.fire("Deleted!", "Your campaign has been deleted.", "success");
          if (campaigns?.length === 1 && currentPage > 1) setCurrentPage((prev) => prev - 1);
          else fetchCampaigns();
        } catch (err) {
          const errorMessage = err?.response?.data?.detail || "Failed to delete campaign.";
          Swal.fire({ icon: "error", title: "Cannot Delete", text: errorMessage, confirmButtonColor: "#d33" });
        }
      }
    });
  };

  const handlePause = async (id) => {
    Swal.fire({
      title: "Pause Campaign?",
      text: "Are you sure you want to pause this campaign?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      confirmButtonText: "Yes, Pause it!",
    }).then(async (result) => {
      if (result?.isConfirmed) {
        try {
          setLoading(true);
          await campaignDiscountApi.makerPause(id);
          Swal.fire("Paused!", "Campaign has been paused.", "success");
          fetchCampaigns(); 
        } catch (err) {
          const errorMessage = err?.response?.data?.detail || "Action could not be completed.";
          Swal.fire({ icon: "warning", title: "Unable to Pause", text: errorMessage, confirmButtonColor: "#7747EE" });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleResume = async (id) => {
    Swal.fire({
      title: "Resume Campaign?",
      text: "Are you sure you want to resume this campaign?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      confirmButtonText: "Yes, Resume it!",
    }).then(async (result) => {
      if (result?.isConfirmed) {
        try {
          setLoading(true);
          await campaignDiscountApi.makerResume(id);
          Swal.fire("Resumed!", "Campaign is now active.", "success");
          fetchCampaigns(); 
        } catch (err) {
          const errorMessage = err?.response?.data?.detail || "Action could not be completed.";
          Swal.fire({ icon: "warning", title: "Unable to Resume", text: errorMessage, confirmButtonColor: "#7747EE" });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/view-campaign-details/${id}`, { state: { page: currentPage } });
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-80px)] pl-5 pr-5 pt-5">
      {isFetchingDetails && (
        <div className=" fixed inset-0 bg-white/50 z-[60] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
        </div>
      )}

      <div className="max-w-full space-y-6 w-full flex-1 flex flex-col overflow-y-scroll hide-scroll">
        <div className="flex items-start justify-between ">
          <div>
            <h1 className="head">Campaign Management</h1>
            <p className="para mt-3" style={{ fontSize: "12px" }}>
              Manage discount campaigns, loyalty programs, and promotional offers
            </p>
          </div>

          {showNewCampaignButton && (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-sm ${
                showForm ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" : "btn-primary-violet"
              }`}
              onClick={() => {
                if (showForm) handleFormClose(false);
                else handleNewCampaignClick();
              }}
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Close" : "New Campaign"}
            </button>
          )}
        </div>

        <CampaignForm
          visible={showForm}
          initialData={editingCampaign}
          onRefresh={fetchCampaigns}
          onClose={() => handleFormClose(false)}
          onSuccess={() => handleFormClose(true)}
          onStep1Complete={() => setIsStep1Completed(true)}
        />

        {!showForm && (
          <div className="flex flex-col flex-1">
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3 mb-6 p-1">
              {apiStatusCounts.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => { setSelectedStatusId(item?.id); setCurrentPage(1); }}
                  className={`bg-white py-2 px-3 rounded-md shadow-[0px_2px_4px_0px_#00000006] border flex flex-col justify-center min-h-[50px] cursor-pointer transition-all ${
                    selectedStatusId === item?.id 
                      ? "border-[#7747EE] ring-1 ring-[#7747EE]" 
                      : "border-gray-100"
                  }`}
                >
                <p className="text-[11px] font-normal text-gray-500">
                  {(() => {
                    const name = (item?.name || "").toLowerCase();
                    if (name === "all") return "Total Campaigns";
                    // if (name === "running") return "Active";
                    if (name === "pending delete") return "Pending Delete";
                    return item?.name;
                  })()}
                </p>
                  <span className="text-[15px] font-normal text-gray-700">{item?.count ?? 0}</span>
                </div>
              ))}
            </section>

        


                      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2 mb-6 flex items-center justify-between transition-all duration-300 ">
  {/* Left Section: Search Input with your specific border/focus classes */}
  <div className="flex items-center gap-3">
    <div className="relative group">
      <LucideSearch 
        size={14} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7747EE] transition-colors z-20" 
      />
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Search campaigns..."

        className="pl-9 pr-4 py-2 w-[240px] rounded-lg text-[12px] font-medium text-slate-600   border border-[#E2E8F0] bg-white outline-none transition-all focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] relative focus:z-10 placeholder:text-slate-300"
      />
    </div>
  </div>

  {/* Right Section: Badge Count */}
  <div className="flex items-center gap-2 pr-2">
    <div className="h-4 w-[1px] bg-slate-200 mr-2" />
      <span className="text-[11px] font-normal text-[#64748B] pr-2">
                {totalItems} Campaigns
              </span>
  </div>
</div>



            {loading ? (
              <div className="flex justify-center py-10">
                <span className="text-gray-500 text-sm">Loading campaigns...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {campaigns?.length > 0 ? (
                  campaigns.map((c) => (
                    <CampaignCard
                      c={c}
                      key={c?.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleViewDetails}
                      onPause={handlePause}
                      onResume={handleResume}
                      userType={userType}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500 text-sm">
                    No campaigns found.
                  </div>
                )}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}